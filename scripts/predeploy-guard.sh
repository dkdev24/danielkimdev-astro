#!/usr/bin/env sh
# Pre-deploy guardrail for the manual direct-upload flow (`npm run deploy`).
#
# This is a *warning* gate, not a hard block — Daniel's workflow sometimes
# ships a quick uncommitted tweak on purpose (see HANDOFF "Redeploy"). It
# surfaces the three things that silently bite a manual deploy:
#   1. you're not on `main` (deploy targets `--branch main` = production)
#   2. the working tree is dirty (you're shipping uncommitted changes)
#   3. local `main` is behind/ahead of `origin/main` (prod drifts from git)
#
# Override the prompt non-interactively with:  DEPLOY_ALLOW_DIRTY=1 npm run deploy
set -eu

# Skip the interactive prompt in CI or when explicitly allowed.
ALLOW="${DEPLOY_ALLOW_DIRTY:-0}"

warn() { printf '\033[33m⚠ %s\033[0m\n' "$1" >&2; }
ok()   { printf '\033[32m✓ %s\033[0m\n' "$1" >&2; }

issues=0

# 1. Branch check — production deploys ship to --branch main.
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"
if [ "$branch" != "main" ]; then
  warn "On branch '$branch', not 'main' — \`npm run deploy\` ships this as production (--branch main)."
  issues=$((issues + 1))
fi

# 2. Dirty working tree — uncommitted changes will be in the build.
if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  warn "Working tree has uncommitted changes — these WILL be deployed:"
  git status --short >&2
  issues=$((issues + 1))
fi

# 3. Drift vs origin/main — prod won't match what's pushed to GitHub.
if git rev-parse --verify --quiet origin/main >/dev/null 2>&1; then
  ahead="$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)"
  behind="$(git rev-list --count HEAD..origin/main 2>/dev/null || echo 0)"
  [ "$ahead" -gt 0 ]  && { warn "Local is $ahead commit(s) ahead of origin/main (not pushed)."; issues=$((issues + 1)); }
  [ "$behind" -gt 0 ] && { warn "Local is $behind commit(s) behind origin/main."; issues=$((issues + 1)); }
else
  warn "Could not resolve origin/main (no fetch?) — skipping drift check."
fi

if [ "$issues" -eq 0 ]; then
  ok "Clean: on main, no uncommitted changes, in sync with origin/main."
  exit 0
fi

if [ "$ALLOW" = "1" ]; then
  warn "DEPLOY_ALLOW_DIRTY=1 set — proceeding despite $issues issue(s)."
  exit 0
fi

# Interactive confirm. If there's no TTY (piped/CI without the override), abort safely.
if [ ! -t 0 ]; then
  warn "Non-interactive shell and DEPLOY_ALLOW_DIRTY!=1 — aborting. Re-run with DEPLOY_ALLOW_DIRTY=1 to force."
  exit 1
fi

printf '\033[1mDeploy anyway? [y/N] \033[0m' >&2
read -r reply
case "$reply" in
  [yY] | [yY][eE][sS]) ok "Proceeding with deploy."; exit 0 ;;
  *) warn "Aborted. Nothing was deployed."; exit 1 ;;
esac
