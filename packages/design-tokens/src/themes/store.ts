import type { ThemeDefinition } from '../types';
import { functionalColors } from '../core/colors';

export const storeTheme: ThemeDefinition = {
  id: 'sparktree-store',
  name: 'SparkTree Store',
  app: 'store',
  personality: 'comercial, moderna, confiable y orientada a conversión',
  palette: {
    primary: '#172554',
    secondary: '#2563EB',
    accent: '#F59E0B',
    accentLight: '#93C5FD',
    background: '#F8FAFC',
    text: '#172033',
    surface: '#FFFFFF',
    surfaceMuted: '#EFF6FF',
    border: '#DBEAFE',
    borderSubtle: '#EDF4FE',
    muted: '#64748B',
    mutedText: '#475569',
    ring: '#2563EB',
  },
  dark: {
    primary: '#3B82F6',
    secondary: '#2563EB',
    accent: '#F59E0B',
    accentLight: '#1E3A8A',
    background: '#0B1220',
    text: '#F1F5F9',
    surface: '#131E33',
    surfaceMuted: '#1B2945',
    border: '#243555',
    borderSubtle: '#1A2740',
    muted: '#94A3B8',
    mutedText: '#CBD5E1',
    ring: '#3B82F6',
  },
  functional: functionalColors,
  typography: {
    fontSans: 'var(--font-inter, Inter), system-ui, sans-serif',
    fontHeading: 'var(--font-space-grotesk, "Space Grotesk"), sans-serif',
    fontMono: 'ui-monospace, "Cascadia Code", monospace',
  },
  borderRadius: {
    button: '0.625rem', // 10px
    card: '1rem',       // 16px
    badge: '0.375rem',  // 6px - comercial
    input: '0.5rem',    // 8px
  },
};
