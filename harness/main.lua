-- Renders every foxloves widget's states to PNGs + manifest.json in the LÖVE
-- save directory. Run from the manual repo root: `love harness`.
-- Library location via FOXLOVES_DIR (default ../foxloves).

local FOX = os.getenv("FOXLOVES_DIR") or "../foxloves"
package.path = table.concat({
  FOX .. "/?.lua",
  FOX .. "/?/init.lua",
  package.path
}, ";")

local fox = require("foxloves")
local states = require("states")
local json = require("json_encode")

local PAD = 8

-- displayName -> module id, parsed from init.lua (same source the TS parser uses),
-- so shot ids match widgets.json exactly.
local function widgetMap()
  local map = {}
  local f = io.open(FOX .. "/foxloves/init.lua", "r")
  if not f then error("cannot open init.lua at " .. FOX) end
  local src = f:read("*a")
  f:close()
  for name, mod in src:gmatch('(%w+)%s*=%s*require%("foxloves%.widgets%.(%w+)"%)') do
    map[mod] = name
  end
  return map
end

local manifest = {}
local errors = {}

local function merge(base, extra)
  local o = {}
  for k, v in pairs(base or {}) do o[k] = v end
  for k, v in pairs(extra or {}) do o[k] = v end
  return o
end

-- Render one shot; returns true on success.
local function renderShot(id, name, spec, shot)
  local opts = merge(spec.base, shot.opts)
  opts.x, opts.y = PAD, PAD
  local ok, w = pcall(fox[name].new, opts)
  if not ok then
    errors[#errors + 1] = id .. "/" .. shot.state .. ": ctor " .. tostring(w)
    return false
  end
  if shot.mutate then pcall(shot.mutate, w) end

  local cw, ch
  if spec.fullscreen then
    cw, ch = love.graphics.getDimensions()
  else
    cw = spec.size.w + PAD * 2
    ch = spec.size.h + PAD * 2
  end
  local canvas = love.graphics.newCanvas(cw, ch)
  -- Some widgets expose their visual via a sub-object (e.g. a ContextMenu's
  -- popup); shot.drawTarget returns what to draw instead of the widget itself.
  local target = w
  if shot.drawTarget then
    local ok2, t = pcall(shot.drawTarget, w)
    if not ok2 or t == nil then
      errors[#errors + 1] = id .. "/" .. shot.state .. ": drawTarget"
      return false
    end
    target = t
  end

  love.graphics.setCanvas(canvas)
  love.graphics.clear(fox.theme.color.bg)
  local drew = pcall(function() target:draw() end)
  love.graphics.setCanvas()
  if not drew then
    errors[#errors + 1] = id .. "/" .. shot.state .. ": draw"
    return false
  end

  local rel = "shots/" .. id .. "/" .. shot.state .. ".png"
  canvas:newImageData():encode("png", rel)
  manifest[id] = manifest[id] or {}
  manifest[id][#manifest[id] + 1] = { state = shot.state, file = rel, w = cw, h = ch }
  return true
end

-- Labelled empty box for widgets that cannot render standalone (host/overlay).
local function renderPlaceholder(id)
  local cw, ch = 260, 60
  local canvas = love.graphics.newCanvas(cw, ch)
  love.graphics.setCanvas(canvas)
  love.graphics.clear(fox.theme.color.bg)
  love.graphics.setColor(fox.theme.color.border)
  love.graphics.rectangle("line", 4, 4, cw - 8, ch - 8, 4, 4)
  love.graphics.setColor(fox.theme.color.textMuted)
  love.graphics.printf("no standalone preview", 0, ch / 2 - 7, cw, "center")
  love.graphics.setColor(1, 1, 1, 1)
  love.graphics.setCanvas()
  local rel = "shots/" .. id .. "/placeholder.png"
  canvas:newImageData():encode("png", rel)
  manifest[id] = { { state = "placeholder", file = rel, w = cw, h = ch } }
end

function love.load()
  love.filesystem.createDirectory("shots")
  local map = widgetMap()
  local count = 0
  for id, name in pairs(map) do
    love.filesystem.createDirectory("shots/" .. id)
    local spec = states.specs[id]
    local produced = 0
    if spec then
      for _, shot in ipairs(spec.shots) do
        if renderShot(id, name, spec, shot) then produced = produced + 1 end
      end
    else
      errors[#errors + 1] = id .. ": no spec in states.lua"
    end
    if produced == 0 then renderPlaceholder(id) end
    count = count + 1
  end

  love.filesystem.write("shots/manifest.json", json.encode(manifest))
  if #errors > 0 then
    love.filesystem.write("shots/errors.txt", table.concat(errors, "\n"))
    print("HARNESS NOTES (" .. #errors .. "):\n" .. table.concat(errors, "\n"))
  end
  print("processed " .. count .. " widgets; save dir: " .. love.filesystem.getSaveDirectory())
  love.event.quit(0)
end

function love.draw() end
