import type { ThemeDefinition } from '../types';
import { functionalColors } from '../core/colors';

export const adminTheme: ThemeDefinition = {
  id: 'sparktree-admin',
  name: 'SparkTree Admin',
  app: 'admin',
  personality: 'tecnológica, profesional, organizada y moderna',
  palette: {
    primary: '#30265C',
    secondary: '#5946A6',
    accent: '#8876D9',
    accentLight: '#C5BDF2',
    background: '#F7F6FC',
    text: '#28233D',
    surface: '#FFFFFF',
    surfaceMuted: '#EFEBF8',
    border: '#DDD8F0',
    borderSubtle: '#ECE7F7',
    muted: '#71688C',
    mutedText: '#5E557A',
    ring: '#5946A6',
  },
  dark: {
    primary: '#8876D9',
    secondary: '#5946A6',
    accent: '#C5BDF2',
    accentLight: '#30265C',
    background: '#090D16',
    text: '#F1F0F7',
    surface: '#121424',
    surfaceMuted: '#191C30',
    border: '#2A2A44',
    borderSubtle: '#1E1E34',
    muted: '#9E94BC',
    mutedText: '#B8AFD4',
    ring: '#8876D9',
  },
  functional: functionalColors,
  typography: {
    fontSans: 'var(--font-inter, Inter), system-ui, sans-serif',
    fontHeading: 'var(--font-inter, Inter), sans-serif',
    fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  borderRadius: {
    button: '0.625rem', // 10px
    card: '0.875rem',   // 14px
    badge: '9999px',
    input: '0.5rem',    // 8px
  },
};
