<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import { locale } from '$lib/i18n';

  const layout = `foxloves/
├── conf.lua              -- LÖVE window config (love.conf)
├── main.lua              -- demo / playground entry point (love .)
├── foxloves/             -- the library itself (require path root)
│   ├── init.lua          -- module entry: require("foxloves") -> table
│   ├── theme.lua         -- colors, radius, padding, font
│   ├── util.lua          -- shared helpers (contains, clamp, focus ring)
│   ├── container.lua     -- child management + relative coords (Panel, Tabs)
│   ├── root.lua          -- the UI manager (z-order, focus, overlays)
│   └── widgets/
│       ├── button.lua
│       ├── textbox.lua
│       └── …one file per widget
└── tests/
    ├── run.lua           -- registers + runs every case
    ├── harness.lua       -- installs the stub, loads fox, exposes check()
    ├── love_stub.lua     -- headless mock of the LÖVE API
    └── cases/            -- one assertion file per widget/topic`;

  const conf = `-- conf.lua
function love.conf(t)
  t.window.title = "foxloves demo"
  t.window.width = 900
  t.window.height = 600
  t.version = "11.4"        -- target LÖVE 11.x
end`;

  const requirePath = `-- Drop foxloves/ onto the require path, then:
local fox = require("foxloves")   -- returns { Button, Textbox, …, theme, util, Root }
-- Submodules resolve by dotted path from the project root:
--   require("foxloves.theme")            -> foxloves/theme.lua
--   require("foxloves.widgets.button")   -> foxloves/widgets/button.lua`;

  const theme = `-- foxloves/theme.lua
-- Widgets read every color/metric from a theme table; override by passing
-- \`theme\` in a widget's options, or replace the default here.
local M = {
  color = {
    bg        = {0.16, 0.17, 0.20, 1}, -- widget body fill
    fg        = {0.22, 0.24, 0.28, 1}, -- inset fill (textbox, track)
    accent    = {0.90, 0.55, 0.25, 1}, -- fox orange: active / on
    border    = {0.35, 0.37, 0.42, 1},
    hover     = {0.28, 0.30, 0.35, 1}, -- hovered fill (distinct from fg)
    focus     = {0.98, 0.72, 0.40, 1}, -- keyboard focus ring
    selection = {0.90, 0.55, 0.25, 0.35}, -- text selection (translucent accent)
    disabled  = {0.30, 0.31, 0.34, 1},
    text      = {0.94, 0.95, 0.97, 1},
    textMuted = {0.55, 0.57, 0.62, 1},
    info = {0.32,0.55,0.90,1}, success = {0.35,0.72,0.42,1},
    warning = {0.92,0.72,0.25,1}, error = {0.86,0.32,0.30,1},
  },
  radius = 4,
  padding = 8,
  font = nil,  -- filled from love.graphics.getFont() on first use
}

-- Resolve the active font: widget theme > module default > LÖVE current.
function M.getFont(theme)
  return (theme and theme.font) or M.font or love.graphics.getFont()
end

return M`;

  const util = `-- foxloves/util.lua — kept tiny and dependency-free.
local M = {}

-- Point-in-rectangle test used by every widget's :contains.
function M.contains(px, py, x, y, w, h)
  return px >= x and px <= x + w
     and py >= y and py <= y + h
end

-- Clamp v into [lo, hi].
function M.clamp(v, lo, hi)
  if v < lo then return lo end
  if v > hi then return hi end
  return v
end

-- Draw a keyboard focus ring just outside a widget's bounds. The caller
-- restores its own color afterwards (same contract rule as everywhere else).
function M.focusRing(theme, x, y, w, h)
  love.graphics.setColor(theme.color.focus or theme.color.accent)
  love.graphics.rectangle("line", x - 2, y - 2, w + 4, h + 4, theme.radius, theme.radius)
end

-- True when this widget currently holds keyboard focus in its Root. Widgets get
-- their .root set by Root:add / Root:openOverlay; standalone widgets return false.
function M.isFocused(widget)
  return widget.root ~= nil and widget.root.focused == widget
end

return M`;

  const btnCtor = `local defaultTheme = require("foxloves.theme")
local util = require("foxloves.util")

local Button = {}
Button.__index = Button

function Button.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Button)
  self.x, self.y = opts.x or 0, opts.y or 0
  self.w, self.h = opts.w or 120, opts.h or 32
  self.label    = opts.label or "Button"
  self.onClick  = opts.onClick       -- optional callback from opts
  self.disabled = opts.disabled or false
  self.theme    = opts.theme or defaultTheme
  self.hovered, self.pressed = false, false
  self.focusable = true              -- opt into Tab traversal
  return self
end

function Button:contains(px, py)
  return util.contains(px, py, self.x, self.y, self.w, self.h)
end
function Button:update(dt) end`;

  const btnDraw = `-- Hover is event-driven: coords arrive already in this widget's own space
-- (a Container translates before forwarding), so nested buttons hover correctly.
function Button:mousemoved(px, py)
  self.hovered = not self.disabled and self:contains(px, py)
end

function Button:draw()
  local t = self.theme
  local r, g, b, a = love.graphics.getColor()   -- 1. save prior color state

  local fill                                     -- 2. pick fill from state + theme
  if self.disabled then fill = t.color.disabled
  elseif self.pressed and self.hovered then fill = t.color.accent
  elseif self.hovered then fill = t.color.hover
  else fill = t.color.bg end

  love.graphics.setColor(fill)
  love.graphics.rectangle("fill", self.x, self.y, self.w, self.h, t.radius, t.radius)
  love.graphics.setColor(t.color.border)
  love.graphics.rectangle("line", self.x, self.y, self.w, self.h, t.radius, t.radius)

  if util.isFocused(self) then                   -- 3. focus ring when focused
    util.focusRing(t, self.x, self.y, self.w, self.h)
  end

  local font = defaultTheme.getFont(t)
  love.graphics.setFont(font)
  love.graphics.setColor(self.disabled and t.color.textMuted or t.color.text)
  local ty = self.y + (self.h - font:getHeight()) / 2
  love.graphics.printf(self.label, self.x, ty, self.w, "center")

  love.graphics.setColor(r, g, b, a)             -- 4. restore
end`;

  const btnInput = `function Button:mousepressed(px, py, btn)
  if self.disabled or btn ~= 1 then return false end
  if self:contains(px, py) then
    self.pressed = true
    return true                       -- consumed: caller stops propagation
  end
  return false
end

function Button:mousereleased(px, py, btn)
  if btn ~= 1 then return false end
  local wasPressed = self.pressed
  self.pressed = false
  if self.disabled or not wasPressed then return false end
  -- Fire only when the release lands inside AND the press began inside.
  if self:contains(px, py) then
    if self.onClick then self.onClick(self) end
    return true
  end
  return false
end

-- When focused (via Tab in a Root), Space/Enter activate like a click.
function Button:keypressed(key)
  if self.disabled or not util.isFocused(self) then return false end
  if key == "space" or key == "return" or key == "kpenter" then
    if self.onClick then self.onClick(self) end
    return true
  end
  return false
end
function Button:textinput(text) return false end

return Button`;

  const init = `-- foxloves/init.lua
return {
  theme  = require("foxloves.theme"),
  util   = require("foxloves.util"),
  Root   = require("foxloves.root"),
  Button = require("foxloves.widgets.button"),
  Textbox = require("foxloves.widgets.textbox"),
  Toggle  = require("foxloves.widgets.toggle"),
  -- …register every new widget here
}`;

  const driver = `-- main.lua — create widgets in love.load, forward callbacks to the Root.
local fox = require("foxloves")
local ui

function love.load()
  ui = fox.Root.new()
  ui:add(fox.Button.new{ x = 40, y = 40, w = 120, h = 34, label = "Greet",
    onClick = function() print("Hello!") end })
end

function love.update(dt)            ui:update(dt) end
function love.draw()                ui:draw() end
function love.mousepressed(x,y,b)   ui:mousepressed(x,y,b) end
function love.mousereleased(x,y,b)  ui:mousereleased(x,y,b) end
function love.mousemoved(x,y,dx,dy) ui:mousemoved(x,y,dx,dy) end
function love.wheelmoved(dx,dy)     ui:wheelmoved(dx,dy) end
function love.textinput(t)          ui:textinput(t) end
function love.keypressed(key)
  if ui:keypressed(key) then return end       -- let the UI consume first
  if key == "escape" then love.event.quit() end
end`;

  const tbFocus = `function Textbox.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Textbox)
  self.x, self.y = opts.x or 0, opts.y or 0
  self.w, self.h = opts.w or 200, opts.h or 32
  self.value       = opts.value or ""
  self.placeholder = opts.placeholder or ""
  self.onChange    = opts.onChange
  self.onSubmit    = opts.onSubmit
  self.maxLength   = opts.maxLength
  self.theme = opts.theme or defaultTheme
  self.focused = false
  self.caret = #self.value          -- caret position, in bytes
  self.focusable = true
  return self
end

-- Root calls this when keyboard focus moves here (Tab) or away. A widget that
-- tracks its own focus flag exposes setFocused so Root can keep them in sync.
function Textbox:setFocused(on)
  self.focused = on
end`;

  const tbType = `-- Insert text at the caret, honoring maxLength.
function Textbox:_insert(text)
  if self.maxLength then
    local room = self.maxLength - #self.value
    if room <= 0 then return end
    if #text > room then text = text:sub(1, room) end
  end
  self.value = self.value:sub(1, self.caret) .. text .. self.value:sub(self.caret + 1)
  self.caret = self.caret + #text
end

-- LÖVE delivers typed characters here; only the focused box accepts them.
function Textbox:textinput(text)
  if not self.focused then return false end
  self:_insert(text)
  if self.onChange then self.onChange(self.value) end
  return true
end

-- Enter submits then blurs; through Root so keyboard focus clears too.
function Textbox:keypressed(key)
  if not self.focused then return false end
  if key == "return" or key == "kpenter" then
    if self.onSubmit then self.onSubmit(self.value) end
    if self.root then self.root:setFocus(nil) else self:setFocused(false) end
    return true
  end
  -- …backspace, delete, left/right/home/end, selection + clipboard…
  return false
end`;

  const toggle = `function Toggle:_toggle()
  self.on = not self.on
  if self.onChange then self.onChange(self.on) end
end

function Toggle:mousereleased(px, py, btn)
  if btn ~= 1 then return false end
  local wasPressed = self.pressed
  self.pressed = false
  if self.disabled or not wasPressed then return false end
  if self:contains(px, py) then self:_toggle(); return true end
  return false
end

-- Ease the knob toward its target end each frame (0 = off, 1 = on).
local SLIDE_SPEED = 8
function Toggle:update(dt)
  local target = self.on and 1 or 0
  local step = SLIDE_SPEED * dt
  if self.anim < target then self.anim = math.min(target, self.anim + step)
  elseif self.anim > target then self.anim = math.max(target, self.anim - step) end
end`;

  const rootBase = `local Root = {}
Root.__index = Root

function Root.new()
  local self = setmetatable({}, Root)
  self.base = {}       -- ordered top-level widgets
  self.overlays = {}   -- LIFO of { widget = <w>, modal = <bool> }
  self.focused = nil   -- widget receiving keyboard, or nil
  return self
end

function Root:add(widget)
  widget.root = self   -- backref: lets widgets open overlays / clear focus
  table.insert(self.base, widget)
  return widget
end`;

  const rootFocus = `-- Move keyboard focus to widget (or nil), syncing widgets that track it.
function Root:setFocus(widget)
  if self.focused == widget then return end
  if self.focused and self.focused.setFocused then self.focused:setFocused(false) end
  self.focused = widget
  if widget and widget.setFocused then widget:setFocused(true) end
end

-- Tab / Shift-Tab cycle focus among base widgets with focusable == true.
function Root:keypressed(key)
  if key == "escape" and #self.overlays > 0 then self:closeOverlay(); return true end
  local top = self.overlays[#self.overlays]
  if top and top.modal then return top.widget:keypressed(key) end   -- modal traps keys
  if key == "tab" then
    local reverse = love.keyboard.isDown("lshift", "rshift")
    if self:_cycleFocus(reverse) then return true end
  end
  if self.focused and self.focused:keypressed(key) then return true end
  for _, w in ipairs(self.base) do if w:keypressed(key) then return true end end
  return false
end`;

  const rootOverlay = `function Root:openOverlay(widget, opts)
  opts = opts or {}
  widget.root = self
  table.insert(self.overlays, { widget = widget, modal = opts.modal or false })
  return widget
end

-- Overlays get first crack at a press, top-down; a modal swallows everything,
-- a non-modal that misses is dismissed and we keep falling through to the base.
function Root:mousepressed(px, py, btn)
  for i = #self.overlays, 1, -1 do
    local o = self.overlays[i]
    if o.widget:mousepressed(px, py, btn) then self:setFocus(o.widget); return true end
    if o.modal then return true end
    self:closeOverlay(o.widget)
  end
  for _, w in ipairs(self.base) do
    if w:mousepressed(px, py, btn) then self:setFocus(w); return true end
  end
  self:setFocus(nil)
  return false
end`;

  const container = `-- Container: child management + relative coordinates. Not a standalone widget;
-- Panel and Tabs embed one. originFn() returns the content origin (ox, oy).
function Container:draw()
  local ox, oy = self.originFn()
  love.graphics.push(); love.graphics.translate(ox, oy)   -- children drawn in local space
  for _, c in ipairs(self.children) do c:draw() end
  love.graphics.pop()
end

function Container:mousepressed(px, py, btn)
  local ox, oy = self.originFn()
  local lx, ly = px - ox, py - oy       -- subtract origin so children see local coords
  for _, c in ipairs(self.children) do
    if c:mousepressed(lx, ly, btn) then return true end
  end
  return false
end`;

  const stub = `-- tests/love_stub.lua — a headless mock of the LÖVE API. Only the calls widgets
-- actually make are implemented; drawing is a no-op, fonts are faked.
stub.install = function()
  local G = {}
  function G.getColor() return 1, 1, 1, 1 end
  function G.setColor() end
  function G.rectangle() end
  function G.print() end
  function G.printf() end
  function G.getFont() return fakeFont end   -- fakeFont:getWidth/getHeight/getWrap
  function G.getDimensions() return 800, 600 end
  -- push/pop/translate/setScissor/circle/line… all no-ops
  love = { graphics = G, keyboard = {...}, mouse = {...}, system = {...} }
end`;

  const harness = `-- tests/harness.lua — installs the stub, loads the library, exposes check().
package.path = "./?.lua;./?/init.lua;" .. package.path
local love_stub = require("tests.love_stub")
love_stub.install()

local H = { fox = require("foxloves"), pass = 0, fail = 0 }
function H.section(name) print(name) end
function H.check(name, cond)
  if cond then H.pass = H.pass + 1; print("  ok   " .. name)
  else H.fail = H.fail + 1; print("  FAIL " .. name) end
end
return H`;

  const testcase = `-- tests/cases/toggle.lua
local h = require("tests.harness")
local fox, check = h.fox, h.check

do
  h.section("Toggle")
  local got
  local tg = fox.Toggle.new{ x = 0, y = 0, w = 44, h = 24,
    onChange = function(v) got = v end }

  check("starts off", tg.on == false)
  tg:mousepressed(5, 5, 1); tg:mousereleased(5, 5, 1)
  check("clicked on", tg.on == true)
  check("onChange got true", got == true)

  -- animation eases toward the target over updates
  tg.anim = 0
  for _ = 1, 60 do tg:update(0.016) end
  check("anim reaches on end", tg.anim == 1)

  check("input ignored outside", tg:mousepressed(900, 900, 1) == false)
  local ok = pcall(function() tg:draw() end)
  check("draw no error", ok)     -- draw smoke test: never errors
end`;

  const runCases = `-- tests/run.lua registers each case file and reports totals.
local h = require("tests.harness")
local cases = { "button", "textbox", "toggle", "slider", "root", "modal", --[[ … ]] }
for _, name in ipairs(cases) do require("tests.cases." .. name) end
print(string.format("\\n%d passed, %d failed", h.pass, h.fail))
os.exit(h.fail == 0 and 0 or 1)`;
</script>

