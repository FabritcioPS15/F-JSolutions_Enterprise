import type { ThemeDefinition } from '../types';
import { functionalColors } from '../core/colors';

export const legalTheme: ThemeDefinition = {
  id: 'sparktree-legal',
  name: 'SparkTree Legal',
  app: 'legal',
  personality: 'institucional, elegante, formal y confiable',
  palette: {
    primary: '#202C39',
    secondary: '#52677D',
    accent: '#C6A56B',
    accentLight: '#D9C8A5',
    background: '#F8F7F3',
    text: '#202C39',
    surface: '#FFFFFF',
    surfaceMuted: '#F1EFEA',
    border: '#DEDACF',
    borderSubtle: '#ECE9E1',
    muted: '#6F7E8E',
    mutedText: '#546374',
    ring: '#C6A56B',
  },
  dark: {
    primary: '#C6A56B',
    secondary: '#52677D',
    accent: '#D9C8A5',
    accentLight: '#2C3540',
    background: '#111821',
    text: '#F4F3EF',
    surface: '#1B2430',
    surfaceMuted: '#242F3E',
    border: '#324052',
    borderSubtle: '#222B38',
    muted: '#96A4B4',
    mutedText: '#B8C3CF',
    ring: '#C6A56B',
  },
  functional: functionalColors,
  typography: {
    fontSans: 'var(--font-inter, Inter), system-ui, sans-serif',
    fontHeading: 'var(--font-merriweather, "Merriweather"), serif',
    fontMono: 'ui-monospace, monospace',
  },
  borderRadius: {
    button: '0.375rem', // 6px - formal
    card: '0.625rem',   // 10px - sobrio
    badge: '0.25rem',   // 4px
    input: '0.375rem',  // 6px
  },
};
