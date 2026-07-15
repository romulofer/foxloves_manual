const s=[{id:"button",displayName:"Button",title:"Button widget",summary:"Button widget. Fires onClick on mouserelease inside bounds when the press also began inside bounds. Input handlers return true when they consume the event.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"w",default:"120",type:"number",description:"Width, in pixels.",isCallback:!1},{name:"h",default:"32",type:"number",description:"Height, in pixels.",isCallback:!1},{name:"label",default:'"Button"',type:"string",description:"text drawn centered",isCallback:!1},{name:"onClick",default:null,type:"function",description:"Called when activated.",isCallback:!0},{name:"disabled",default:"false",type:"boolean",description:"Greys the widget out and ignores input.",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"optional, falls back to default",isCallback:!1}],capabilities:{focusable:!0,keys:["space","return","kpenter"],wheel:!1,mousemoved:!0},sourceExcerpt:`function Button.new(opts)
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
  self.hovered = false
  self.pressed = false
  self.focusable = true
  return self
end`,category:"control"},{id:"textbox",displayName:"Textbox",title:"Textbox widget: single-line text input with a blinking caret",summary:"Textbox widget: single-line text input with a blinking caret. Click to focus, click elsewhere to blur. Supports text entry, backspace, forward delete, and caret movement with left/right/Home/End. Fires onChange(newValue) on any edit; Enter fires onSubmit(value) and blurs. Selection & clipboard: hold Shift with arrows/Home/End (or Shift-click) to select a range; Ctrl+A selects all; Ctrl+C/X/V copy/cut/paste via the system clipboard. Typing, Backspace, Delete, or paste replaces the active selection.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"w",default:"200",type:"number",description:"Width, in pixels.",isCallback:!1},{name:"h",default:"32",type:"number",description:"Height, in pixels.",isCallback:!1},{name:"value",default:'""',type:"string",description:"Current value.",isCallback:!1},{name:"placeholder",default:'""',type:"string",description:"Hint shown while empty.",isCallback:!1},{name:"onChange",default:null,type:"function",description:"Called when the value changes.",isCallback:!0},{name:"onSubmit",default:null,type:"function",description:"fired on Enter (then blurs)",isCallback:!0},{name:"maxLength",default:null,type:"number",description:"optional cap",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!0,keys:["a","c","x","v","left","right","backspace","delete","return","kpenter","home","end"],wheel:!1,mousemoved:!1},sourceExcerpt:`function Textbox.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Textbox)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.w = opts.w or 200
  self.h = opts.h or 32
  self.value = opts.value or ""
  self.placeholder = opts.placeholder or ""
  self.onChange = opts.onChange
  self.onSubmit = opts.onSubmit
  self.maxLength = opts.maxLength
  self.theme = opts.theme or defaultTheme
  self.focused = false
  self.caret = #self.value      -- caret position, in bytes (ASCII-safe)
  self.anchor = nil             -- selection anchor (byte index); nil = no selection
  self.scrollX = 0              -- horizontal pixel offset to keep caret in view
  self.blink = 0
  self.blinkOn = true
  self.focusable = true
  return self
end`,category:"control"},{id:"label",displayName:"Label",title:"Label widget: static, non-interactive text",summary:'Label widget: static, non-interactive text. With w set, draws via printf (wraps at w, honors align). With truncate = true it stays on one line and appends "…" when the text is wider than w. Without w, draws a single line via print. text is mutable at runtime (label.text = "...").',options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"w",default:null,type:"number",description:"optional; enables alignment (uses printf)",isCallback:!1},{name:"h",default:null,type:"number",description:"optional; enables vertical alignment within h",isCallback:!1},{name:"text",default:'""',type:"string",description:"Displayed text.",isCallback:!1},{name:"align",default:'"left"',type:"string",description:'"left" | "center" | "right" (needs w)',isCallback:!1},{name:"valign",default:'"top"',type:"string",description:'"top" | "middle" | "bottom" (needs h)',isCallback:!1},{name:"color",default:null,type:"any",description:"table; overrides theme color",isCallback:!1},{name:"muted",default:"false",type:"boolean",description:"shortcut for theme.color.textMuted",isCallback:!1},{name:"truncate",default:"false",type:"boolean",description:"with w: clip to one line, ellipsis on overflow",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!1,keys:[],wheel:!1,mousemoved:!1},sourceExcerpt:`function Label.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Label)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.w = opts.w
  self.h = opts.h
  self.text = opts.text or ""
  self.align = opts.align or "left"
  self.valign = opts.valign or "top"
  self.color = opts.color
  self.muted = opts.muted or false
  self.truncate = opts.truncate or false
  self.theme = opts.theme or defaultTheme
  return self
end`,category:"control"},{id:"badge",displayName:"Badge",title:"Badge / Tag / Chip widget: a small rounded label for counts or status",summary:"Badge / Tag / Chip widget: a small rounded label for counts or status. Self-sizes to its text (pill-shaped); optionally removable as a chip. Non-interactive unless `removable`. Exposes computed self.w/self.h and a :measure() returning w,h so layout containers can place it. `text` is mutable via setText, which re-measures.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"text",default:'""',type:"string",description:"Displayed text.",isCallback:!1},{name:"color",default:null,type:"any",description:"fill override (table); default theme.color.accent",isCallback:!1},{name:"textColor",default:null,type:"any",description:"label color override; default theme.color.bg",isCallback:!1},{name:"removable",default:"false",type:"boolean",description:"draw a × hitbox on the right; fires onRemove on click",isCallback:!1},{name:"onRemove",default:null,type:"function",description:"Called when removed.",isCallback:!0},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!1,keys:[],wheel:!1,mousemoved:!0},sourceExcerpt:`function Badge.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Badge)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.text = opts.text or ""
  self.color = opts.color
  self.textColor = opts.textColor
  self.removable = opts.removable or false
  self.onRemove = opts.onRemove
  self.theme = opts.theme or defaultTheme
  self.removeHovered = false
  self.removePressed = false
  measureSelf(self)
  return self
