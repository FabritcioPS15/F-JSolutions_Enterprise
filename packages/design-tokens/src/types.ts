export interface PaletteTokens {
  primary: string;
  secondary: string;
  accent: string;
  accentLight: string;
  background: string;
  text: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  borderSubtle: string;
  muted: string;
  mutedText: string;
  ring: string;
}

export interface FunctionalColors {
  success: string;
  successLight: string;
  successText: string;
  warning: string;
  warningLight: string;
  warningText: string;
  error: string;
  errorLight: string;
  errorText: string;
  info: string;
  infoLight: string;
  infoText: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  app: string;
  personality: string;
  palette: PaletteTokens;
  dark: PaletteTokens;
  functional: FunctionalColors;
  typography: {
    fontSans: string;
    fontHeading: string;
    fontMono: string;
  };
  borderRadius: {
    button: string;
    card: string;
    badge: string;
    input: string;
  };
}
