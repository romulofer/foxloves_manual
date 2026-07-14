export interface WidgetOption {
  name: string;
  default: string | null;
  type: 'string' | 'number' | 'boolean' | 'function' | 'table' | 'any';
  description?: string;
  isCallback: boolean;
}
export interface WidgetCapabilities {
  focusable: boolean;
  keys: string[];
  wheel: boolean;
  mousemoved: boolean;
}
export interface WidgetDoc {
  id: string;
  displayName: string;
  title: string;
  summary: string;
  options: WidgetOption[];
  capabilities: WidgetCapabilities;
  sourceExcerpt: string;
  category?: 'control' | 'container-overlay';
}

/** Contiguous leading `--` comment block. */
function headerBlock(src: string): string {
  const lines = src.split('\n');
  const out: string[] = [];
  for (const l of lines) {
    if (l.startsWith('--')) out.push(l.replace(/^--\s?/, ''));
    else if (out.length) break;
    else if (l.trim() === '') continue;
    else break;
  }
  return out.join('\n');
}

/** Descriptions keyed by option name, from the `.new{ ... }` example in the header. */
function headerDescriptions(header: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /^\s*(\w+)[^,]*,?\s*--\s*(.*)$/;
  for (const line of header.split('\n')) {
    const m = line.match(re);
    if (m) map.set(m[1], m[2].trim());
  }
  return map;
}

function inferType(def: string | null, name: string): WidgetOption['type'] {
  if (def === 'false' || def === 'true') return 'boolean';
  if (def && /^-?\d+(\.\d+)?$/.test(def)) return 'number';
  if (def && /^".*"$/.test(def)) return 'string';
  if (def && /^function/.test(def)) return 'function';
  if (def && /^{.*}$/.test(def)) return 'table';
  if (/^on[A-Z]/.test(name) || /^format$/.test(name)) return 'function';
  return 'any';
}

export function parseWidget(id: string, displayName: string, src: string): WidgetDoc {
  const newMatch = src.match(/function\s+[\w.]+\.new\((\w+)\)([\s\S]*?)\nend/);
  if (!newMatch) throw new Error(`parseWidget: no .new(opts) in widget "${displayName}" (${id})`);
  const header = headerBlock(src);
  if (!header) throw new Error(`parseWidget: no header comment in widget "${displayName}" (${id})`);

  const descs = headerDescriptions(header);
  const body = newMatch[2];
  const optsVar = newMatch[1];
  const assignRe = new RegExp(
    `self\\.(\\w+)\\s*=\\s*${optsVar}\\.(\\w+)\\b(?:\\s+or\\s+([^\\n]+?))?\\s*$`,
    'gm'
  );
  const seen = new Set<string>();
  const options: WidgetOption[] = [];
  for (const m of body.matchAll(assignRe)) {
    const name = m[2];
    if (seen.has(name)) continue;
    seen.add(name);
    let def: string | null = m[3]?.trim() ?? null;
    if (def && /^default[Tt]heme$/.test(def)) def = '<default theme>';
    const type = inferType(def, name);
    options.push({
      name,
      default: def,
      type,
      description: descs.get(name),
      isCallback: type === 'function'
    });
  }

  // Summary = prose paragraphs of the header that are NOT the `.new{ ... }` block.
  const summary = header
    .replace(/[\w.]+\.new{[\s\S]*?}\n?/g, '')
    .split('\n')
    .filter((l) => l.trim() && !/^\s*\w+\s*[,=]/.test(l))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const title = header.split('\n')[0].replace(/\.$/, '');

  const keys = [...src.matchAll(/key\s*==\s*"([^"]+)"/g)].map((m) => m[1]);
  const capabilities: WidgetCapabilities = {
    focusable: /self\.focusable\s*=\s*true/.test(src),
    keys: [...new Set(keys)],
    wheel: /function\s+[\w.]+:wheelmoved\([^)]*\)\s*[\s\S]*?return\s+true/.test(src),
    mousemoved: /function\s+[\w.]+:mousemoved\(/.test(src)
  };

  return { id, displayName, title, summary, options, capabilities, sourceExcerpt: newMatch[0] };
}
