# Developer Guide: Self-Hosted GPU Image Generation Pipeline on AWS

> **Scope / status:** This is a reusable reference for *future* projects that genuinely need
> AI raster generation (e.g. abstract illustration, batch concept art). It is **not** used by the
> danielkimdev-astro site — that site's only image need is build-time OG social cards, which are
> handled by `astro-og-canvas` (see [`plans/stage-28-og-images.md`](plans/stage-28-og-images.md)).
> Reach for a **hosted pay-per-image API** first; only stand up your own GPU when you need batch
> volume, custom models/LoRAs, or data that can't leave your account. This doc is hardened for that case.

This document provisions an Ubuntu-based GPU instance (`g6.xlarge`), runs a containerized
**Stable Diffusion / Flux** backend (ComfyUI), and generates assets — optimized for **cost**,
**performance**, and **security**, in that priority order.

## Design principles (read first)

1. **Never expose the inference UI/API to the internet.** ComfyUI ships with **no authentication**.
   Port 8188 is reached only over an **SSH tunnel**. The security group opens **port 22 to your IP
   only** — nothing else.
2. **Pay only while generating.** Spot instance + idle auto-stop driven by **GPU** utilization (not
   CPU) + delete-on-termination volumes. Persist model weights so you never re-download or re-pay.
3. **Fail safe under spot interruption.** Treat the box as ephemeral; outputs and inputs live on
   durable storage (S3), so a reclaim loses at most the in-flight image.
4. **Resolve AMIs dynamically** via SSM Parameter Store — never hardcode an AMI ID (they are
   region-specific and rotate).

---

## Prerequisites

* AWS CLI v2, configured. Use a **least-privilege IAM principal** scoped to EC2 + CloudWatch +
  (optional) S3 for this workflow — **not** broad `AmazonEC2FullAccess`.
* An SSH key pair in the target region (referred to below as `my-key-pair`), private key `chmod 600`.
* A GPU vCPU service quota in the region (the `g`/`vt` Spot quota is **0 by default** on new accounts —
  request an increase first, or `run-instances` will fail with `VcpuLimitExceeded`).
* Shell variables used throughout:

```bash
export AWS_REGION=us-east-1
export KEY_NAME=my-key-pair
export MY_IP="$(curl -s https://checkip.amazonaws.com)/32"   # your current public IP only
export MODEL_BUCKET=my-genai-models                          # optional, for weight persistence
```

---

## Step 1: Network & Security Configuration

Open **only** SSH, **only** to your IP. The web UI (8188) is **never** opened publicly — we tunnel it.

```bash
# 1. Create the Security Group (capture the ID into a variable)
export SG_ID=$(aws ec2 create-security-group \
    --region "$AWS_REGION" \
    --group-name gpu-image-gen-sg \
    --description "GPU image generation — SSH from owner IP only" \
    --output text --query 'GroupId')
echo "Security group: $SG_ID"

# 2. SSH access from YOUR IP only (never 0.0.0.0/0)
aws ec2 authorize-security-group-ingress \
    --region "$AWS_REGION" \
    --group-id "$SG_ID" \
    --protocol tcp --port 22 --cidr "$MY_IP"

# NOTE: We deliberately do NOT open port 8188. ComfyUI has no auth; exposing it
# publicly = an open image API + RCE-adjacent surface. Reach it via SSH tunnel (Step 4).
```

---

## Step 2: Provision the GPU Instance (`g6.xlarge` Spot)

Resolve the AMI dynamically. The **AWS Deep Learning OSS Nvidia Driver AMI** ships the host NVIDIA
driver + Docker + NVIDIA Container Toolkit preinstalled — so `--gpus all` works immediately and you
skip a slow, error-prone driver install (a plain Ubuntu AMI has **no** GPU driver).

