export interface WidgetOption {
  name: string;
  default: string | null;
  type: string;
  description?: string;
  isCallback: boolean;
}
export interface WidgetCapabilities {
  focusable: boolean;
  keys: string[];
  wheel: boolean;
  mousemoved: boolean;
}
export interface WidgetDoc {
  id: string;
  displayName: string;
  title: string;
  summary: string;
  options: WidgetOption[];
  capabilities: WidgetCapabilities;
  sourceExcerpt: string;
  category: 'control' | 'container-overlay';
}
export interface Shot {
  state: string;
  file: string;
  w: number;
  h: number;
}
export interface ThemeColor {
  name: string;
  rgba: number[];
  hex: string;
  rgbaCss: string;
  note?: string;
}
export interface Tokens {
  colors: ThemeColor[];
  radius: number;
  padding: number;
}