end`,category:"control"},{id:"avatar",displayName:"Avatar",title:"Avatar / Image widget: a framed image, circle or rounded square, with an",summary:"Avatar / Image widget: a framed image, circle or rounded square, with an initials fallback when no image is given. Non-interactive. Exposes self.w/self.h (= size) and :measure() so layout containers can place it.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"size",default:"40",type:"number",description:"square; w = h = size",isCallback:!1},{name:"image",default:null,type:"any",description:"love Image; cover-scaled and cropped to the frame",isCallback:!1},{name:"name",default:"nil",type:"any",description:'derives fallback initials ("Red Fox" -> "RF")',isCallback:!1},{name:"initials",default:"initialsFromName(opts.name)",type:"any",description:"explicit override; wins over name",isCallback:!1},{name:"shape",default:'"circle"',type:"string",description:'"circle" | "rounded"',isCallback:!1},{name:"color",default:null,type:"any",description:"fallback fill when there is no image; default accent",isCallback:!1},{name:"textColor",default:null,type:"any",description:"initials color; default theme.color.bg",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!1,keys:[],wheel:!1,mousemoved:!1},sourceExcerpt:`function Avatar.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Avatar)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.size = opts.size or 40
  self.w, self.h = self.size, self.size
  self.image = opts.image
  self.initials = opts.initials or initialsFromName(opts.name)
  self.shape = opts.shape or "circle"
  self.color = opts.color
  self.textColor = opts.textColor
  self.theme = opts.theme or defaultTheme
  return self
end`,category:"control"},{id:"divider",displayName:"Divider",title:"Divider widget: a static separator line",summary:"Divider widget: a static separator line. Non-interactive. Draws one line in theme.color.border. With a label (and horizontal), splits the line around centered muted text.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"length",default:"100",type:"number",description:"Line length, in pixels.",isCallback:!1},{name:"vertical",default:"false",type:"boolean",description:"false = horizontal, true = vertical",isCallback:!1},{name:"thickness",default:"1",type:"number",description:"Line thickness, in pixels.",isCallback:!1},{name:"label",default:null,type:"string",description:'horizontal only: centered "— OR —" text',isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!1,keys:[],wheel:!1,mousemoved:!1},sourceExcerpt:`function Divider.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Divider)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.length = opts.length or 100
  self.vertical = opts.vertical or false
  self.thickness = opts.thickness or 1
  self.label = opts.label
  self.theme = opts.theme or defaultTheme
  return self
end`,category:"control"},{id:"progressbar",displayName:"ProgressBar",title:"ProgressBar widget: read-only value display",summary:"ProgressBar widget: read-only value display. Non-interactive. Draws a background track with an accent fill sized to clamp((value - min) / (max - min), 0, 1). Set bar.value to update; the fill eases toward the new fraction unless animated == false. In indeterminate mode value/min/max are ignored and a fixed-width chunk cycles across the track to signal ongoing work of unknown duration (set bar.indeterminate to toggle).",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"w",default:"200",type:"number",description:"Width, in pixels.",isCallback:!1},{name:"h",default:"16",type:"number",description:"Height, in pixels.",isCallback:!1},{name:"value",default:"0",type:"number",description:"Current value.",isCallback:!1},{name:"min",default:"0",type:"number",description:"Minimum value.",isCallback:!1},{name:"max",default:"1",type:"number",description:"Maximum value.",isCallback:!1},{name:"animated",default:"true",type:"boolean",description:"ease the fill toward value in update(dt)",isCallback:!1},{name:"indeterminate",default:"false",type:"boolean",description:"unknown-progress mode: a chunk slides across the track",isCallback:!1},{name:"label",default:null,type:"string",description:'true = "NN%", a string, or function(value,min,max,frac)',isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!1,keys:[],wheel:!1,mousemoved:!1},sourceExcerpt:`function ProgressBar.new(opts)
  opts = opts or {}
  local self = setmetatable({}, ProgressBar)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.w = opts.w or 200
  self.h = opts.h or 16
  self.value = opts.value or 0
  self.min = opts.min or 0
  self.max = opts.max or 1
  self.animated = opts.animated ~= false
  self.indeterminate = opts.indeterminate or false
  self.label = opts.label
  self.theme = opts.theme or defaultTheme
  self.display = self:fraction()  -- eased fill fraction; starts settled on value
  self.phase = 0                  -- indeterminate chunk position, in [0, 1)
  return self
end`,category:"control"},{id:"checkbox",displayName:"Checkbox",title:"Checkbox widget: boolean toggle with a check mark and optional label",summary:"Checkbox widget: boolean toggle with a check mark and optional label. Toggles on mouserelease inside when the press also began inside (Button-like). Hit area covers the box and the label. Fires onChange(checked) on toggle. Indeterminate draws a dash; the first toggle clears it and sets checked=true.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"size",default:"20",type:"number",description:"box side length",isCallback:!1},{name:"label",default:null,type:"string",description:"optional text to the right of the box",isCallback:!1},{name:"checked",default:"false",type:"boolean",description:"Whether the box is checked.",isCallback:!1},{name:"indeterminate",default:"false",type:"boolean",description:"tri-state dash; toggling resolves it to checked",isCallback:!1},{name:"onChange",default:null,type:"function",description:"Called when the value changes.",isCallback:!0},{name:"disabled",default:"false",type:"boolean",description:"Greys the widget out and ignores input.",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!0,keys:["space","return","kpenter"],wheel:!1,mousemoved:!0},sourceExcerpt:`function Checkbox.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Checkbox)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.size = opts.size or 20
  self.label = opts.label
  self.checked = opts.checked or false
  self.indeterminate = opts.indeterminate or false
  self.onChange = opts.onChange
  self.disabled = opts.disabled or false
  self.theme = opts.theme or defaultTheme
  self.pressed = false
  self.hovered = false
  self.focusable = true
  return self