```bash
# Resolve the latest Deep Learning AMI ID via SSM (region-correct, never stale).
# Browse parameters: aws ssm get-parameters-by-path --path /aws/service/deeplearning --recursive
export AMI_ID=$(aws ssm get-parameter \
    --region "$AWS_REGION" \
    --name /aws/service/deeplearning/ami/x86_64/oss-nvidia-driver-gpu-ubuntu-22.04/latest/ami-id \
    --query 'Parameter.Value' --output text)
echo "AMI: $AMI_ID"

export INSTANCE_ID=$(aws ec2 run-instances \
    --region "$AWS_REGION" \
    --image-id "$AMI_ID" \
    --instance-type g6.xlarge \
    --key-name "$KEY_NAME" \
    --security-group-ids "$SG_ID" \
    --instance-market-options '{"MarketType":"spot","SpotOptions":{"SpotInstanceType":"one-time","InstanceInterruptionBehavior":"terminate"}}' \
    --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":100,"VolumeType":"gp3","DeleteOnTermination":true,"Encrypted":true}}]' \
    --metadata-options 'HttpTokens=required' \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=POC-Image-Gen}]' \
    --query 'Instances[0].InstanceId' --output text)
echo "Instance: $INSTANCE_ID"
```

Cost/perf notes:
- **`g6.xlarge`** = 1× NVIDIA L4 (24 GB) — fits SDXL and Flux.1 [schnell]. On-demand ≈ \$0.80/hr;
  **Spot typically \$0.25–0.40/hr.**
- `DeleteOnTermination:true` + `Encrypted:true`: no orphaned (or unencrypted) EBS billing after teardown.
- `HttpTokens=required`: enforces **IMDSv2**, closing the SSRF→credential-theft path.
- 100 GB is plenty when weights live on S3 (Step 4); bump only if caching many large checkpoints locally.

---

## Step 3: Get the Public IP & wait until ready

```bash
aws ec2 wait instance-running --region "$AWS_REGION" --instance-ids "$INSTANCE_ID"

export INSTANCE_IP=$(aws ec2 describe-instances \
    --region "$AWS_REGION" \
    --instance-ids "$INSTANCE_ID" \
    --query "Reservations[0].Instances[0].PublicIpAddress" \
    --output text)
echo "Public IP: $INSTANCE_IP"
```

---

## Step 4: Connect via SSH Tunnel & start the backend

Forward the remote UI port to **localhost** — the only way to reach 8188. The UI is then at
`http://localhost:8188` in your browser; nothing is exposed to the internet.

```bash
ssh -i "${KEY_NAME}.pem" -L 8188:localhost:8188 ubuntu@"$INSTANCE_IP"
```

On the instance, the driver/Docker/toolkit are already present (DL AMI). Verify the GPU, then run
ComfyUI bound to **loopback only**:

```bash
# Confirm the GPU is visible to containers
sudo docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi

# Run ComfyUI bound to 127.0.0.1 (NOT 0.0.0.0) — reachable only through the SSH tunnel.
sudo docker run -d --name image-gen-backend --restart unless-stopped \
  --gpus all \
  -p 127.0.0.1:8188:8188 \
  -v ~/models:/workspace/ComfyUI/models \
  -v ~/output:/workspace/ComfyUI/output \
  yanwk/comfyui-boot:latest
```

### Persist model weights on S3 (don't re-download every launch)

Re-downloading multi-GB checkpoints on every boot wastes time and bandwidth. Sync from a private
S3 bucket instead (attach an instance role with read access to it — never bake credentials in).

```bash
# Pull cached weights down (fast, in-region, no public Hugging Face round-trip)
aws s3 sync "s3://${MODEL_BUCKET}/checkpoints/" ~/models/checkpoints/

# First-time only: fetch from Hugging Face, then push to S3 for reuse.
# (Verify the exact filename on the model card — it changes between releases.)
cd ~/models/checkpoints
curl -L -o sd_xl_base_1.0.safetensors \
  https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors
aws s3 sync ~/models/checkpoints/ "s3://${MODEL_BUCKET}/checkpoints/"
```

