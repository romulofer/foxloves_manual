import { expect, test } from 'bun:test';
import { parseWidget } from './widget-parse';

const BUTTON = `-- Button widget.
--
-- Button.new{
--   x, y, w, h,           -- bounds
--   label = "OK",          -- text drawn centered
--   onClick = function() end,
--   disabled = false,
--   theme = <theme table>,  -- optional, falls back to default
-- }
--
-- Fires onClick on mouserelease inside bounds when the press also began
-- inside bounds.

local Button = {}
Button.__index = Button

function Button.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Button)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.w = opts.w or 120
  self.h = opts.h or 32
  self.label = opts.label or "Button"
  self.onClick = opts.onClick
  self.disabled = opts.disabled or false
  self.theme = opts.theme or defaultTheme
  self.focusable = true
  return self
end

function Button:keypressed(key)
  if key == "space" or key == "return" or key == "kpenter" then return true end
  return false
end

return Button`;

test('parseWidget extracts title + summary prose', () => {
  const w = parseWidget('button', 'Button', BUTTON);
  expect(w.displayName).toBe('Button');
  expect(w.summary).toContain('Fires onClick on mouserelease');
});

test('parseWidget extracts options with defaults + descriptions', () => {
  const w = parseWidget('button', 'Button', BUTTON);
  const label = w.options.find((o) => o.name === 'label')!;
  // Real default comes from the `.new` body (`or "Button"`), not the header example.
  expect(label).toMatchObject({ default: '"Button"', type: 'string', description: 'text drawn centered' });
  const onClick = w.options.find((o) => o.name === 'onClick')!;
  expect(onClick.isCallback).toBe(true);
  const disabled = w.options.find((o) => o.name === 'disabled')!;
  expect(disabled).toMatchObject({ default: 'false', type: 'boolean' });
});

test('parseWidget detects capabilities', () => {
  const w = parseWidget('button', 'Button', BUTTON);
  expect(w.capabilities.focusable).toBe(true);
  expect(w.capabilities.keys).toEqual(['space', 'return', 'kpenter']);
});

const SLIDER = `-- Slider widget.
--
-- Slider.new{
--   x, y, w,
--   value = 0, min = 0, max = 1,
--   onChange = function(value) end,
-- }
--
-- Drag a handle to pick a value.

function Slider.new(opts)
  local self = setmetatable({}, Slider)
  self.min = opts.min or 0
  self.value = util.clamp(opts.value or self.min, self.min, self.max)
  self.onChange = opts.onChange
  return self
end
return Slider`;

test('parseWidget captures options whose default is wrapped in a call', () => {
  const w = parseWidget('slider', 'Slider', SLIDER);
  const value = w.options.find((o) => o.name === 'value')!;
  expect(value).toBeDefined();
  // No clean `self.value = opts.value or X`, so default comes from the header example.
  expect(value.default).toBe('0');
});

test('parseWidget fills common options from the glossary when the header omits them', () => {
  const w = parseWidget('button', 'Button', BUTTON);
  const x = w.options.find((o) => o.name === 'x')!;
  expect(x.description).toBe('X position, in pixels.');
  expect(x.type).toBe('number');
  // Header-provided descriptions still win over the glossary.
  const label = w.options.find((o) => o.name === 'label')!;
  expect(label.description).toBe('text drawn centered');
});

test('parseWidget gives no-default common options a glossary type', () => {
  const w = parseWidget('slider', 'Slider', SLIDER);
  // `step` is read as opts.step with no `or` default → would be 'any' without the glossary.
  const value = w.options.find((o) => o.name === 'value')!;
  expect(value.type).toBe('number');
  expect(value.description).toBe('Current value.');
});

test('parseWidget throws on malformed source', () => {
  expect(() => parseWidget('bad', 'Bad', '-- no new function here\nreturn {}')).toThrow(/Bad/);
});