end`,category:"control"},{id:"toggle",displayName:"Toggle",title:"Toggle / Switch widget: sliding on/off control",summary:"Toggle / Switch widget: sliding on/off control. Click toggles on/off. update(dt) animates the knob sliding between ends. Fires onChange(on) when toggled.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"w",default:"44",type:"number",description:"Width, in pixels.",isCallback:!1},{name:"h",default:"24",type:"number",description:"Height, in pixels.",isCallback:!1},{name:"on",default:"false",type:"boolean",description:"On/off state.",isCallback:!1},{name:"onChange",default:null,type:"function",description:"Called when the value changes.",isCallback:!0},{name:"disabled",default:"false",type:"boolean",description:"Greys the widget out and ignores input.",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!0,keys:["space","return","kpenter"],wheel:!1,mousemoved:!0},sourceExcerpt:`function Toggle.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Toggle)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.w = opts.w or 44
  self.h = opts.h or 24
  self.on = opts.on or false
  self.onChange = opts.onChange
  self.disabled = opts.disabled or false
  self.theme = opts.theme or defaultTheme
  self.pressed = false
  self.hovered = false
  self.anim = self.on and 1 or 0  -- 0 = off end, 1 = on end
  self.focusable = true
  return self
end`,category:"control"},{id:"radiogroup",displayName:"RadioGroup",title:"RadioGroup widget: mutually exclusive option set",summary:"RadioGroup widget: mutually exclusive option set. One widget owns all rows so exclusivity is trivial. Clicking a row selects it and clears the others. group.selected is readable/writable.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"options",default:"{}",type:"table",description:"List of options to display.",isCallback:!1},{name:"selected",default:"1",type:"number",description:"1-based index of the active option",isCallback:!1},{name:"spacing",default:"28",type:"number",description:"vertical distance between rows",isCallback:!1},{name:"onChange",default:null,type:"function",description:"Called when the value changes.",isCallback:!0},{name:"disabled",default:"false",type:"boolean",description:"Greys the widget out and ignores input.",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!0,keys:["up","left","down","right","home","end"],wheel:!1,mousemoved:!0},sourceExcerpt:`function RadioGroup.new(opts)
  opts = opts or {}
  local self = setmetatable({}, RadioGroup)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.options = opts.options or {}
  self.selected = opts.selected or 1
  self.spacing = opts.spacing or 28
  self.onChange = opts.onChange
  self.disabled = opts.disabled or false
  self.theme = opts.theme or defaultTheme
  self.diameter = 18
  self.pressed = nil  -- index pressed this cycle, or nil
  self.hover = nil    -- row index under the cursor, or nil
  self.focusable = true
  return self
end`,category:"control"},{id:"slider",displayName:"Slider",title:"Slider widget: drag a handle to pick a value in a range",summary:"Slider widget: drag a handle to pick a value in a range. mousepressed on the track begins a drag and jumps the value to the cursor; while dragging, update() follows the cursor as long as the left button is held (no mousemoved callback needed); mousereleased ends the drag. Fires onChange(value) whenever the value changes.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"w",default:"200",type:"number",description:"Width, in pixels.",isCallback:!1},{name:"h",default:"20",type:"number",description:"Height, in pixels.",isCallback:!1},{name:"value",default:"0",type:"number",description:"Current value.",isCallback:!1},{name:"min",default:"0",type:"number",description:"Minimum value.",isCallback:!1},{name:"max",default:"1",type:"number",description:"Maximum value.",isCallback:!1},{name:"step",default:null,type:"number",description:"optional snap increment",isCallback:!1},{name:"onChange",default:null,type:"function",description:"Called when the value changes.",isCallback:!0},{name:"disabled",default:"false",type:"boolean",description:"Greys the widget out and ignores input.",isCallback:!1},{name:"showValue",default:"false",type:"boolean",description:"draw a value bubble above the handle while dragging",isCallback:!1},{name:"format",default:null,type:"function",description:"function(value) -> string for that bubble",isCallback:!0},{name:"vertical",default:"false",type:"boolean",description:"true = vertical track (min bottom, max top)",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!0,keys:["left","down","right","up","home","end"],wheel:!0,mousemoved:!0},sourceExcerpt:`function Slider.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Slider)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.w = opts.w or 200
  self.h = opts.h or 20
  self.min = opts.min or 0
  self.max = opts.max or 1
  self.step = opts.step
  self.value = util.clamp(opts.value or self.min, self.min, self.max)
  self.onChange = opts.onChange
  self.disabled = opts.disabled or false
  self.showValue = opts.showValue or false
  self.format = opts.format
  self.theme = opts.theme or defaultTheme
  self.vertical = opts.vertical or false
  self.dragging = false
  self.hovered = false
  self.grabOffsetX = 0  -- handle-center minus cursor, captured at grab
  self.grabOffsetY = 0
  self.screenDX = 0     -- global mouse minus local, captured at press
  self.screenDY = 0
  -- Handle radius comes from the short (perpendicular) axis.
  self.handleR = (self.vertical and self.w or self.h) / 2
  self.focusable = true
  return self
