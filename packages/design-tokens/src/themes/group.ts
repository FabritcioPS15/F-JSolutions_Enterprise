import type { ThemeDefinition } from '../types';
import { functionalColors } from '../core/colors';

export const groupTheme: ThemeDefinition = {
  id: 'sparktree-group',
  name: 'SparkTree Group',
  app: 'group',
  personality: 'corporativa, elegante, natural, sólida y empresarial',
  palette: {
    primary: '#123B2A',
    secondary: '#205B40',
    accent: '#3C8060',
    accentLight: '#A5C9AE',
    background: '#F3F7F2',
    text: '#18372A',
    surface: '#FFFFFF',
    surfaceMuted: '#E7EFE6',
    border: '#D0DEC7',
    borderSubtle: '#E2EBE0',
    muted: '#5A7568',
    mutedText: '#4A6357',
    ring: '#205B40',
  },
  dark: {
    primary: '#3C8060',
    secondary: '#205B40',
    accent: '#A5C9AE',
    accentLight: '#123B2A',
    background: '#0B1E15',
    text: '#E8F2EC',
    surface: '#112A1F',
    surfaceMuted: '#173628',
    border: '#1F4735',
    borderSubtle: '#163325',
    muted: '#8CAFA0',
    mutedText: '#A4C3B5',
    ring: '#3C8060',
  },
  functional: functionalColors,
  typography: {
    fontSans: 'var(--font-inter, Inter), system-ui, sans-serif',
    fontHeading: 'var(--font-space-grotesk, "Space Grotesk"), serif',
    fontMono: 'ui-monospace, monospace',
  },
  borderRadius: {
    button: '0.625rem', // 10px
    card: '1rem',       // 16px
    badge: '9999px',
    input: '0.5rem',    // 8px
  },
};
