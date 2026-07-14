import { expect, test } from 'bun:test';
import { parseInitExports, parseTheme, luaColorToHex } from './lua-parse';

const INIT = `local M = {
  theme       = require("foxloves.theme"),
  util        = require("foxloves.util"),
  Root        = require("foxloves.root"),
  Button      = require("foxloves.widgets.button"),
  SegmentedControl = require("foxloves.widgets.segmentedcontrol"),
}
return M`;

test('parseInitExports returns only widgets under widgets.*', () => {
  const list = parseInitExports(INIT);
  expect(list).toEqual([
    { displayName: 'Button', module: 'button' },
    { displayName: 'SegmentedControl', module: 'segmentedcontrol' }
  ]);
});

const THEME = `local M = {
  color = {
    bg     = {0.16, 0.17, 0.20, 1.0},
    accent = {0.90, 0.55, 0.25, 1.0}, -- fox orange
  },
  radius  = 4,
  padding = 8,
}
return M`;

test('parseTheme extracts colors + metrics', () => {
  const t = parseTheme(THEME);
  expect(t.radius).toBe(4);
  expect(t.padding).toBe(8);
  expect(t.colors.find((c) => c.name === 'accent')).toMatchObject({
    rgba: [0.9, 0.55, 0.25, 1],
    note: 'fox orange'
  });
});

test('luaColorToHex converts 0..1 floats', () => {
  expect(luaColorToHex([0.9, 0.55, 0.25, 1])).toBe('#e68c40');
});