end`,category:"control"},{id:"stepper",displayName:"Stepper",title:"Stepper widget: numeric value with - / + buttons",summary:"Stepper widget: numeric value with - / + buttons. Composes two Buttons flanking a printed numeric readout. The readout is not editable (keyboard entry is deferred). Value is clamped to min/max when set. Holding a button auto-repeats after a short delay. When focused, Up/Right and Down/Left step the value. Fires onChange(value) when the value changes.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"w",default:"140",type:"number",description:"Width, in pixels.",isCallback:!1},{name:"h",default:"32",type:"number",description:"Height, in pixels.",isCallback:!1},{name:"value",default:"0",type:"number",description:"Current value.",isCallback:!1},{name:"min",default:null,type:"number",description:"Minimum value.",isCallback:!1},{name:"max",default:null,type:"number",description:"Maximum value.",isCallback:!1},{name:"step",default:"1",type:"number",description:"Snap increment applied to the value.",isCallback:!1},{name:"onChange",default:null,type:"function",description:"Called when the value changes.",isCallback:!0},{name:"disabled",default:"false",type:"boolean",description:"Greys the widget out and ignores input.",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!0,keys:["up","right","down","left"],wheel:!1,mousemoved:!0},sourceExcerpt:`function Stepper.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Stepper)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.w = opts.w or 140
  self.h = opts.h or 32
  self.value = opts.value or 0
  self.min = opts.min
  self.max = opts.max
  self.step = opts.step or 1
  self.onChange = opts.onChange
  self.disabled = opts.disabled or false
  self.theme = opts.theme or defaultTheme
  self.focusable = true
  self:_clamp()

  -- Auto-repeat state: the button being held, its direction, and timers.
  self.holding = nil
  self.holdDir = 0
  self.heldTime = 0
  self.nextRepeat = 0

  -- Child buttons render the ends and track hover/pressed; the Stepper itself
  -- drives every value change (press, hold-repeat, keyboard) so there is no
  -- double-count from a button's own onClick.
  local bw = self.h  -- square end buttons
  self.minus = Button.new{
    x = self.x, y = self.y, w = bw, h = self.h, label = "-",
    disabled = self.disabled, theme = self.theme,
  }
  self.plus = Button.new{
    x = self.x + self.w - bw, y = self.y, w = bw, h = self.h, label = "+",
    disabled = self.disabled, theme = self.theme,
  }
  return self
end`,category:"control"},{id:"iconbutton",displayName:"IconButton",title:"IconButton widget: a square button drawing an image instead of a label",summary:"IconButton widget: a square button drawing an image instead of a label. Same interaction model as Button (normal/hover/press/disabled). Fires onClick on mouserelease inside bounds when the press also began inside.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"w",default:"32",type:"number",description:"Width, in pixels.",isCallback:!1},{name:"h",default:"32",type:"number",description:"Height, in pixels.",isCallback:!1},{name:"image",default:null,type:"any",description:"drawn centered, scaled to fit with padding",isCallback:!1},{name:"onClick",default:null,type:"function",description:"Called when activated.",isCallback:!0},{name:"disabled",default:"false",type:"boolean",description:"Greys the widget out and ignores input.",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!0,keys:["space","return","kpenter"],wheel:!1,mousemoved:!0},sourceExcerpt:`function IconButton.new(opts)
  opts = opts or {}
  local self = setmetatable({}, IconButton)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.w = opts.w or 32
  self.h = opts.h or 32
  self.image = opts.image
  self.onClick = opts.onClick
  self.disabled = opts.disabled or false
  self.theme = opts.theme or defaultTheme
  self.hovered = false
  self.pressed = false
  self.focusable = true
  return self
end`,category:"control"},{id:"panel",displayName:"Panel",title:"Panel widget: a bordered container that groups child widgets in its own",summary:"Panel widget: a bordered container that groups child widgets in its own (relative) coordinate space. panel:add(child) places a child relative to the panel's content area (inside the padding, below the title bar when present). Moving the panel moves its children. Empty areas of the panel do not consume clicks.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"w",default:"200",type:"number",description:"Width, in pixels.",isCallback:!1},{name:"h",default:"150",type:"number",description:"Height, in pixels.",isCallback:!1},{name:"title",default:null,type:"string",description:"optional header text",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!1,keys:[],wheel:!1,mousemoved:!0},sourceExcerpt:`function Panel.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Panel)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.w = opts.w or 200
  self.h = opts.h or 150
  self.title = opts.title
  self.theme = opts.theme or defaultTheme
  self.container = Container.new(function()
    return self.x + self.theme.padding, self.y + self:headerHeight()
  end)
  return self
end`,category:"container-overlay"},{id:"modal",displayName:"Modal",title:"Modal / Dialog widget: a blocking overlay with a title, message, and buttons",summary:"Modal / Dialog widget: a blocking overlay with a title, message, and buttons. Open it with root:openOverlay(modal, { modal = true }); it then traps all input, dims the screen, and centers a panel. Each button runs its onClick and then closes the modal. Esc also closes it (handled by Root); with closable = true a corner × closes it too, and dismissOnScrim = true lets a click on the backdrop outside the panel dismiss it.",options:[{name:"w",default:"320",type:"number",description:"Width, in pixels.",isCallback:!1},{name:"h",default:"180",type:"number",description:"Height, in pixels.",isCallback:!1},{name:"title",default:'""',type:"string",description:"Title text.",isCallback:!1},{name:"message",default:null,type:"string",description:"Body message text.",isCallback:!1},{name:"buttons",default:"{…}",type:"table",description:"Button specs: { label, onClick }.",isCallback:!1},{name:"closable",default:"false",type:"boolean",description:"draw a top-right × that dismisses the modal",isCallback:!1},{name:"dismissOnScrim",default:"false",type:"boolean",description:"click the dimmed backdrop (outside the panel) to close",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1},{name:"animated",default:null,type:"boolean",description:"Animate the entrance; false snaps instantly.",isCallback:!1}],capabilities:{focusable:!1,keys:["tab","left","right","return","kpenter","space"],wheel:!1,mousemoved:!0},sourceExcerpt:`function Modal.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Modal)
  self.w = opts.w or 320
  self.h = opts.h or 180
  self.title = opts.title or ""
  self.message = opts.message
  self.closable = opts.closable or false
  self.dismissOnScrim = opts.dismissOnScrim or false
  self.theme = opts.theme or defaultTheme
  self.x, self.y = 0, 0  -- filled by layout()
  -- Entrance animation: anim eases 0->1 in update; draw fades scrim + panel by
  -- it. animated = false snaps straight to fully shown.
  self.anim = opts.animated == false and 1 or 0

  self.buttons = {}
  for _, spec in ipairs(opts.buttons or { { label = "OK" } }) do
    local btn = Button.new{
      w = 100, h = 32, label = spec.label or "OK", theme = self.theme,
      onClick = function()
        if spec.onClick then spec.onClick() end
        if self.root then self.root:closeOverlay(self) end
      end,
    }
    table.insert(self.buttons, btn)
  end
  -- Default focus is the primary (rightmost) button, which Enter activates.
  self.focusIndex = #self.buttons > 0 and #self.buttons or nil
  return self
