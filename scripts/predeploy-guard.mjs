#!/usr/bin/env node
// Pre-deploy guardrail for the manual direct-upload flow (`npm run deploy`).
//
// This is a *warning* gate, not a hard block — Daniel's workflow sometimes
// ships a quick uncommitted tweak on purpose (see HANDOFF "Redeploy"). It
// surfaces the three things that silently bite a manual deploy:
//   1. you're not on `main` (deploy targets `--branch main` = production)
//   2. the working tree is dirty (you're shipping uncommitted changes)
//   3. local `main` is behind/ahead of `origin/main` (prod drifts from git)
//
// Node, not a POSIX shell script: npm on Windows runs scripts via cmd.exe,
// whose PATH usually only has `Git\cmd` (git.exe), not `Git\bin`/`Git\usr\bin`
// (sh.exe, bash.exe) — so a bare `sh scripts/predeploy-guard.sh` predeploy
// hook fails with "sh not found" outside a Git Bash / WSL shell, even though
// `git` itself resolves fine. Node is already a hard requirement (astro/npm),
// so this runs identically on Windows, macOS, and Linux.
//
// Override the prompt non-interactively with:  DEPLOY_ALLOW_DIRTY=1 npm run deploy

import { execFileSync } from 'node:child_process';
import { createInterface } from 'node:readline';

const allow = process.env.DEPLOY_ALLOW_DIRTY === '1';

function warn(msg) {
	process.stderr.write(`[33m⚠ ${msg}[0m\n`);
}
function ok(msg) {
	process.stderr.write(`[32m✓ ${msg}[0m\n`);
}

function git(args) {
	try {
		return execFileSync('git', args, { encoding: 'utf8' }).trim();
	} catch {
		return '';
	}
}

let issues = 0;

// 1. Branch check — production deploys ship to --branch main.
const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']) || '?';
if (branch !== 'main') {
	warn(`On branch '${branch}', not 'main' — \`npm run deploy\` ships this as production (--branch main).`);
	issues += 1;
}

// 2. Dirty working tree — uncommitted changes will be in the build.
const status = git(['status', '--porcelain']);
if (status !== '') {
	warn('Working tree has uncommitted changes — these WILL be deployed:');
	process.stderr.write(`${git(['status', '--short'])}\n`);
	issues += 1;
}

// 3. Drift vs origin/main — prod won't match what's pushed to GitHub.
const hasOriginMain = (() => {
	try {
		execFileSync('git', ['rev-parse', '--verify', '--quiet', 'origin/main'], { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
})();

if (hasOriginMain) {
	const ahead = Number(git(['rev-list', '--count', 'origin/main..HEAD']) || '0');
	const behind = Number(git(['rev-list', '--count', 'HEAD..origin/main']) || '0');
	if (ahead > 0) {
		warn(`Local is ${ahead} commit(s) ahead of origin/main (not pushed).`);
		issues += 1;
	}
	if (behind > 0) {
		warn(`Local is ${behind} commit(s) behind origin/main.`);
		issues += 1;
	}
} else {
	warn('Could not resolve origin/main (no fetch?) — skipping drift check.');
}

if (issues === 0) {
	ok('Clean: on main, no uncommitted changes, in sync with origin/main.');
	process.exit(0);
}

if (allow) {
	warn(`DEPLOY_ALLOW_DIRTY=1 set — proceeding despite ${issues} issue(s).`);
	process.exit(0);
}

// Interactive confirm. If there's no TTY (piped/CI without the override), abort safely.
if (!process.stdin.isTTY) {
	warn('Non-interactive shell and DEPLOY_ALLOW_DIRTY!=1 — aborting. Re-run with DEPLOY_ALLOW_DIRTY=1 to force.');
	process.exit(1);
}

const rl = createInterface({ input: process.stdin, output: process.stderr });
rl.question('[1mDeploy anyway? [y/N] [0m', (reply) => {
	rl.close();
	if (/^y(es)?$/i.test(reply.trim())) {
		ok('Proceeding with deploy.');
		process.exit(0);
	} else {
		warn('Aborted. Nothing was deployed.');
		process.exit(1);
	}
});
