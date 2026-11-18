import type { ThemeDefinition } from '../types';
import { functionalColors } from '../core/colors';

export const academiaTheme: ThemeDefinition = {
  id: 'sparktree-academia',
  name: 'SparkTree Academia',
  app: 'academia',
  personality: 'educativa, innovadora, amigable y profesional',
  palette: {
    primary: '#263B73',
    secondary: '#4267C7',
    accent: '#F4B942',
    accentLight: '#A5B8EF',
    background: '#F7F9FE',
    text: '#202B46',
    surface: '#FFFFFF',
    surfaceMuted: '#EEF2FC',
    border: '#D3DCF6',
    borderSubtle: '#E2E8F9',
    muted: '#627299',
    mutedText: '#4F5E84',
    ring: '#4267C7',
  },
  dark: {
    primary: '#4267C7',
    secondary: '#263B73',
    accent: '#F4B942',
    accentLight: '#182447',
    background: '#0D1426',
    text: '#EEF2FB',
    surface: '#151F3B',
    surfaceMuted: '#1E2B50',
    border: '#283968',
    borderSubtle: '#1C2747',
    muted: '#92A2C8',
    mutedText: '#B3C1DF',
    ring: '#F4B942',
  },
  functional: functionalColors,
  typography: {
    fontSans: 'var(--font-inter, Inter), system-ui, sans-serif',
    fontHeading: 'var(--font-inter, Inter), sans-serif',
    fontMono: 'ui-monospace, monospace',
  },
  borderRadius: {
    button: '0.75rem',  // 12px - amigable
    card: '1.25rem',    // 20px
    badge: '9999px',
    input: '0.625rem',  // 10px
  },
};
