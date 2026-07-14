import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function run(cmd: string, args: string[]) {
  const r = spawnSync(cmd, args, { cwd: REPO_ROOT, stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed (${r.status})`);
}

run('bun', ['run', 'scripts/parse-widgets.ts']);
run('bun', ['run', 'scripts/shoot.ts']);
run('bun', ['run', 'scripts/verify-shots.ts']);
console.log('generate complete');
