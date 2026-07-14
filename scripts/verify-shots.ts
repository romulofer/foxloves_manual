import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export function verifyShots(): { ok: boolean; problems: string[] } {
  const problems: string[] = [];
  const widgets = JSON.parse(
    readFileSync(join(REPO_ROOT, 'src/lib/data/widgets.json'), 'utf8')
  ) as { id: string }[];
  const manifestPath = join(REPO_ROOT, 'static/shots/manifest.json');
  if (!existsSync(manifestPath)) {
    return { ok: false, problems: ['manifest.json missing — run bun run shots'] };
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<
    string,
    { state: string; file: string }[]
  >;

  for (const w of widgets) {
    if (!manifest[w.id]) {
      problems.push(`no shots for widget "${w.id}"`);
      continue;
    }
    for (const shot of manifest[w.id]) {
      if (!existsSync(join(REPO_ROOT, 'static', shot.file))) {
        problems.push(`missing PNG ${shot.file}`);
      }
    }
  }
  for (const id of Object.keys(manifest)) {
    if (!widgets.find((w) => w.id === id)) {
      problems.push(`manifest has "${id}" not in widgets.json (drift)`);
    }
  }
  return { ok: problems.length === 0, problems };
}

if (import.meta.main) {
  const { ok, problems } = verifyShots();
  if (!ok) {
    console.error('SHOT VERIFY FAILED:\n' + problems.join('\n'));
    process.exit(1);
  }
  console.log('shots verified: all widgets covered, all PNGs present');
}
