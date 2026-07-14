import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseInitExports, parseTheme, type ParsedTheme } from './lua-parse';
import { parseWidget, type WidgetDoc } from './widget-parse';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export interface WidgetData {
  widgets: WidgetDoc[];
  tokens: ParsedTheme;
}

export function buildWidgetData(foxDir: string): WidgetData {
  const fox = join(REPO_ROOT, foxDir);
  const init = readFileSync(join(fox, 'foxloves/init.lua'), 'utf8');
  const refs = parseInitExports(init);
  const CONTAINER = new Set([
    'Panel',
    'Modal',
    'Dropdown',
    'Tooltip',
    'Tabs',
    'ListBox',
    'ContextMenu',
    'ToastHost'
  ]);

  const widgets = refs.map((ref) => {
    const src = readFileSync(join(fox, `foxloves/widgets/${ref.module}.lua`), 'utf8');
    const doc = parseWidget(ref.module, ref.displayName, src);
    return {
      ...doc,
      category: CONTAINER.has(ref.displayName)
        ? ('container-overlay' as const)
        : ('control' as const)
    };
  });

  const tokens = parseTheme(readFileSync(join(fox, 'foxloves/theme.lua'), 'utf8'));
  return { widgets, tokens };
}

export function writeWidgetData(foxDir: string): void {
  const { widgets, tokens } = buildWidgetData(foxDir);
  const outDir = join(REPO_ROOT, 'src/lib/data');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'widgets.json'), JSON.stringify(widgets, null, 2));
  writeFileSync(join(outDir, 'tokens.json'), JSON.stringify(tokens, null, 2));
  console.log(`parsed ${widgets.length} widgets, ${tokens.colors.length} colors`);
}

if (import.meta.main) writeWidgetData(process.env.FOXLOVES_DIR ?? '../foxloves');
