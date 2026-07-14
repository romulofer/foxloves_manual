function love.conf(t)
  t.identity = "foxloves-manual-shots"   -- save dir name
  -- Screen-relative overlays (modal, toast, tooltip) center/anchor via
  -- love.graphics.getDimensions(); the fullscreen shots use a canvas of this
  -- size so their positioning lands correctly.
  t.window.width = 420
  t.window.height = 260
  t.window.visible = false
  t.window.borderless = true
  t.modules.audio = false
  t.modules.sound = false
end