end`,category:"container-overlay"},{id:"dropdown",displayName:"Dropdown",title:"Dropdown / Select widget: pick one option from a popup list",summary:"Dropdown / Select widget: pick one option from a popup list. Closed, it shows the current option and a caret. Clicking opens a popup list as a non-modal overlay anchored below the trigger; the popup is dismissed by clicking outside it (handled by Root). Selecting a row fires onChange(index) and closes. dropdown.selected is readable/writable. Must be added to a fox.Root (root:add) so it can open its popup overlay.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"w",default:"160",type:"number",description:"Width, in pixels.",isCallback:!1},{name:"h",default:"32",type:"number",description:"Height, in pixels.",isCallback:!1},{name:"options",default:"{}",type:"table",description:"List of options to display.",isCallback:!1},{name:"selected",default:"1",type:"number",description:'may be nil / out of range for "nothing chosen yet"',isCallback:!1},{name:"placeholder",default:'""',type:"string",description:"muted text shown when selected has no option",isCallback:!1},{name:"onChange",default:null,type:"function",description:"Called when the value changes.",isCallback:!0},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!0,keys:["space","return","kpenter","down"],wheel:!0,mousemoved:!1},sourceExcerpt:`function Dropdown.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Dropdown)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.w = opts.w or 160
  self.h = opts.h or 32
  self.options = opts.options or {}
  self.selected = opts.selected or 1
  self.placeholder = opts.placeholder or ""
  self.onChange = opts.onChange
  self.theme = opts.theme or defaultTheme
  self.root = nil  -- set by Root:add
  self.focusable = true
  return self
end`,category:"container-overlay"},{id:"tooltip",displayName:"Tooltip",title:"Tooltip widget: a hover-triggered floating hint",summary:"Tooltip widget: a hover-triggered floating hint. Polls the mouse each update; once the cursor has hovered the target for `delay` seconds, a small box fades in near the cursor. The box is kept on screen (clamped to the window) and fades out when the cursor leaves. Non-blocking: it never captures input. Add it after the widgets it annotates so it draws on top.",options:[{name:"target",default:"{ x = 0, y = 0, w = 0, h = 0 }",type:"table",description:"Trigger area: { x, y, w, h }.",isCallback:!1},{name:"text",default:'""',type:"string",description:"Displayed text.",isCallback:!1},{name:"delay",default:"0.6",type:"number",description:"seconds of hover before showing",isCallback:!1},{name:"maxWidth",default:null,type:"any",description:"wrap text at this pixel width (multi-line)",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!1,keys:[],wheel:!1,mousemoved:!1},sourceExcerpt:`function Tooltip.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Tooltip)
  self.target = opts.target or { x = 0, y = 0, w = 0, h = 0 }
  self.text = opts.text or ""
  self.delay = opts.delay or 0.6
  self.maxWidth = opts.maxWidth
  self.theme = opts.theme or defaultTheme
  self.hoverTime = 0
  self.visible = false
  self.alpha = 0
  self.mx, self.my = 0, 0
  return self
end`,category:"container-overlay"},{id:"tabs",displayName:"Tabs",title:"Tabs widget: switch between panels via a header row",summary:"Tabs widget: switch between panels via a header row. Draws a row of clickable tab labels; below it, the selected tab's `panel` (any widget, typically a fox.Panel) is drawn and receives input. Position each panel below the header yourself. Switching fires onChange(index).",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"w",default:"300",type:"number",description:"Width, in pixels.",isCallback:!1},{name:"headerH",default:"32",type:"number",description:"Header row height, in pixels.",isCallback:!1},{name:"tabs",default:"{}",type:"table",description:"Tab specs: { label, panel }.",isCallback:!1},{name:"selected",default:"1",type:"number",description:"Index of the selected item.",isCallback:!1},{name:"onChange",default:null,type:"function",description:"Called when the value changes.",isCallback:!0},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!0,keys:["left","right","home","end"],wheel:!1,mousemoved:!0},sourceExcerpt:`function Tabs.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Tabs)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.w = opts.w or 300
  self.headerH = opts.headerH or 32
  self.tabs = opts.tabs or {}
  self.selected = opts.selected or 1
  self.onChange = opts.onChange
  self.theme = opts.theme or defaultTheme
  self.hoverTab = nil  -- header segment under the cursor, or nil
  self.focusable = true
  return self
