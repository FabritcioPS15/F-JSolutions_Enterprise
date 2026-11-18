import type { ThemeDefinition } from '../types';
import { functionalColors } from '../core/colors';

export const systemsTheme: ThemeDefinition = {
  id: 'sparktree-systems',
  name: 'SparkTree Systems',
  app: 'systems',
  personality: 'tecnológica, confiable, empresarial y robusta',
  palette: {
    primary: '#102A43',
    secondary: '#1769AA',
    accent: '#00B8D9',
    accentLight: '#75D7E8',
    background: '#F1F6FA',
    text: '#172B3A',
    surface: '#FFFFFF',
    surfaceMuted: '#E4EEF5',
    border: '#CBDCE8',
    borderSubtle: '#DCE8F1',
    muted: '#526D82',
    mutedText: '#3E576B',
    ring: '#00B8D9',
  },
  dark: {
    primary: '#00B8D9',
    secondary: '#1769AA',
    accent: '#75D7E8',
    accentLight: '#102A43',
    background: '#0B1220',
    text: '#E6EBF5',
    surface: '#131D2F',
    surfaceMuted: '#1A273D',
    border: '#24344D',
    borderSubtle: '#1C293F',
    muted: '#7A95AA',
    mutedText: '#A1B7C8',
    ring: '#00B8D9',
  },
  functional: functionalColors,
  typography: {
    fontSans: 'var(--font-inter, Inter), system-ui, sans-serif',
    fontHeading: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif',
    fontMono: 'ui-monospace, "Cascadia Code", "Segoe UI Mono", monospace',
  },
  borderRadius: {
    button: '0.5rem',   // 8px
    card: '1rem',       // 16px
    badge: '9999px',
    input: '0.5rem',    // 8px
  },
};
