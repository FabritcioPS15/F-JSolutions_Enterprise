'use client';

import React, { createContext, useContext } from 'react';

export const routeMap: Record<string, string> = {
  home: '/',
  blog: '/blog',
  portfolio: '/portfolio',
  services: '/services',
  'service-web': '/services/web',
  'service-seo': '/services/seo',
  'service-branding': '/services/branding',
  'service-ti': '/services/ti',
  'service-automation': '/services/automation',
  'service-bots': '/services/bots',
  'service-content': '/services/content',
  'service-apps': '/services/apps',
  'service-consulting': '/services/consulting',
  privacy: '/privacy',
  terms: '/privacy',
  nosotros: '/nosotros',
  contact: '/contact',
  'admin-portfolio': '/admin/portfolio',
};

export function resolveRoute(page: string): string {
  if (routeMap[page]) return routeMap[page];
  if (page.startsWith('/')) return page;
  return '/' + page;
}

export function getCurrentPageId(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname === '/blog') return 'blog';
  if (pathname === '/portfolio') return 'portfolio';
  if (pathname === '/services') return 'services';
  if (pathname === '/services/web') return 'service-web';
  if (pathname === '/services/seo') return 'service-seo';
  if (pathname === '/services/branding') return 'service-branding';
  if (pathname === '/services/ti') return 'service-ti';
  if (pathname === '/services/bots') return 'service-bots';
  if (pathname === '/services/automation') return 'service-automation';
  if (pathname === '/services/content') return 'service-content';
  if (pathname === '/services/apps') return 'service-apps';
  if (pathname === '/services/consulting') return 'service-consulting';
  if (pathname === '/privacy') return 'privacy';
  if (pathname === '/nosotros') return 'nosotros';
  if (pathname === '/contact') return 'contact';
  if (pathname.startsWith('/blog/')) return 'blog-post';
  if (pathname.startsWith('/portfolio/')) return 'project-detail';
  if (pathname === '/admin/portfolio' || pathname === '/PortfolioEditor') return 'admin-portfolio';
  return '';
}

export interface NavContextType {
  currentPage: string;
  onNavigate: (page: string) => void;
  isExiting: boolean;
}

export const NavContext = createContext<NavContextType>({
  currentPage: 'home',
  onNavigate: () => {},
  isExiting: false,
});

export const useStudioNav = () => useContext(NavContext);