end`,category:"container-overlay"},{id:"listbox",displayName:"ListBox",title:"ListBox widget: a scrollable, selectable list of rows",summary:"ListBox widget: a scrollable, selectable list of rows. Rows are clipped to the box. Click a row to select it; drag inside the box or use the scroll wheel to scroll. When the list overflows, a scrollbar track and thumb are drawn on the right edge to show position and extent. Fires onChange(index) on selection. listbox.selected is readable.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"w",default:"200",type:"number",description:"Width, in pixels.",isCallback:!1},{name:"h",default:"160",type:"number",description:"Height, in pixels.",isCallback:!1},{name:"items",default:"{}",type:"table",description:"List of items to display.",isCallback:!1},{name:"selected",default:null,type:"number",description:"Index of the selected item.",isCallback:!1},{name:"rowH",default:"24",type:"number",description:"Row height, in pixels.",isCallback:!1},{name:"onChange",default:null,type:"function",description:"Called when the value changes.",isCallback:!0},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!0,keys:["up","down","home","end","pageup","pagedown","return","kpenter","space"],wheel:!0,mousemoved:!1},sourceExcerpt:`function ListBox.new(opts)
  opts = opts or {}
  local self = setmetatable({}, ListBox)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.w = opts.w or 200
  self.h = opts.h or 160
  self.items = opts.items or {}
  self.selected = opts.selected
  self.rowH = opts.rowH or 24
  self.onChange = opts.onChange
  self.theme = opts.theme or defaultTheme
  self.scroll = 0
  self.dragging = false
  self.moved = false
  self.pressY = 0
  self.lastY = 0
  self.hover = nil  -- row index under the cursor, or nil
  self.focusable = true
  self._taBuffer = ""   -- accumulated type-ahead search string
  self._taTimer = 0     -- seconds since the last type-ahead keystroke
  return self
end`,category:"container-overlay"},{id:"contextmenu",displayName:"ContextMenu",title:"ContextMenu widget: a right-click popup menu of actions",summary:"ContextMenu widget: a right-click popup menu of actions. Right-clicking inside `target` (button 2) opens the menu at the cursor as a non-modal overlay; it is dismissed by clicking outside (handled by Root) or Esc. You can also open it programmatically at any point with menu:openAt(px, py) -- handy for a menu that covers a whole panel or the window. Selecting an enabled row runs its onClick and closes the menu. Up/Down move the highlight (skipping separators and disabled rows), Enter/Space activate, Esc closes. Must be added to a fox.Root (root:add) so it can open its popup overlay.",options:[{name:"target",default:"{…}",type:"table",description:"Trigger area: { x, y, w, h }.",isCallback:!1},{name:"items",default:"{}",type:"table",description:"List of items to display.",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!1,keys:["up","down","return","kpenter","space"],wheel:!1,mousemoved:!1},sourceExcerpt:`function ContextMenu.new(opts)
  opts = opts or {}
  local self = setmetatable({}, ContextMenu)
  self.target = opts.target  -- optional { x, y, w, h }
  self.items = opts.items or {}
  self.theme = opts.theme or defaultTheme
  self.root = nil  -- set by Root:add
  self.focusable = false
  return self
end`,category:"container-overlay"},{id:"toast",displayName:"ToastHost",title:"ToastHost widget: transient, stacked notification messages",summary:'ToastHost widget: transient, stacked notification messages. Add it to a fox.Root (root:add). Push messages with: host:show("Saved.", { kind = "success", duration = 2 }) kind is info | success | warning | error and colors the left stripe; it reads theme.color[kind] and falls back to accent. show() returns a handle you can pass to host:dismiss(handle) to fade a toast out early. The host never captures input, so add it after the widgets it floats over.',options:[{name:"corner",default:'"br"',type:"string",description:"tl | tr | bl | br  (which corner toasts stack in)",isCallback:!1},{name:"gap",default:"8",type:"number",description:"pixels between stacked toasts",isCallback:!1},{name:"margin",default:"12",type:"number",description:"pixels from the screen edges",isCallback:!1},{name:"width",default:"260",type:"number",description:"toast box width",isCallback:!1},{name:"duration",default:"3",type:"number",description:"default seconds a toast stays before fading out",isCallback:!1},{name:"max",default:"4",type:"number",description:"most toasts kept at once (oldest dropped past this)",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!1,keys:[],wheel:!1,mousemoved:!1},sourceExcerpt:`function ToastHost.new(opts)
  opts = opts or {}
  local self = setmetatable({}, ToastHost)
  self.corner = opts.corner or "br"
  self.gap = opts.gap or 8
  self.margin = opts.margin or 12
  self.width = opts.width or 260
  self.duration = opts.duration or 3
  self.max = opts.max or 4
  self.theme = opts.theme or defaultTheme
  self.toasts = {}  -- newest last
  return self
end`,category:"container-overlay"},{id:"spinner",displayName:"Spinner",title:"Spinner widget: an animated busy indicator for unknown-duration work",summary:"Spinner widget: an animated busy indicator for unknown-duration work. Non-interactive. A ring of dots fades in a rotating trail; advance it by calling update(dt). Exposes self.w/self.h and :measure() (both = size) so layout containers can place it.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"size",default:"24",type:"number",description:"bounding box (square) in pixels",isCallback:!1},{name:"dots",default:"8",type:"number",description:"number of dots around the ring",isCallback:!1},{name:"speed",default:"1",type:"number",description:"revolutions per second",isCallback:!1},{name:"color",default:null,type:"any",description:"dot color override (table); default theme.color.accent",isCallback:!1},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!1,keys:[],wheel:!1,mousemoved:!1},sourceExcerpt:`function Spinner.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Spinner)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.size = opts.size or 24
  self.dots = opts.dots or 8
  self.speed = opts.speed or 1
  self.color = opts.color
  self.theme = opts.theme or defaultTheme
  self.w, self.h = self.size, self.size
  self.phase = 0   -- rotation, in [0, 1)
  return self
