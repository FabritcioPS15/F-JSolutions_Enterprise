export * from './group';
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
