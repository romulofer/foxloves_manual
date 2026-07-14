import widgetsJson from './data/widgets.json';
import tokensJson from './data/tokens.json';
import manifestJson from './data/manifest.json';
import type { WidgetDoc, Tokens, Shot } from './types';

export const widgets = widgetsJson as WidgetDoc[];
export const tokens = tokensJson as Tokens;
const manifest = manifestJson as Record<string, Shot[]>;

export function getWidget(id: string): WidgetDoc | undefined {
  return widgets.find((w) => w.id === id);
}
export function shotsFor(id: string): Shot[] {
  return manifest[id] ?? [];
}
export function widgetsByCategory() {
  return {
    control: widgets.filter((w) => w.category === 'control'),
    'container-overlay': widgets.filter((w) => w.category === 'container-overlay')
  };
}
