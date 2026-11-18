const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'packages', 'design-tokens', 'src');
const coreDir = path.join(srcDir, 'core');

// 1. types.ts
const typesCode = `export interface PaletteTokens {
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
`;
fs.writeFileSync(path.join(srcDir, 'types.ts'), typesCode, 'utf8');

// 2. core/colors.ts
const colorsCode = `export const baseColors = {
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  current: 'currentColor',
} as const;

export const functionalColors = {
  success: '#10B981',
  successLight: '#D1FAE5',
  successText: '#065F46',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningText: '#92400E',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  errorText: '#991B1B',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  infoText: '#1E40AF',
} as const;

export const slate = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
  950: '#020617',
} as const;

export const gray = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
  950: '#030712',
} as const;
`;
fs.writeFileSync(path.join(coreDir, 'colors.ts'), colorsCode, 'utf8');

// 3. core/typography.ts
const typoCode = `export const fontFamilies = {
  sans: 'var(--font-inter, Inter), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  heading: 'var(--font-space-grotesk, "Space Grotesk"), var(--font-inter, Inter), sans-serif',
  fira: 'var(--font-fira-sans, "Fira Sans"), sans-serif',
  mono: 'ui-monospace, "Cascadia Code", "Segoe UI Mono", "SFMono-Regular", Menlo, Monaco, Consolas, monospace',
} as const;

export const fontSizes = {
  '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  '5xl': ['3rem', { lineHeight: '1.15' }],
  '6xl': ['3.75rem', { lineHeight: '1.1' }],
  '7xl': ['4.5rem', { lineHeight: '1.05' }],
} as const;

export const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;
`;
fs.writeFileSync(path.join(coreDir, 'typography.ts'), typoCode, 'utf8');

// 4. core/spacing.ts
const spacingCode = `export const spacing = {
  0: '0px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
} as const;
`;
fs.writeFileSync(path.join(coreDir, 'spacing.ts'), spacingCode, 'utf8');

// 5. core/shadows.ts
const shadowsCode = `export const shadows = {
  none: 'none',
  '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
} as const;
`;
fs.writeFileSync(path.join(coreDir, 'shadows.ts'), shadowsCode, 'utf8');

// 6. core/radii.ts
const radiiCode = `export const radii = {
  none: '0px',
  xs: '0.125rem', // 2px
  sm: '0.25rem',  // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem',   // 8px
  xl: '0.75rem',  // 12px
  '2xl': '1rem',  // 16px
  '3xl': '1.5rem',// 24px
  full: '9999px',
} as const;
`;
fs.writeFileSync(path.join(coreDir, 'radii.ts'), radiiCode, 'utf8');

// 7. core/breakpoints.ts
const breakpointsCode = `export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
`;
fs.writeFileSync(path.join(coreDir, 'breakpoints.ts'), breakpointsCode, 'utf8');

// 8. core/index.ts
const coreIndexCode = `export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './radii';
export * from './breakpoints';
`;
fs.writeFileSync(path.join(coreDir, 'index.ts'), coreIndexCode, 'utf8');

console.log('Core design tokens generated successfully');