end`,category:"control"},{id:"numberfield",displayName:"NumberField",title:"NumberField widget: an editable numeric input with clamping and step arrows",summary:"NumberField widget: an editable numeric input with clamping and step arrows. Click to focus and type a number; only digits, one leading '-', and one '.' are accepted. Up/Down arrows (and the scroll wheel while hovered) nudge by step. The text is parsed, clamped to [min, max], and reformatted on Enter or blur; an empty or invalid entry reverts to the last valid value. Read/write the number via numberfield.value / :setValue(n).",options:[{name:"x",default:null,type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:null,type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"w",default:null,type:"number",description:"Width, in pixels.",isCallback:!1},{name:"h",default:null,type:"number",description:"Height, in pixels.",isCallback:!1},{name:"value",default:"0",type:"number",description:"Current value.",isCallback:!1},{name:"min",default:null,type:"number",description:"Minimum value.",isCallback:!1},{name:"max",default:null,type:"number",description:"Maximum value.",isCallback:!1},{name:"step",default:"1",type:"number",description:"Up/Down (and wheel) increment",isCallback:!1},{name:"onChange",default:null,type:"function",description:"fired when the numeric value changes",isCallback:!0},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!0,keys:["up","down"],wheel:!0,mousemoved:!0},sourceExcerpt:`function NumberField.new(opts)
  opts = opts or {}
  local self = setmetatable({}, NumberField)
  self.min = opts.min
  self.max = opts.max
  self.step = opts.step or 1
  self.onChange = opts.onChange
  self.theme = opts.theme or defaultTheme
  self.value = self:_clamp(opts.value or 0)
  self.focusable = true

  -- The inner Textbox owns caret/selection/clipboard editing; this widget adds
  -- numeric filtering, stepping, and commit-on-blur around it.
  self.tb = Textbox.new{
    x = opts.x or 0, y = opts.y or 0, w = opts.w or 120, h = opts.h or 32,
    value = self:_format(self.value), theme = self.theme,
    onSubmit = function()
      self:_commit()
      if self.root then self.root:setFocus(nil) end
    end,
  }
  self.x, self.y = self.tb.x, self.tb.y
  self.w, self.h = self.tb.w, self.tb.h
  return self
end`,category:"control"},{id:"segmentedcontrol",displayName:"SegmentedControl",title:"SegmentedControl widget: a row of mutually-exclusive, button-styled options",summary:"SegmentedControl widget: a row of mutually-exclusive, button-styled options. Like a RadioGroup rendered as a joined button strip: exactly one segment is active. Clicking a segment selects it; when focused, Left/Right move the selection (wrapping). Fires onChange(index) when the selection changes. Read/write the current index via control.selected.",options:[{name:"x",default:"0",type:"number",description:"X position, in pixels.",isCallback:!1},{name:"y",default:"0",type:"number",description:"Y position, in pixels.",isCallback:!1},{name:"w",default:"240",type:"number",description:"Width, in pixels.",isCallback:!1},{name:"h",default:"32",type:"number",description:"Height, in pixels.",isCallback:!1},{name:"options",default:"{}",type:"table",description:"List of options to display.",isCallback:!1},{name:"selected",default:"1",type:"number",description:"Index of the selected item.",isCallback:!1},{name:"onChange",default:null,type:"function",description:"Called when the value changes.",isCallback:!0},{name:"theme",default:"<default theme>",type:"table",description:"Theme table override; falls back to the default.",isCallback:!1}],capabilities:{focusable:!0,keys:["left","right"],wheel:!1,mousemoved:!0},sourceExcerpt:`function SegmentedControl.new(opts)
  opts = opts or {}
  local self = setmetatable({}, SegmentedControl)
  self.x = opts.x or 0
  self.y = opts.y or 0
  self.w = opts.w or 240
  self.h = opts.h or 32
  self.options = opts.options or {}
  self.selected = opts.selected or 1
  self.onChange = opts.onChange
  self.theme = opts.theme or defaultTheme
  self.hovered = nil   -- hovered segment index, or nil
  self.focusable = true
  return self
