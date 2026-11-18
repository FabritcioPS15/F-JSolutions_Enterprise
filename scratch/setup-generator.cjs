const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'packages', 'design-tokens', 'src');
const cssDir = path.join(srcDir, 'css');
const tailwindDir = path.join(srcDir, 'tailwind');

// 1. css/generator.ts
const generatorCode = `import type { ThemeDefinition, PaletteTokens } from '../types';

export function paletteToCSSVariables(palette: PaletteTokens, prefix = 'spark'): Record<string, string> {
  return {
    [\`--\${prefix}-primary\`]: palette.primary,
    [\`--\${prefix}-secondary\`]: palette.secondary,
    [\`--\${prefix}-accent\`]: palette.accent,
    [\`--\${prefix}-accent-light\`]: palette.accentLight,
    [\`--\${prefix}-background\`]: palette.background,
    [\`--\${prefix}-text\`]: palette.text,
    [\`--\${prefix}-surface\`]: palette.surface,
    [\`--\${prefix}-surface-muted\`]: palette.surfaceMuted,
    [\`--\${prefix}-border\`]: palette.border,
    [\`--\${prefix}-border-subtle\`]: palette.borderSubtle,
    [\`--\${prefix}-muted\`]: palette.muted,
    [\`--\${prefix}-muted-text\`]: palette.mutedText,
    [\`--\${prefix}-ring\`]: palette.ring,
  };
}

export function generateShadcnTokens(palette: PaletteTokens): Record<string, string> {
  return {
    '--background': palette.background,
    '--foreground': palette.text,
    '--card': palette.surface,
    '--card-foreground': palette.text,
    '--popover': palette.surface,
    '--popover-foreground': palette.text,
    '--primary': palette.primary,
    '--primary-foreground': '#FFFFFF',
    '--secondary': palette.secondary,
    '--secondary-foreground': '#FFFFFF',
    '--muted': palette.surfaceMuted,
    '--muted-foreground': palette.mutedText,
    '--accent': palette.accent,
    '--accent-foreground': '#FFFFFF',
    '--border': palette.border,
    '--input': palette.border,
    '--ring': palette.ring,
  };
}

export function generateThemeCSS(theme: ThemeDefinition): string {
  const lightVars = {
    ...paletteToCSSVariables(theme.palette),
    ...generateShadcnTokens(theme.palette),
    '--font-sans': theme.typography.fontSans,
    '--font-heading': theme.typography.fontHeading,
    '--font-mono': theme.typography.fontMono,
    '--radius-button': theme.borderRadius.button,
    '--radius-card': theme.borderRadius.card,
    '--radius-badge': theme.borderRadius.badge,
    '--radius-input': theme.borderRadius.input,
  };

  const darkVars = {
    ...paletteToCSSVariables(theme.dark),
    ...generateShadcnTokens(theme.dark),
  };

  const lightEntries = Object.entries(lightVars)
    .map(([k, v]) => \`  \${k}: \${v};\`)
    .join('\\n');

  const darkEntries = Object.entries(darkVars)
    .map(([k, v]) => \`  \${k}: \${v};\`)
    .join('\\n');

  return \`/* ==============================================================
   SparkTree Design System — \${theme.name} Theme
   Personalidad: \${theme.personality}
   ============================================================== */

:root {
  color-scheme: light;
\${lightEntries}
}

.dark {
  color-scheme: dark;
\${darkEntries}
}
\`;
}
`;
fs.writeFileSync(path.join(cssDir, 'generator.ts'), generatorCode, 'utf8');

// 2. tailwind/preset.ts
const presetCode = `export const sparktreeTailwindColors = {
  'spark-primary': 'var(--spark-primary)',
  'spark-secondary': 'var(--spark-secondary)',
  'spark-accent': 'var(--spark-accent)',
  'spark-accent-light': 'var(--spark-accent-light)',
  'spark-bg': 'var(--spark-background)',
  'spark-text': 'var(--spark-text)',
  'spark-surface': 'var(--spark-surface)',
  'spark-surface-muted': 'var(--spark-surface-muted)',
  'spark-border': 'var(--spark-border)',
  'spark-border-subtle': 'var(--spark-border-subtle)',
  'spark-muted': 'var(--spark-muted)',
  'spark-muted-text': 'var(--spark-muted-text)',
  'spark-ring': 'var(--spark-ring)',
};

export const sparktreeTailwindPreset = {
  theme: {
    extend: {
      colors: sparktreeTailwindColors,
      borderRadius: {
        'spark-btn': 'var(--radius-button)',
        'spark-card': 'var(--radius-card)',
        'spark-badge': 'var(--radius-badge)',
        'spark-input': 'var(--radius-input)',
      },
    },
  },
};
`;
fs.writeFileSync(path.join(tailwindDir, 'preset.ts'), presetCode, 'utf8');

// 3. index.ts
const indexCode = `export * from './types';
export * from './core';
export * from './themes';
export * from './css/generator';
export * from './tailwind/preset';
`;
fs.writeFileSync(path.join(srcDir, 'index.ts'), indexCode, 'utf8');

console.log('generator.ts, preset.ts, index.ts created');
