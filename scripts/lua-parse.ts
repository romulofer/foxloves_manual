export interface WidgetRef {
  displayName: string;
  module: string;
}
export interface ThemeColor {
  name: string;
  rgba: [number, number, number, number];
  hex: string;
  rgbaCss: string;
  note?: string;
}
export interface ParsedTheme {
  colors: ThemeColor[];
  radius: number;
  padding: number;
}

/** Widgets exported from init.lua — only `require("foxloves.widgets.X")` entries. */
export function parseInitExports(src: string): WidgetRef[] {
  const re = /(\w+)\s*=\s*require\("foxloves\.widgets\.(\w+)"\)/g;
  const out: WidgetRef[] = [];
  for (const m of src.matchAll(re)) out.push({ displayName: m[1], module: m[2] });
  return out;
}

export function luaColorToHex(rgba: number[]): string {
  const to = (f: number) =>
    Math.round(Math.max(0, Math.min(1, f)) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(rgba[0])}${to(rgba[1])}${to(rgba[2])}`;
}

function rgbaCss(rgba: number[]): string {
  const c = rgba.map((f, i) => (i < 3 ? Math.round(f * 255) : f));
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${rgba[3] ?? 1})`;
}

export function parseTheme(src: string): ParsedTheme {
  const colorBlock = src.match(/color\s*=\s*{([\s\S]*?)\n\s*},/);
  const colors: ThemeColor[] = [];
  if (colorBlock) {
    const re = /(\w+)\s*=\s*{([^}]*)}\s*,?\s*(?:--\s*(.*))?/g;
    for (const m of colorBlock[1].matchAll(re)) {
      const nums = m[2]
        .split(',')
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !Number.isNaN(n));
      const rgba = [nums[0], nums[1], nums[2], nums[3] ?? 1] as [number, number, number, number];
      colors.push({
        name: m[1],
        rgba,
        hex: luaColorToHex(rgba),
        rgbaCss: rgbaCss(rgba),
        note: m[3]?.trim() || undefined
      });
    }
  }
  const radius = parseInt(src.match(/radius\s*=\s*(\d+)/)?.[1] ?? '0', 10);
  const padding = parseInt(src.match(/padding\s*=\s*(\d+)/)?.[1] ?? '0', 10);
  return { colors, radius, padding };
}
