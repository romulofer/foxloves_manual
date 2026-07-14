-- Minimal JSON encoder (LÖVE ships no JSON). Handles the nested
-- table/array/string/number/boolean shape the harness produces.
local M = {}

local function esc(s)
  return s:gsub('[%z\1-\31"\\]', function(c)
    if c == '"' then return '\\"' end
    if c == '\\' then return '\\\\' end
    if c == '\n' then return '\\n' end
    if c == '\t' then return '\\t' end
    return string.format('\\u%04x', string.byte(c))
  end)
end

local function enc(v)
  local t = type(v)
  if t == "string" then return '"' .. esc(v) .. '"' end
  if t == "number" then return tostring(v) end
  if t == "boolean" then return tostring(v) end
  if t == "table" then
    local n = #v
    local isArr = n > 0
    for k in pairs(v) do
      if type(k) ~= "number" then isArr = false break end
    end
    if isArr then
      local parts = {}
      for i = 1, n do parts[i] = enc(v[i]) end
      return "[" .. table.concat(parts, ",") .. "]"
    end
    local parts = {}
    for k, val in pairs(v) do
      parts[#parts + 1] = '"' .. esc(tostring(k)) .. '":' .. enc(val)
    end
    return "{" .. table.concat(parts, ",") .. "}"
  end
  return "null"
end

function M.encode(v) return enc(v) end
return M
