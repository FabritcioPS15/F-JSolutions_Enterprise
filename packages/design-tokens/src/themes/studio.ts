import type { ThemeDefinition } from '../types';
import { functionalColors } from '../core/colors';

export const studioTheme: ThemeDefinition = {
  id: 'sparktree-studio',
  name: 'SparkTree Studio',
  app: 'studio',
  personality: 'creativa, fresca, moderna y digital',
  palette: {
    primary: '#0A0A0A',
    secondary: '#171717',
    accent: '#41F0A5',
    accentLight: '#A7FAD6',
    background: '#FFFFFF',
    text: '#111827',
    surface: '#FFFFFF',
    surfaceMuted: '#F4F5F7',
    border: '#E5E7EB',
    borderSubtle: '#F3F4F6',
    muted: '#6B7280',
    mutedText: '#4B5563',
    ring: '#41F0A5',
  },
  dark: {
    primary: '#41F0A5',
    secondary: '#0EA161',
    accent: '#41F0A5',
    accentLight: '#112F22',
    background: '#07090E',
    text: '#F9FAFB',
    surface: '#0F131D',
    surfaceMuted: '#171E2D',
    border: '#1F2937',
    borderSubtle: '#161D29',
    muted: '#9CA3AF',
    mutedText: '#D1D5DB',
    ring: '#41F0A5',
  },
  functional: functionalColors,
  typography: {
    fontSans: 'var(--font-fira-sans, "Fira Sans"), system-ui, sans-serif',
    fontHeading: 'var(--font-fira-sans, "Fira Sans"), sans-serif',
    fontMono: 'ui-monospace, monospace',
  },
  borderRadius: {
    button: '0.75rem',  // 12px
    card: '1.25rem',    // 20px
    badge: '9999px',
    input: '0.75rem',   // 12px
  },
};
