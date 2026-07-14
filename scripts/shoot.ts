import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, rmSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SAVE_DIR = join(homedir(), '.local/share/love/foxloves-manual-shots');
const DEST = join(REPO_ROOT, 'static/shots');

const res = spawnSync('love', ['harness'], { cwd: REPO_ROOT, stdio: 'inherit' });
if (res.status !== 0) console.warn(`harness exited ${res.status} (some widgets failed; see errors.txt)`);

const src = join(SAVE_DIR, 'shots');
if (!existsSync(src)) throw new Error(`no shots produced at ${src}`);
rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });
cpSync(src, DEST, { recursive: true });
console.log(`copied shots -> ${DEST}`);
