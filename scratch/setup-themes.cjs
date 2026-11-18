const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '..', 'packages', 'design-tokens', 'src', 'themes');

// 1. group.ts
const groupTheme = `import type { ThemeDefinition } from '../types';
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
`;
fs.writeFileSync(path.join(themesDir, 'group.ts'), groupTheme, 'utf8');

// 2. admin.ts
const adminTheme = `import type { ThemeDefinition } from '../types';
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
`;
fs.writeFileSync(path.join(themesDir, 'admin.ts'), adminTheme, 'utf8');

// 3. systems.ts
const systemsTheme = `import type { ThemeDefinition } from '../types';
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
`;
fs.writeFileSync(path.join(themesDir, 'systems.ts'), systemsTheme, 'utf8');

// 4. studio.ts
const studioTheme = `import type { ThemeDefinition } from '../types';
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
`;
fs.writeFileSync(path.join(themesDir, 'studio.ts'), studioTheme, 'utf8');

// 5. store.ts
const storeTheme = `import type { ThemeDefinition } from '../types';
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
`;
fs.writeFileSync(path.join(themesDir, 'store.ts'), storeTheme, 'utf8');

// 6. legal.ts
const legalTheme = `import type { ThemeDefinition } from '../types';
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
`;
fs.writeFileSync(path.join(themesDir, 'legal.ts'), legalTheme, 'utf8');

// 7. academia.ts
const academiaTheme = `import type { ThemeDefinition } from '../types';
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
`;
fs.writeFileSync(path.join(themesDir, 'academia.ts'), academiaTheme, 'utf8');

// 8. index.ts
const themesIndex = `export * from './group';
export * from './admin';
export * from './systems';
export * from './studio';
export * from './store';
export * from './legal';
export * from './academia';

import { groupTheme } from './group';
import { adminTheme } from './admin';
import { systemsTheme } from './systems';
import { studioTheme } from './studio';
import { storeTheme } from './store';
import { legalTheme } from './legal';
import { academiaTheme } from './academia';
import type { ThemeDefinition } from '../types';

export const sparktreeThemes: Record<string, ThemeDefinition> = {
  group: groupTheme,
  admin: adminTheme,
  systems: systemsTheme,
  studio: studioTheme,
  store: storeTheme,
  legal: legalTheme,
  academia: academiaTheme,
};

export function getTheme(idOrApp: string): ThemeDefinition {
  const match = Object.values(sparktreeThemes).find(
    (t) => t.id === idOrApp || t.app === idOrApp
  );
  return match || systemsTheme;
}
`;
fs.writeFileSync(path.join(themesDir, 'index.ts'), themesIndex, 'utf8');

console.log('All 7 SparkTree themes generated successfully');
