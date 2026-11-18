export const fontFamilies = {
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