> Tip: write generated images to `~/output` and `aws s3 sync ~/output s3://.../output/` so a spot
> interruption never costs you finished assets.

---

## Step 5: Idle auto-stop (GPU-based) — don't pay for an idle box

The earlier CPU-based alarm was wrong: image generation is **GPU**-bound and can leave CPU low
*during* a job, risking a shutdown mid-render. Watch **GPU utilization** instead. The DL AMI's
CloudWatch agent can publish `nvidia_smi_utilization_gpu`; alarm on a sustained low reading and
**stop** (not terminate) so an attached EBS keeps your cache.

```bash
aws cloudwatch put-metric-alarm \
    --region "$AWS_REGION" \
    --alarm-name "Stop-Idle-GPU-${INSTANCE_ID}" \
    --namespace CWAgent \
    --metric-name nvidia_smi_utilization_gpu \
    --dimensions Name=InstanceId,Value="$INSTANCE_ID" \
    --statistic Maximum \
    --period 300 \
    --evaluation-periods 3 \
    --threshold 5 \
    --comparison-operator LessThanOrEqualToThreshold \
    --treat-missing-data notBreaching \
    --alarm-actions "arn:aws:automate:${AWS_REGION}:ec2:stop"
```

Cheap belt-and-suspenders: a self-stop timer inside the box, in case the agent/metric isn't wired:

```bash
# Stop the instance after 60 min regardless (uses IMDSv2 token)
echo 'TOKEN=$(curl -sX PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 60"); \
IID=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id); \
aws ec2 stop-instances --region '"$AWS_REGION"' --instance-ids $IID' | sudo tee /usr/local/bin/self-stop.sh
sudo chmod +x /usr/local/bin/self-stop.sh
echo "sudo /usr/local/bin/self-stop.sh" | at now + 60 minutes
```

> `stop` (not terminate) keeps the gp3 cache; you pay only EBS-at-rest (~\$0.08/GB-mo) while stopped.
> If you won't return soon, **terminate** (Step 6) to drop EBS too.

---

## Step 6: Clean Up & Terminate

Order matters: a security group can't be deleted while an instance still references it, so terminate
first and wait. With `DeleteOnTermination:true` the EBS volume goes with the instance — no orphans.

```bash
# Push any final outputs to durable storage first
# (run on the instance): aws s3 sync ~/output "s3://${MODEL_BUCKET}/output/"

aws ec2 terminate-instances --region "$AWS_REGION" --instance-ids "$INSTANCE_ID"
aws ec2 wait instance-terminated --region "$AWS_REGION" --instance-ids "$INSTANCE_ID"

# Now the SG has no dependents and deletes cleanly
aws ec2 delete-security-group --region "$AWS_REGION" --group-id "$SG_ID"

# Remove the idle alarm so it doesn't linger
aws cloudwatch delete-alarms --region "$AWS_REGION" --alarm-names "Stop-Idle-GPU-${INSTANCE_ID}"
```

---

## Cost / performance / security summary

| Concern | Approach |
| --- | --- |
| **Cost** | Spot (~50–60% off); S3-cached weights (no re-download); GPU idle auto-stop + 60-min self-stop; `DeleteOnTermination` + alarm cleanup so nothing lingers. |
| **Performance** | DL AMI = drivers preinstalled (no slow setup); L4/24 GB fits SDXL + Flux schnell; in-region S3 sync beats public HF pulls. |
| **Security** | SSH from your IP only; UI bound to loopback + reached via SSH tunnel (never public); IMDSv2 required; encrypted EBS; least-privilege IAM + instance role (no baked keys). |

## When NOT to use this

If you need only a handful of images, or deterministic/branded assets (OG cards, diagrams, hero
text-art), skip the GPU entirely: use a **hosted image-gen API** (pay-per-image, zero infra, no open
ports) or a **build-time templating** library. Self-hosting a GPU only pays off at batch volume,
with custom models/LoRAs, or when inputs must stay inside your account.
