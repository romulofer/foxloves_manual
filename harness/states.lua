-- Per-widget screenshot specs. Each spec:
--   size   = { w, h }         content box (canvas is this + 2*pad)
--   base   = { ... }          constructor opts shared by every shot
--   shots  = { { state, opts?, mutate? }, ... }
--     opts   merged over base for that shot
--     mutate function(widget) forces runtime flags a draw path reads
--
-- ids are foxloves module names (matching the parser / widgets.json).

local function focus(w) w.root = { focused = w } end
local function hover(w) w.hovered = true end
local function press(w) w.hovered = true; w.pressed = true end

local OPTS3 = { "Alpha", "Beta", "Gamma" }

local M = {}

M.specs = {
  button = {
    size = { w = 160, h = 34 }, base = { label = "Button" },
    shots = {
      { state = "default" },
      { state = "hover", mutate = hover },
      { state = "pressed", mutate = press },
      { state = "disabled", opts = { disabled = true } },
      { state = "focused", mutate = focus },
    },
  },
  iconbutton = {
    size = { w = 34, h = 34 }, base = {},
    shots = {
      { state = "default" },
      { state = "hover", mutate = hover },
      { state = "disabled", opts = { disabled = true } },
    },
  },
  textbox = {
    size = { w = 220, h = 34 }, base = { placeholder = "Type here…" },
    shots = {
      { state = "placeholder" },
      { state = "value", opts = { value = "Hello world" } },
      { state = "focused", opts = { value = "Focused" }, mutate = focus },
    },
  },
  label = {
    size = { w = 200, h = 24 }, base = { text = "Label text", w = 200, h = 24 },
    shots = {
      { state = "default" },
      { state = "muted", opts = { muted = true } },
    },
  },
  badge = {
    size = { w = 80, h = 24 }, base = { text = "NEW" },
    shots = {
      { state = "default" },
      { state = "removable", opts = { removable = true } },
    },
  },
  avatar = {
    size = { w = 48, h = 48 }, base = { initials = "FX", size = 48 },
    shots = {
      { state = "circle" },
      { state = "square", opts = { shape = "square" } },
    },
  },
  divider = {
    size = { w = 200, h = 24 }, base = { length = 200 },
    shots = {
      { state = "plain" },
      { state = "labelled", opts = { label = "Section" } },
    },
  },
  progressbar = {
    size = { w = 200, h = 16 }, base = { w = 200, h = 16 },
    shots = {
      { state = "half", opts = { value = 0.5 } },
      { state = "full", opts = { value = 1 } },
      { state = "labelled", opts = { value = 0.7, label = "70%" } },
    },
  },
  checkbox = {
    size = { w = 160, h = 22 }, base = { label = "Enable", size = 20 },
    shots = {
      { state = "unchecked" },
      { state = "checked", opts = { checked = true } },
      { state = "indeterminate", opts = { indeterminate = true } },
      { state = "disabled", opts = { disabled = true } },
    },
  },
  toggle = {
    size = { w = 52, h = 28 }, base = { w = 52, h = 28 },
    shots = {
      { state = "off" },
      { state = "on", opts = { on = true } },
      { state = "disabled", opts = { on = true, disabled = true } },
    },
  },
  radiogroup = {
    size = { w = 160, h = 90 }, base = { options = OPTS3, selected = 1 },
    shots = {
      { state = "default" },
      { state = "second", opts = { selected = 2 } },
    },
  },
  slider = {
    size = { w = 200, h = 20 }, base = { w = 200, h = 20, value = 0.5, min = 0, max = 1 },
    shots = {
      { state = "mid" },
      { state = "hover", mutate = hover },
      { state = "vertical", opts = { w = 24, h = 140, vertical = true } },
    },
  },
  stepper = {
    size = { w = 140, h = 34 }, base = { w = 140, h = 34, value = 5, min = 0, max = 10 },
    shots = {
      { state = "default" },
      { state = "disabled", opts = { disabled = true } },
    },
  },
  numberfield = {
    size = { w = 140, h = 34 }, base = { w = 140, h = 34, value = 5, min = 0, max = 10 },
    shots = {
      { state = "default" },
      { state = "focused", mutate = focus },
    },
  },
  spinner = {
    size = { w = 40, h = 40 }, base = { size = 40 },
    shots = { { state = "default" } },
  },
  segmentedcontrol = {
    size = { w = 220, h = 32 }, base = { w = 220, h = 32, options = OPTS3, selected = 1 },
    shots = {
      { state = "default" },
      { state = "second", opts = { selected = 2 } },
    },
  },
  panel = {
    size = { w = 240, h = 140 }, base = { w = 240, h = 140, title = "Panel" },
    shots = { { state = "default" } },
  },
  tabs = {
    size = { w = 280, h = 40 }, base = { w = 280, tabs = { { label = "Alpha" }, { label = "Beta" }, { label = "Gamma" } }, selected = 1, headerH = 34 },
    shots = {
      { state = "first" },
      { state = "second", opts = { selected = 2 } },
    },
  },
  listbox = {
    size = { w = 200, h = 120 }, base = { w = 200, h = 120, items = { "One", "Two", "Three", "Four" }, selected = 1 },
    shots = {
      { state = "default" },
      { state = "second", opts = { selected = 2 } },
    },
  },
  dropdown = {
    size = { w = 200, h = 34 }, base = { w = 200, h = 34, options = OPTS3, selected = 1 },
    shots = {
      { state = "closed" },
      { state = "hover", mutate = hover },
    },
  },
  modal = {
    fullscreen = true, size = { w = 0, h = 0 },
    base = {
      w = 300, h = 150, title = "Confirm", message = "Delete this item? This cannot be undone.",
      animated = false, buttons = { { label = "Cancel" }, { label = "Delete" } }
    },
    shots = { { state = "default", mutate = function(w) w:layout() end } },
  },
  toast = {
    fullscreen = true, size = { w = 0, h = 0 }, base = { corner = "br" },
    shots = {
      { state = "info", mutate = function(w) local h = w:show("Saved to disk.", { kind = "info" }); h.alpha = 1 end },
      { state = "success", mutate = function(w) local h = w:show("Upload complete.", { kind = "success" }); h.alpha = 1 end },
    },
  },
  tooltip = {
    fullscreen = true, size = { w = 0, h = 0 },
    base = { text = "Helpful hint text", target = { x = 8, y = 8, w = 60, h = 24 } },
    shots = { { state = "default", mutate = function(w) w.alpha = 1; w.mx = 20; w.my = 20 end } },
  },
  -- ContextMenu's own draw() is a no-op — its popup only renders as a Root
  -- overlay. A stub root captures that popup so the harness can draw it directly.
  contextmenu = {
    fullscreen = true, size = { w = 0, h = 0 },
    base = { items = { { label = "Cut" }, { label = "Copy" }, { label = "Paste" } }, target = { x = 8, y = 8, w = 60, h = 24 } },
    shots = { {
      state = "default",
      mutate = function(w)
        w.root = { openOverlay = function(_, popup) w._popup = popup; return popup end }
        w:openAt(16, 16)
      end,
      drawTarget = function(w) return w._popup end
    } },
  },
}

return M