end`,category:"control"}],l=[{name:"bg",rgba:[.16,.17,.2,1],hex:"#292b33",rgbaCss:"rgba(41, 43, 51, 1)"},{name:"fg",rgba:[.22,.24,.28,1],hex:"#383d47",rgbaCss:"rgba(56, 61, 71, 1)"},{name:"accent",rgba:[.9,.55,.25,1],hex:"#e68c40",rgbaCss:"rgba(230, 140, 64, 1)",note:"fox orange"},{name:"border",rgba:[.35,.37,.42,1],hex:"#595e6b",rgbaCss:"rgba(89, 94, 107, 1)"},{name:"hover",rgba:[.28,.3,.35,1],hex:"#474d59",rgbaCss:"rgba(71, 77, 89, 1)",note:"distinct from fg; used for hover fills"},{name:"focus",rgba:[.98,.72,.4,1],hex:"#fab866",rgbaCss:"rgba(250, 184, 102, 1)",note:"keyboard focus ring (lighter accent)"},{name:"selection",rgba:[.9,.55,.25,.35],hex:"#e68c40",rgbaCss:"rgba(230, 140, 64, 0.35)",note:"text selection highlight (translucent accent)"},{name:"disabled",rgba:[.3,.31,.34,1],hex:"#4d4f57",rgbaCss:"rgba(77, 79, 87, 1)"},{name:"text",rgba:[.94,.95,.97,1],hex:"#f0f2f7",rgbaCss:"rgba(240, 242, 247, 1)"},{name:"textMuted",rgba:[.55,.57,.62,1],hex:"#8c919e",rgbaCss:"rgba(140, 145, 158, 1)"},{name:"info",rgba:[.32,.55,.9,1],hex:"#528ce6",rgbaCss:"rgba(82, 140, 230, 1)",note:"toast/status accent (blue)"},{name:"success",rgba:[.35,.72,.42,1],hex:"#59b86b",rgbaCss:"rgba(89, 184, 107, 1)",note:"toast/status accent"},{name:"warning",rgba:[.92,.72,.25,1],hex:"#ebb840",rgbaCss:"rgba(235, 184, 64, 1)"},{name:"error",rgba:[.86,.32,.3,1],hex:"#db524d",rgbaCss:"rgba(219, 82, 77, 1)"}],n=4,o=8,i={colors:l,radius:n,padding:o},r=[{w:96,file:"shots/badge/default.png",h:40,state:"default"},{w:96,file:"shots/badge/removable.png",h:40,state:"removable"}],d=[{w:420,file:"shots/modal/default.png",h:260,state:"default"}],p=[{w:420,file:"shots/tooltip/default.png",h:260,state:"default"}],f=[{w:296,file:"shots/tabs/first.png",h:56,state:"first"},{w:296,file:"shots/tabs/second.png",h:56,state:"second"}],c=[{w:216,file:"shots/divider/plain.png",h:40,state:"plain"},{w:216,file:"shots/divider/labelled.png",h:40,state:"labelled"}],u=[{w:176,file:"shots/button/default.png",h:50,state:"default"},{w:176,file:"shots/button/hover.png",h:50,state:"hover"},{w:176,file:"shots/button/pressed.png",h:50,state:"pressed"},{w:176,file:"shots/button/disabled.png",h:50,state:"disabled"},{w:176,file:"shots/button/focused.png",h:50,state:"focused"}],m=[{w:216,file:"shots/progressbar/half.png",h:32,state:"half"},{w:216,file:"shots/progressbar/full.png",h:32,state:"full"},{w:216,file:"shots/progressbar/labelled.png",h:32,state:"labelled"}],h=[{w:256,file:"shots/panel/default.png",h:156,state:"default"}],b=[{w:176,file:"shots/checkbox/unchecked.png",h:38,state:"unchecked"},{w:176,file:"shots/checkbox/checked.png",h:38,state:"checked"},{w:176,file:"shots/checkbox/indeterminate.png",h:38,state:"indeterminate"},{w:176,file:"shots/checkbox/disabled.png",h:38,state:"disabled"}],g=[{w:64,file:"shots/avatar/circle.png",h:64,state:"circle"},{w:64,file:"shots/avatar/square.png",h:64,state:"square"}],y=[{w:420,file:"shots/toast/info.png",h:260,state:"info"},{w:420,file:"shots/toast/success.png",h:260,state:"success"}],w=[{w:68,file:"shots/toggle/off.png",h:44,state:"off"},{w:68,file:"shots/toggle/on.png",h:44,state:"on"},{w:68,file:"shots/toggle/disabled.png",h:44,state:"disabled"}],k=[{w:176,file:"shots/radiogroup/default.png",h:106,state:"default"},{w:176,file:"shots/radiogroup/second.png",h:106,state:"second"}],x=[{w:216,file:"shots/label/default.png",h:40,state:"default"},{w:216,file:"shots/label/muted.png",h:40,state:"muted"}],C=[{w:216,file:"shots/slider/mid.png",h:36,state:"mid"},{w:216,file:"shots/slider/hover.png",h:36,state:"hover"},{w:40,file:"shots/slider/vertical.png",h:156,state:"vertical"}],v=[{w:156,file:"shots/stepper/default.png",h:50,state:"default"},{w:156,file:"shots/stepper/disabled.png",h:50,state:"disabled"}],T=[{w:156,file:"shots/numberfield/default.png",h:50,state:"default"},{w:156,file:"shots/numberfield/focused.png",h:50,state:"focused"}],S=[{w:56,file:"shots/spinner/default.png",h:56,state:"default"}],E=[{w:236,file:"shots/segmentedcontrol/default.png",h:48,state:"default"},{w:236,file:"shots/segmentedcontrol/second.png",h:48,state:"second"}],N=[{w:216,file:"shots/listbox/default.png",h:136,state:"default"},{w:216,file:"shots/listbox/second.png",h:136,state:"second"}],B=[{w:216,file:"shots/dropdown/closed.png",h:50,state:"closed"},{w:216,file:"shots/dropdown/hover.png",h:50,state:"hover"}],H=[{w:50,file:"shots/iconbutton/default.png",h:50,state:"default"},{w:50,file:"shots/iconbutton/hover.png",h:50,state:"hover"},{w:50,file:"shots/iconbutton/disabled.png",h:50,state:"disabled"}],R=[{w:236,file:"shots/textbox/placeholder.png",h:50,state:"placeholder"},{w:236,file:"shots/textbox/value.png",h:50,state:"value"},{w:236,file:"shots/textbox/focused.png",h:50,state:"focused"}],D=[{w:420,file:"shots/contextmenu/default.png",h:260,state:"default"}],W={badge:r,modal:d,tooltip:p,tabs:f,divider:c,button:u,progressbar:m,panel:h,checkbox:b,avatar:g,toast:y,toggle:w,radiogroup:k,label:x,slider:C,stepper:v,numberfield:T,spinner:S,segmentedcontrol:E,listbox:N,dropdown:B,iconbutton:H,textbox:R,contextmenu:D},t=s,X=i,Y=W;function L(e){return t.find(a=>a.id===e)}function M(e){return Y[e]??[]}function z(){return{control:t.filter(e=>e.category==="control"),"container-overlay":t.filter(e=>e.category==="container-overlay")}}export{z as a,L as g,M as s,X as t,t as w};
