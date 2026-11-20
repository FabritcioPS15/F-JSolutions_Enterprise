'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactLenis } from 'lenis/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import FloatingQuoteBar from '@/components/ui/FloatingQuoteBar';
import CustomLoader from '@/components/common/CustomLoader';
import { NavContext, resolveRoute, getCurrentPageId } from './navigation-context';

export function StudioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      ['/', '/services', '/portfolio', '/blog', '/nosotros', '/contact'].forEach((route) =>
        router.prefetch(route),
      );
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  const currentPage = getCurrentPageId(pathname);

  const handleNavigate = (page: string) => {
    if (isExiting) return;
    const target = resolveRoute(page);
    setIsExiting(true);

    setTimeout(() => {
      router.push(target);
      setIsExiting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 180);
  };

  return (
    <NavContext.Provider value={{ currentPage, onNavigate: handleNavigate, isExiting }}>
      <ReactLenis root>
        {isLoading && <CustomLoader />}
        <div
          className={`min-h-screen bg-white transition-opacity duration-700 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Header
            currentPage={currentPage}
            onNavigate={handleNavigate}
            isExiting={isExiting}
          />
          <main className={`page-exit ${isExiting ? 'exiting' : ''}`}>
            {children}
          </main>
          <Footer
            onNavigate={handleNavigate}
            currentPage={currentPage}
            isExiting={isExiting}
          />
          <CookieConsent onNavigate={handleNavigate} />
          <FloatingQuoteBar onNavigate={handleNavigate} />
        </div>
      </ReactLenis>
    </NavContext.Provider>
  );
}
