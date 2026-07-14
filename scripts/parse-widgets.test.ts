import { expect, test } from 'bun:test';
import { buildWidgetData } from './parse-widgets';

test('buildWidgetData covers every init.lua widget', () => {
  const { widgets, tokens } = buildWidgetData(process.env.FOXLOVES_DIR ?? '../foxloves');
  // init.lua exports 24 widgets
  expect(widgets.length).toBe(24);
  const button = widgets.find((w) => w.id === 'button')!;
  expect(button.options.some((o) => o.name === 'label')).toBe(true);
  expect(tokens.colors.some((c) => c.name === 'accent')).toBe(true);
});
