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

/**
 * Option names + example defaults from the header `.new{ ... }` block.
 * Handles multiple `name = value` pairs on one line and bare `name,` entries.
 * Returns insertion order plus a name→default-literal map (defaults only for
 * `name = value` forms; bare names have no example default).
 */
function headerExample(header: string): { order: string[]; defaults: Map<string, string> } {
  const order: string[] = [];
  const defaults = new Map<string, string>();
  const block = header.match(/\.new{([\s\S]*?)}/);
  if (!block) return { order, defaults };
  for (let line of block[1].split('\n')) {
    line = line.replace(/--.*$/, '').trim(); // strip trailing comment
    if (!line) continue;
    for (const part of line.split(',')) {
      const seg = part.trim();
      if (!seg) continue;
      const kv = seg.match(/^(\w+)\s*=\s*(.+)$/);
      if (kv) {
        if (!order.includes(kv[1])) order.push(kv[1]);
        // Skip placeholder defaults like `<theme table>`.
        if (!/^<.*>$/.test(kv[2].trim())) defaults.set(kv[1], kv[2].trim());
      } else if (/^\w+$/.test(seg)) {
        if (!order.includes(seg)) order.push(seg);
      }
    }
  }
  return { order, defaults };
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
  const example = headerExample(header);
  const body = newMatch[2];
  const optsVar = newMatch[1];

  // Clean assignments give authoritative runtime defaults: `self.x = opts.x or D`.
  const cleanDefault = new Map<string, string | null>();
  const cleanRe = new RegExp(
    `self\\.\\w+\\s*=\\s*${optsVar}\\.(\\w+)\\b(?:\\s+or\\s+([^\\n]+?))?\\s*$`,
    'gm'
  );
  for (const m of body.matchAll(cleanRe)) {
    if (!cleanDefault.has(m[1])) cleanDefault.set(m[1], m[2]?.trim() ?? null);
  }

  // Every option the constructor reads: `opts.NAME` anywhere in the body.
  const bodyReads = new Set<string>();
  for (const m of body.matchAll(new RegExp(`${optsVar}\\.(\\w+)`, 'g'))) bodyReads.add(m[1]);

  // Union: header example order first (public API order), then any extra body reads.
  const names: string[] = [];
  for (const n of example.order) if (!names.includes(n)) names.push(n);
  for (const n of bodyReads) if (!names.includes(n)) names.push(n);

  const options: WidgetOption[] = names.map((name) => {
    let def: string | null;
    if (cleanDefault.has(name)) def = cleanDefault.get(name) ?? null;
    else def = example.defaults.get(name) ?? null;
    if (def && /^default[Tt]heme$/.test(def)) def = '<default theme>';
    const type = inferType(def, name);
    return {
      name,
      default: def,
      type,
      description: descs.get(name),
      isCallback: type === 'function'
    };
  });

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
