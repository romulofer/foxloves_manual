import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export type Locale = 'en' | 'pt';
export const LOCALES: { id: Locale; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'pt', label: 'PT-BR' }
];

type Dict = Record<string, string>;

// Authored UI strings. Source-derived widget text (summaries, option
// descriptions, source excerpts) stays in the library's language (English).
const strings: Record<Locale, Dict> = {
  en: {
    'nav.theme': 'Theme',
    'nav.lifecycle': 'Lifecycle',
    'nav.building': 'Building foxloves',
    'nav.allWidgets': 'All widgets',
    'nav.controls': 'Controls',
    'nav.containers': 'Containers / Overlays',
    'nav.language': 'Language',

    'widget.appearance': 'Appearance',
    'widget.capabilities': 'Capabilities',
    'widget.options': 'Options',
    'widget.example': 'Example',
    'widget.source': 'Source',

    'table.option': 'Option',
    'table.type': 'Type',
    'table.default': 'Default',
    'table.description': 'Description',

    'cap.focusable': 'Focusable',
    'cap.wheel': 'Scroll wheel',
    'cap.hover': 'Hover',
    'cap.displayOnly': 'Display only',

    'cat.control': 'Control',
    'cat.container': 'Container / Overlay',

    'widgets.title': 'Widgets',
    'widgets.filter': 'Filter widgets…',

    'home.lead':
      'A dependency-free, themeable UI widget library for LÖVE (love2d). {n} widgets sharing one input and drawing lifecycle.',
    'home.install': 'Install',
    'home.installText': 'Copy the foxloves/ folder onto your require path, then:',
    'home.quickstart': 'Quick start',
    'home.browse': 'Browse all {n} widgets →',

    'theme.title': 'Theme',
    'theme.intro':
      'Every widget reads colors and metrics from a shared theme table. Override per widget via the theme option, or replace the default in foxloves/theme.lua.',
    'theme.colors': 'Colors',
    'theme.metrics': 'Metrics',
    'theme.radius': 'Corner radius',
    'theme.padding': 'Padding',

    'lc.title': 'Widget lifecycle',
    'lc.intro':
      'Every widget follows the same contract so a host can drive them uniformly. Input handlers return true when they consume an event, so callers can stop propagation.',
    'lc.item.update': 'per-frame logic (hover, caret blink).',
    'lc.item.draw': 'renders via love.graphics; restores prior color state.',
    'lc.item.mouse': 'return true if consumed.',
    'lc.item.keyboard': 'keyboard input.',
    'lc.item.optional': 'optional hooks.',
    'lc.rootTitle': 'Driving with fox.Root',
    'lc.rootText':
      'fox.Root coordinates z-order, input capture, and keyboard focus. Tab / Shift-Tab move focus between focusable widgets; Space/Enter (or arrows) activate the focused one.',

    'build.enOnly': ''
  },
  pt: {
    'nav.theme': 'Tema',
    'nav.lifecycle': 'Ciclo de vida',
    'nav.building': 'Construindo o foxloves',
    'nav.allWidgets': 'Todos os widgets',
    'nav.controls': 'Controles',
    'nav.containers': 'Contêineres / Sobreposições',
    'nav.language': 'Idioma',

    'widget.appearance': 'Aparência',
    'widget.capabilities': 'Capacidades',
    'widget.options': 'Opções',
    'widget.example': 'Exemplo',
    'widget.source': 'Código-fonte',

    'table.option': 'Opção',
    'table.type': 'Tipo',
    'table.default': 'Padrão',
    'table.description': 'Descrição',

    'cap.focusable': 'Focável',
    'cap.wheel': 'Roda do mouse',
    'cap.hover': 'Ao passar o mouse',
    'cap.displayOnly': 'Somente exibição',

    'cat.control': 'Controle',
    'cat.container': 'Contêiner / Sobreposição',

    'widgets.title': 'Widgets',
    'widgets.filter': 'Filtrar widgets…',

    'home.lead':
      'Uma biblioteca de widgets de interface para LÖVE (love2d), sem dependências e com temas. {n} widgets compartilhando um único ciclo de entrada e desenho.',
    'home.install': 'Instalação',
    'home.installText': 'Copie a pasta foxloves/ para o seu caminho de require e:',
    'home.quickstart': 'Início rápido',
    'home.browse': 'Ver todos os {n} widgets →',

    'theme.title': 'Tema',
    'theme.intro':
      'Cada widget lê cores e métricas de uma tabela de tema compartilhada. Sobrescreva por widget pela opção theme, ou substitua o padrão em foxloves/theme.lua.',
    'theme.colors': 'Cores',
    'theme.metrics': 'Métricas',
    'theme.radius': 'Raio dos cantos',
    'theme.padding': 'Espaçamento',

    'lc.title': 'Ciclo de vida do widget',
    'lc.intro':
      'Cada widget segue o mesmo contrato para que o host os controle de forma uniforme. Os manipuladores de entrada retornam true quando consomem um evento, permitindo interromper a propagação.',
    'lc.item.update': 'lógica por quadro (hover, piscar do cursor).',
    'lc.item.draw': 'desenha via love.graphics; restaura o estado de cor anterior.',
    'lc.item.mouse': 'retorna true se consumido.',
    'lc.item.keyboard': 'entrada de teclado.',
    'lc.item.optional': 'ganchos opcionais.',
    'lc.rootTitle': 'Controlando com fox.Root',
    'lc.rootText':
      'fox.Root coordena ordem de profundidade, captura de entrada e foco de teclado. Tab / Shift-Tab movem o foco entre widgets focáveis; Espaço/Enter (ou setas) ativam o widget em foco.',

    'build.enOnly': 'Este guia está disponível apenas em inglês por enquanto.'
  }
};

function detect(): Locale {
  if (!browser) return 'en';
  const saved = localStorage.getItem('locale');
  if (saved === 'en' || saved === 'pt') return saved;
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

export const locale = writable<Locale>(detect());

if (browser) {
  locale.subscribe((l) => localStorage.setItem('locale', l));
}

/** Reactive translator: `$t('key', { n: 5 })`. Falls back to English, then the key. */
export const t = derived(
  locale,
  ($l) =>
    (key: string, vars?: Record<string, string | number>): string => {
      let s = strings[$l][key] ?? strings.en[key] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
      return s;
    }
);