<svelte:head><title>Building foxloves — foxloves</title></svelte:head>

{#if $locale === 'pt'}
<h1>Construindo o foxloves do zero</h1>
<p class="lead">
  Um passo a passo completo de como a biblioteca é construída, camada por camada,
  na ordem em que você a montaria. O foxloves é Lua puro para LÖVE 11.x, sem
  dependências: um tema compartilhado, um conjunto de widgets que seguem um único
  contrato de ciclo de vida, um <code>Root</code> que os controla e uma suíte de
  testes headless.
</p>

<h2>1. Princípios de design</h2>
<p>Quatro restrições moldam cada decisão. Tenha-as em mente ao ler o restante.</p>
<ul>
  <li><strong>Sem dependências.</strong> Apenas Lua puro e a API do LÖVE. Entra em qualquer projeto love2d copiando uma pasta.</li>
  <li><strong>Um ciclo de vida.</strong> Cada widget implementa os mesmos poucos métodos, então o host controla uma lista heterogênea de widgets em um único laço.</li>
  <li><strong>Orientado a tema.</strong> Nenhum widget fixa cor ou métrica no código; toda a aparência vem de uma tabela de tema, então um jogo re-estiliza a interface inteira trocando uma tabela.</li>
  <li><strong>Testável headless.</strong> Um mock da API do LÖVE permite rodar toda a suíte em CI sem janela.</li>
</ul>

<h2>2. Estrutura do projeto</h2>
<h3>2.1 Organização de pastas</h3>
<p>A biblioteca fica em uma pasta interna <code>foxloves/</code> (a raiz do require); a pasta externa contém a demo e os testes.</p>
<CodeBlock code={layout} lang="text" />
<h3>2.2 Configuração da janela</h3>
<p><code>conf.lua</code> é o hook de pré-inicialização do LÖVE — defina a janela aqui.</p>
<CodeBlock code={conf} />
<h3>2.3 Resolução de módulos</h3>
<p>
  <code>require("foxloves")</code> carrega <code>foxloves/init.lua</code>, que retorna uma
  tabela com todos os widgets além de <code>theme</code> e <code>util</code>. Submódulos
  resolvem por caminho pontuado a partir da raiz do projeto.
</p>
<CodeBlock code={requirePath} />

<h2>3. O tema</h2>
<h3>3.1 Cores e métricas</h3>
<p>
  Centralize a aparência primeiro — tudo depois lê dela. Cores são tabelas
  <code>{'{r, g, b, a}'}</code> no intervalo 0–1; métricas são números simples.
</p>
<CodeBlock code={theme} />
<h3>3.2 Resolução de fonte e overrides</h3>
<p>
  <code>getFont</code> resolve a fonte ativa por ordem de prioridade: o tema do próprio
  widget, depois o padrão do módulo, depois a fonte atual do LÖVE. Cada widget aceita um
  <code>theme</code> opcional em suas opções e recorre a esse padrão, então um widget pode
  ser re-estilizado sem afetar os demais.
</p>
<h3>3.3 Cores semânticas de status</h3>
<p>
  <code>info</code>, <code>success</code>, <code>warning</code> e <code>error</code> dão aos
  widgets de status (Toast, Badge) um vocabulário compartilhado em vez de tons ad-hoc. Veja a
  <a href="/foundations/theme">referência de tema</a> para as amostras ao vivo.
</p>

<h2>4. Helpers compartilhados</h2>
<p>Antes do primeiro widget, um pequeno módulo <code>util</code> para o que todo widget repete.</p>
<h3>4.1 Geometria</h3>
<p><code>contains</code> alimenta o teste de acerto de cada widget; <code>clamp</code> limita valores de slider/stepper.</p>
<h3>4.2 Anel de foco e verificação de foco</h3>
<p>
  <code>focusRing</code> desenha o contorno de foco do teclado; <code>isFocused</code> pergunta
  ao <code>Root</code> do widget se ele está com o foco no momento. Ambos mantêm o modelo de
  foco consistente entre os widgets.
</p>
<CodeBlock code={util} />

<h2>5. O contrato do widget</h2>
<h3>5.1 Os seis métodos do ciclo de vida</h3>
<p>Cada widget é um módulo que retorna uma fábrica <code>Widget.new(opts)</code> e implementa:</p>
<ul>
  <li><code>update(dt)</code> — lógica por quadro (hover, piscar do cursor).</li>
  <li><code>draw()</code> — desenha com <code>love.graphics</code>, restaurando o estado de cor anterior.</li>
  <li><code>mousepressed / mousereleased(x, y, btn)</code> — retornam <code>true</code> quando consumidos.</li>
  <li><code>keypressed(key)</code>, <code>textinput(text)</code> — entrada de teclado.</li>
</ul>
<h3>5.2 As cinco regras</h3>
<ol>
  <li>Nunca chame <code>setColor</code> sem restaurar o estado anterior; leia todas as cores/métricas do tema.</li>
  <li>Widgets guardam o próprio estado — sem globais.</li>
  <li>Manipuladores de entrada retornam <code>true</code> quando consomem o evento, para o chamador interromper a propagação.</li>
  <li>Callbacks (<code>onClick</code>, <code>onChange</code>) vêm de <code>opts</code> e são opcionais.</li>
  <li>Documente a API pública em um bloco de comentário acima de <code>new</code>.</li>
</ol>
<h3>5.3 Ganchos adicionais opcionais</h3>
<p>Presentes apenas onde fazem sentido — os seis métodos centrais são estáveis e nunca crescem:</p>
<ul>
  <li><code>focusable = true</code> — participa da navegação por Tab; desenhe um anel e condicione a ativação por teclado a <code>isFocused</code>.</li>
  <li><code>setFocused(bool)</code> — deixa o <code>Root</code> sincronizar a flag de foco do próprio widget (o Textbox usa).</li>
  <li><code>wheelmoved(dx, dy)</code> — widgets roláveis; a roda não tem coordenadas, então o widget verifica o mouse contra os próprios limites.</li>
  <li><code>mousemoved(x, y, dx, dy)</code> — hover orientado a eventos em coordenadas locais.</li>
</ul>
<h3>5.4 O modelo de coordenadas</h3>
<p>
  Os manipuladores recebem coordenadas já no espaço do próprio widget. Um
  <code>Container</code> subtrai a origem do conteúdo antes de repassar, então um widget
  aninhado em um Panel testa acerto contra as mesmas coordenadas em que foi posicionado.
  Prefira <code>mousemoved</code> a consultar <code>love.mouse.getPosition()</code>, que
  retorna coordenadas de tela e falha dentro de um container transladado.
</p>

<h2>6. Primeiro widget: Button</h2>
<h3>6.1 Construtor e opções</h3>
<p>Leia opções com padrões, guarde o tema, exponha campos de estado, participe do foco.</p>
<CodeBlock code={btnCtor} />
<h3>6.2 Draw: preenchimentos por estado e restauração de cor</h3>
<p>Os quatro passos numerados são o contrato em miniatura: salvar a cor, escolher um preenchimento do tema conforme o estado, desenhar (mais o anel de foco), restaurar.</p>
<CodeBlock code={btnDraw} />
<h3>6.3 Semântica de consumo</h3>
<p>
  O press marca <code>pressed</code> e retorna <code>true</code>; o release dispara
  <code>onClick</code> apenas quando cai dentro <em>e</em> o press começou dentro — o
  comportamento padrão de botão que permite ao usuário deslizar para fora e cancelar.
</p>
<CodeBlock code={btnInput} />
<h3>6.4 Ativação por teclado</h3>
<p>Condicionada ao foco: quando o Button está com o foco em um Root, Espaço/Enter disparam o mesmo <code>onClick</code>. (Mostrado no trecho acima.)</p>

<h2>7. Registre e execute</h2>
<h3>7.1 A tabela de exportação</h3>
<p><code>init.lua</code> é a superfície pública; adicione cada novo widget aqui.</p>
<CodeBlock code={init} />
<h3>7.2 O laço de controle</h3>
<p>Crie widgets em <code>love.load</code> e repasse cada callback do LÖVE ao Root, deixando a interface consumir a entrada primeiro.</p>
<CodeBlock code={driver} />

<h2>8. Entrada com estado: Textbox</h2>
<h3>8.1 Foco que o Root pode sincronizar</h3>
<p>
  Diferente do Button, um Textbox mantém a própria flag <code>focused</code> e expõe
  <code>setFocused</code> para o <code>Root</code> manter o foco gerenciado e a flag da caixa
  em sincronia quando o Tab move o foco para dentro ou fora.
</p>
<CodeBlock code={tbFocus} />
<h3>8.2 Digitação e edição</h3>
<p>
  <code>textinput</code> insere caracteres na posição do cursor (respeitando
  <code>maxLength</code>); <code>keypressed</code> trata teclas de edição. O widget real também
  faz movimento de cursor, saltos por palavra, uma seleção de intervalo e recortar/copiar/colar
  via área de transferência do sistema — tudo sobre o mesmo <code>value</code> indexado por bytes.
</p>
<CodeBlock code={tbType} />
<h3>8.3 Callbacks de mudança e envio</h3>
<p>
  <code>onChange(newValue)</code> dispara a cada edição; Enter dispara <code>onSubmit(value)</code>
  e tira o foco pelo Root, limpando também o foco de teclado.
</p>

<h2>9. Widgets de valor: o padrão Toggle</h2>
<h3>9.1 Valor mais onChange</h3>
<p>
  Checkbox, Toggle, Slider e Stepper compartilham a forma: guardar um valor, alterá-lo na
  interação e disparar <code>onChange(value)</code> apenas quando ele realmente muda.
</p>
<h3>9.2 Animação no update</h3>
<p>
  Mudanças de estado são instantâneas, mas os visuais suavizam. O Toggle guarda um valor
  <code>anim</code> em <code>[0, 1]</code> e o avança em direção ao alvo a cada quadro no
  <code>update</code> — o mesmo padrão que Modal e Slider usam para o movimento de
  entrada/manípulo.
</p>
<CodeBlock code={toggle} />

<h2>10. fox.Root: o gerenciador</h2>
<p>
  Widgets isolados funcionam, mas uma interface real precisa de ordem de profundidade, um
  único foco de teclado e sobreposições. O <code>Root</code> possui uma camada base mais uma
  pilha de sobreposições e roteia os eventos do LÖVE para elas.
</p>
<h3>10.1 A camada base</h3>
<p><code>add</code> registra um widget e define seu backref <code>.root</code>, para o widget depois abrir sobreposições ou limpar o foco.</p>
<CodeBlock code={rootBase} />
<h3>10.2 Foco de teclado e navegação por Tab</h3>
<p>
  <code>setFocus</code> move o foco e sincroniza qualquer widget com <code>setFocused</code>;
  Tab / Shift-Tab circulam entre widgets base focáveis. Uma sobreposição modal captura as
  teclas antes de a camada base vê-las.
</p>
<CodeBlock code={rootFocus} />
<h3>10.3 A pilha de sobreposições</h3>
<p>
  Sobreposições são empilhadas com <code>{'openOverlay(widget, { modal = bool })'}</code> e
  removidas com <code>closeOverlay</code>. Uma modal captura toda a entrada; uma não-modal
  (dropdown, tooltip) é descartada quando um clique cai fora dela.
</p>
<CodeBlock code={rootOverlay} />
<h3>10.4 Ordem de roteamento de eventos</h3>
<p>
  A entrada flui de cima para baixo: sobreposições primeiro (topo da pilha primeiro), depois
  widgets base, o primeiro que consome vence. O desenho vai ao contrário — base, depois
  sobreposições de baixo para cima — para as sobreposições posteriores pintarem por cima. Esc
  fecha a sobreposição do topo antes de qualquer outra coisa.
</p>

<h2>11. Containers e aninhamento</h2>
<h3>11.1 Coordenadas relativas</h3>
<p>
  <code>Container</code> é maquinário compartilhado (não um widget isolado) para widgets que
  contêm filhos. Ele translada por uma origem de conteúdo no <code>draw</code> e subtrai essa
  origem das coordenadas de entrada, então os filhos vivem em espaço local e o aninhamento compõe.
</p>
<CodeBlock code={container} />
<h3>11.2 Construindo Panel e Tabs sobre ele</h3>
<p>
  O Panel embute um Container e fornece um <code>originFn</code> que aponta para sua área de
  conteúdo (dentro da barra de título e do espaçamento). O Tabs troca qual painel filho o
  Container desenha conforme o cabeçalho selecionado. Como cada nível aplica seu próprio
  deslocamento, um Button dentro de um Panel dentro de Tabs ainda recebe hover e cliques corretamente.
</p>

<h2>12. Sobreposições</h2>
<p>Com Root e Container no lugar, sobreposições são apenas widgets empilhados:</p>
<ul>
  <li><strong>Modal</strong> — scrim + diálogo centralizado com botões; captura a entrada; entra suavemente por um valor <code>anim</code>.</li>
  <li><strong>Dropdown</strong> — um controle fechado que abre um popup rolável como sobreposição não-modal.</li>
  <li><strong>Tooltip</strong> — monitora o hover sobre um alvo e faz uma dica surgir perto do cursor.</li>
  <li><strong>ContextMenu</strong> — abre um popup em um ponto via <code>{'root:openOverlay(popup, { modal = false })'}</code>.</li>
  <li><strong>ToastHost</strong> — uma pilha, em um canto, de mensagens transitórias, cada uma sumindo por um temporizador.</li>
</ul>

<h2>13. Testando headless</h2>
<p>A suíte faz mock do LÖVE para rodar sem janela e cair direto em CI.</p>
<h3>13.1 O stub do LÖVE</h3>
<p>Implemente apenas as chamadas que os widgets fazem; o desenho é no-op, as fontes são falsas com métricas fixas.</p>
<CodeBlock code={stub} />
<h3>13.2 O harness</h3>
<p>Instale o stub, carregue a biblioteca uma vez e exponha um <code>check</code> compartilhado mais contadores de aprovado/reprovado.</p>
<CodeBlock code={harness} />
<h3>13.3 Escrevendo um caso</h3>
<p>
  Um caso constrói um widget, altera o estado, verifica que callbacks disparam e que a entrada
  é consumida ou ignorada corretamente, e desenha uma vez como teste de fumaça (nunca dá erro).
</p>
<CodeBlock code={testcase} />
<h3>13.4 Executando a suíte</h3>
<p>Liste cada caso em <code>run.lua</code>; o executor sai com código diferente de zero em qualquer falha.</p>
<CodeBlock code={runCases} />
<CodeBlock code={'luajit tests/run.lua'} lang="bash" />

<h2>14. Convenções e crescimento</h2>
<p>O estilo da casa que mantém o sistema coerente conforme ele cresce:</p>
<ul>
  <li>Padrão de módulo local: <code>{'local M = {}'}</code> … <code>return M</code>. Indentação de 2 espaços, sem tabs.</li>
  <li>Mantenha cada arquivo de widget abaixo de ~200 linhas; extraia lógica repetida para <code>util.lua</code> ou <code>container.lua</code>.</li>
  <li>Nomes descritivos; sem locais de uma letra, exceto índices de laço e coordenadas.</li>
  <li>Commits convencionais (<code>feat</code>, <code>fix</code>, <code>docs</code>, <code>test</code>, <code>refactor</code>, <code>chore</code>), assunto imperativo ≤ 50 caracteres.</li>
</ul>
<p><strong>Checklist para adicionar um widget:</strong></p>
<ol>
  <li>Crie <code>foxloves/widgets/name.lua</code> com um <code>new</code> documentado e os seis métodos.</li>
  <li>Leia toda a aparência do tema; adicione qualquer token faltante a <code>theme.lua</code>.</li>
  <li>Registre-o em <code>init.lua</code>.</li>
  <li>Adicione <code>tests/cases/name.lua</code> e liste-o em <code>run.lua</code>; rode <code>luajit tests/run.lua</code>.</li>
  <li>Mostre-o em <code>main.lua</code> e exercite com <code>love .</code>.</li>
</ol>

{:else}
<h1>Building foxloves from scratch</h1>
<p class="lead">
  A complete walkthrough of how the library is constructed, layer by layer, in
  the order you would build it. foxloves is pure Lua for LÖVE 11.x with no
  dependencies: a shared theme, a set of widgets that all obey one lifecycle
  contract, a <code>Root</code> that drives them, and a headless test suite.
</p>

<!-- 1 -->
<h2>1. Design principles</h2>
<p>Four constraints shape every decision. Keep them in mind as you read the rest.</p>
<ul>
  <li><strong>No dependencies.</strong> Pure Lua and the LÖVE API only. It drops into any love2d project by copying one folder.</li>
  <li><strong>One lifecycle.</strong> Every widget implements the same handful of methods, so a host can drive a heterogeneous list of widgets in a single loop.</li>
  <li><strong>Theme-driven.</strong> No widget hardcodes a color or metric; all appearance comes from a theme table, so a game restyles the whole UI by swapping one table.</li>
  <li><strong>Headless-testable.</strong> A mock of the LÖVE API lets the whole suite run in CI with no window.</li>
</ul>

<!-- 2 -->
<h2>2. Project skeleton</h2>

<h3>2.1 Folder layout</h3>
<p>The library lives in an inner <code>foxloves/</code> folder (the require root); the outer folder holds the demo and tests.</p>
<CodeBlock code={layout} lang="text" />

<h3>2.2 Window config</h3>
<p><code>conf.lua</code> is LÖVE's pre-boot hook — set the window here.</p>
<CodeBlock code={conf} />

<h3>2.3 Module resolution</h3>
<p>
  <code>require("foxloves")</code> loads <code>foxloves/init.lua</code>, which returns a
  table of every widget plus <code>theme</code> and <code>util</code>. Submodules resolve by
  dotted path from the project root.
</p>
<CodeBlock code={requirePath} />

<!-- 3 -->
<h2>3. The theme</h2>

<h3>3.1 Colors and metrics</h3>
<p>
  Centralize appearance first — everything downstream reads from it. Colors are
  <code>{'{r, g, b, a}'}</code> tables in 0–1 range; metrics are plain numbers.
</p>
<CodeBlock code={theme} />

<h3>3.2 Font resolution and overrides</h3>
<p>
  <code>getFont</code> resolves the active font in priority order: a widget's own theme,
  then the module default, then LÖVE's current font. Every widget accepts an
  optional <code>theme</code> in its options and falls back to this default, so one widget
  can be restyled without touching the rest.
</p>

<h3>3.3 Semantic status colors</h3>
<p>
  <code>info</code>, <code>success</code>, <code>warning</code>, and <code>error</code>
  give status widgets (Toast, Badge) a shared vocabulary rather than ad-hoc hues. See the
  <a href="/foundations/theme">Theme reference</a> for the live swatches.
</p>

<!-- 4 -->
<h2>4. Shared helpers</h2>
<p>Before the first widget, a tiny <code>util</code> module for what every widget repeats.</p>

<h3>4.1 Geometry</h3>
<p><code>contains</code> powers every widget's hit-test; <code>clamp</code> bounds slider/stepper values.</p>

<h3>4.2 Focus ring and focus check</h3>
<p>
  <code>focusRing</code> draws the keyboard-focus outline; <code>isFocused</code> asks the
  widget's <code>Root</code> whether this widget currently holds focus. Both keep the
  focus model consistent across widgets.
</p>
<CodeBlock code={util} />

<!-- 5 -->
<h2>5. The widget contract</h2>

<h3>5.1 The six lifecycle methods</h3>
<p>Every widget is a module returning a factory <code>Widget.new(opts)</code>, and implements:</p>
<ul>
  <li><code>update(dt)</code> — per-frame logic (hover, caret blink, animation).</li>
  <li><code>draw()</code> — render with <code>love.graphics</code>, restoring prior color state.</li>
  <li><code>mousepressed / mousereleased(x, y, btn)</code> — return <code>true</code> when consumed.</li>
  <li><code>keypressed(key)</code>, <code>textinput(text)</code> — keyboard input.</li>
</ul>

<h3>5.2 The five rules</h3>
<ol>
  <li>Never call <code>setColor</code> without restoring prior state; read all colors/metrics from the theme.</li>
  <li>Widgets hold their own state — no globals.</li>
  <li>Input handlers return <code>true</code> when they consume the event, so the caller stops propagation.</li>
  <li>Callbacks (<code>onClick</code>, <code>onChange</code>) come from <code>opts</code> and are optional.</li>
  <li>Document the public API in a comment block above <code>new</code>.</li>
</ol>

<h3>5.3 Optional additive hooks</h3>
<p>Present only where they fit — the six core methods are stable and never grow:</p>
<ul>
  <li><code>focusable = true</code> — opt into Tab traversal; draw a ring and gate keyboard activation on <code>isFocused</code>.</li>
  <li><code>setFocused(bool)</code> — let <code>Root</code> sync a widget's own focus flag (Textbox uses it).</li>
  <li><code>wheelmoved(dx, dy)</code> — scrollable widgets; the wheel has no coordinates, so the widget self-checks the mouse against its bounds.</li>
  <li><code>mousemoved(x, y, dx, dy)</code> — event-driven hover in local coordinates.</li>
</ul>

<h3>5.4 The coordinate model</h3>
<p>
  Handlers receive coordinates already in the widget's own space. A
  <code>Container</code> subtracts its content origin before forwarding, so a widget nested
  in a Panel hit-tests against the same coordinates it was positioned in.
  Prefer <code>mousemoved</code> over polling <code>love.mouse.getPosition()</code>, which
  yields screen coords and misfires inside a translated container.
</p>

<!-- 6 -->
<h2>6. First widget: Button</h2>

<h3>6.1 Constructor and options</h3>
<p>Read options with defaults, stash the theme, expose state fields, opt into focus.</p>
<CodeBlock code={btnCtor} />

<h3>6.2 Draw: state-driven fills and color restore</h3>
<p>The four numbered steps are the contract in miniature: save color, pick a themed fill from state, draw (plus focus ring), restore.</p>
<CodeBlock code={btnDraw} />

<h3>6.3 Consume semantics</h3>
<p>
  Press marks <code>pressed</code> and returns <code>true</code>; release fires
  <code>onClick</code> only when the release lands inside <em>and</em> the press began
  inside — the standard button behavior that lets a user slide off to cancel.
</p>
<CodeBlock code={btnInput} />

<h3>6.4 Keyboard activation</h3>
<p>Gated on focus: when the Button holds focus in a Root, Space/Enter fire the same <code>onClick</code>. (Shown in the snippet above.)</p>

<!-- 7 -->
<h2>7. Register and run it</h2>

<h3>7.1 The export table</h3>
<p><code>init.lua</code> is the public surface; add each new widget here.</p>
<CodeBlock code={init} />

<h3>7.2 The driver loop</h3>
<p>
  Create widgets in <code>love.load</code>, then forward each LÖVE callback to the Root,
  letting the UI consume input first.
</p>
<CodeBlock code={driver} />

<!-- 8 -->
<h2>8. Stateful input: Textbox</h2>

<h3>8.1 Focus that the Root can sync</h3>
<p>
  Unlike Button, a Textbox tracks its own <code>focused</code> flag and exposes
  <code>setFocused</code> so <code>Root</code> keeps managed focus and the box's flag in
  step when Tab moves focus in or out.
</p>
<CodeBlock code={tbFocus} />

<h3>8.2 Text entry and editing</h3>
<p>
  <code>textinput</code> inserts characters at the caret (respecting <code>maxLength</code>);
  <code>keypressed</code> handles editing keys. The real widget also does caret movement,
  word jumps, a selection range, and system-clipboard cut/copy/paste — all built on the
  same byte-indexed value.
</p>
<CodeBlock code={tbType} />

<h3>8.3 Change and submit callbacks</h3>
<p>
  <code>onChange(newValue)</code> fires on any edit; Enter fires <code>onSubmit(value)</code>
  and blurs through the Root so keyboard focus clears too.
</p>

<!-- 9 -->
<h2>9. Value widgets: the Toggle pattern</h2>

<h3>9.1 Value plus onChange</h3>
<p>
  Checkbox, Toggle, Slider, and Stepper share a shape: hold a value, mutate it on
  interaction, and fire <code>onChange(value)</code> only when it actually changes.
</p>

<h3>9.2 Animation in update</h3>
<p>
  State changes are instant, but the visuals ease. Toggle stores an <code>anim</code>
  value in <code>[0, 1]</code> and advances it toward the target each frame in
  <code>update</code> — the same pattern Modal and Slider use for entrance/handle motion.
</p>
<CodeBlock code={toggle} />

<!-- 10 -->
<h2>10. fox.Root: the manager</h2>
<p>
  Standalone widgets work, but a real UI needs z-order, one keyboard focus, and
  overlays. <code>Root</code> owns a base layer plus an overlay stack and routes LÖVE
  events to them.
</p>

<h3>10.1 The base layer</h3>
<p><code>add</code> registers a widget and sets its <code>.root</code> backref, so the widget can later open overlays or clear focus.</p>
<CodeBlock code={rootBase} />

<h3>10.2 Keyboard focus and Tab cycling</h3>
<p>
  <code>setFocus</code> moves focus and syncs any <code>setFocused</code> widget; Tab /
  Shift-Tab cycle among focusable base widgets. A modal overlay traps keys before the
  base layer sees them.
</p>
<CodeBlock code={rootFocus} />

<h3>10.3 The overlay stack</h3>
<p>
  Overlays are pushed with <code>{'openOverlay(widget, { modal = bool })'}</code> and
  popped with <code>closeOverlay</code>. A modal traps all input; a non-modal (dropdown,
  tooltip) is dismissed when a press lands outside it.
</p>
<CodeBlock code={rootOverlay} />

<h3>10.4 Event routing order</h3>
<p>
  Input flows top-down: overlays first (top of stack first), then base widgets,
  first-consume-wins. Draw runs the other way — base, then overlays bottom-to-top —
  so later overlays paint on top. Esc closes the top overlay before anything else.
</p>

<!-- 11 -->
<h2>11. Containers and nesting</h2>

<h3>11.1 Relative coordinates</h3>
<p>
  <code>Container</code> is shared machinery (not a standalone widget) for widgets that
  hold children. It translates by a content origin in <code>draw</code> and subtracts that
  origin from input coordinates, so children live in local space and nesting composes.
</p>
<CodeBlock code={container} />

<h3>11.2 Building Panel and Tabs on it</h3>
<p>
  Panel embeds a Container and supplies an <code>originFn</code> that points at its content
  area (inside the title bar and padding). Tabs swaps which child panel the Container draws
  based on the selected header. Because each level applies its own offset, a Button inside a
  Panel inside Tabs still hovers and clicks correctly.
</p>

<!-- 12 -->
<h2>12. Overlays</h2>
<p>
  With Root and Container in place, overlays are just widgets pushed onto the stack:
</p>
<ul>
  <li><strong>Modal</strong> — scrim + centered dialog with buttons; traps input; eases in via an <code>anim</code> value.</li>
  <li><strong>Dropdown</strong> — a closed control that opens a scrollable popup as a non-modal overlay.</li>
  <li><strong>Tooltip</strong> — polls hover on a target and fades a hint in near the cursor.</li>
  <li><strong>ContextMenu</strong> — opens a popup at a point via <code>{'root:openOverlay(popup, { modal = false })'}</code>.</li>
  <li><strong>ToastHost</strong> — a corner stack of transient messages, each fading on a timer.</li>
</ul>

<!-- 13 -->
<h2>13. Testing headless</h2>
<p>The suite mocks LÖVE so it runs with no window and drops straight into CI.</p>

<h3>13.1 The LÖVE stub</h3>
<p>Implement only the calls widgets make; drawing is a no-op, fonts are faked with fixed metrics.</p>
<CodeBlock code={stub} />

<h3>13.2 The harness</h3>
<p>Install the stub, load the library once, and expose a shared <code>check</code> plus pass/fail counters.</p>
<CodeBlock code={harness} />

<h3>13.3 Writing a case</h3>
<p>
  A case constructs a widget, mutates state, asserts callbacks fire and input is
  consumed or ignored correctly, and draws once as a smoke test (never errors).
</p>
<CodeBlock code={testcase} />

<h3>13.4 Running the suite</h3>
<p>List each case in <code>run.lua</code>; the runner exits non-zero on any failure.</p>
<CodeBlock code={runCases} />
<CodeBlock code={'luajit tests/run.lua'} lang="bash" />

<!-- 14 -->
<h2>14. Conventions and growth</h2>
<p>The house style that keeps the system coherent as it grows:</p>
<ul>
  <li>Local module pattern: <code>{'local M = {}'}</code> … <code>return M</code>. 2-space indent, no tabs.</li>
  <li>Keep each widget file under ~200 lines; lift repeated logic into <code>util.lua</code> or <code>container.lua</code>.</li>
  <li>Descriptive names; no single-letter locals except loop indices and coordinates.</li>
  <li>Conventional commits (<code>feat</code>, <code>fix</code>, <code>docs</code>, <code>test</code>, <code>refactor</code>, <code>chore</code>), imperative subject ≤ 50 chars.</li>
</ul>
<p><strong>Checklist to add a widget:</strong></p>
<ol>
  <li>Create <code>foxloves/widgets/name.lua</code> with a documented <code>new</code> and the six methods.</li>
  <li>Read all appearance from the theme; add any missing token to <code>theme.lua</code>.</li>
  <li>Register it in <code>init.lua</code>.</li>
  <li>Add <code>tests/cases/name.lua</code> and list it in <code>run.lua</code>; run <code>luajit tests/run.lua</code>.</li>
  <li>Show it in <code>main.lua</code> and exercise it with <code>love .</code>.</li>
</ol>
{/if}

<style>
  .lead {
    font-size: 17px;
    color: var(--fox-text-muted);
    max-width: 700px;
  }
  h2 {
    margin-top: 40px;
    border-bottom: 1px solid var(--fox-border);
    padding-bottom: 6px;
  }
  h3 {
    margin-top: 24px;
    color: var(--fox-text);
  }
  li {
    margin: 4px 0;
  }
  p {
    max-width: 720px;
  }
</style>
