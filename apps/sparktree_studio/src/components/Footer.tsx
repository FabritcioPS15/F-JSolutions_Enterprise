'use client';

import { useEffect, useState } from 'react';
import { FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa6';

interface FooterProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isExiting?: boolean;
}

export default function Footer({ onNavigate, currentPage, isExiting = false }: FooterProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 240);
    };

    // Observer for reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.1 });

    const revealElements = document.querySelectorAll('.footer-reveal');
    revealElements.forEach((el) => observer.observe(el));

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  const mainLinks = [
    { id: 'home', label: 'Inicio' },
    { id: 'nosotros', label: 'Nosotros' },
    { id: 'services', label: 'Servicios' },
    { id: 'portfolio', label: 'Portafolio' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contacto' },
  ];

  const socialLinks = [
    { label: 'Instagram', href: 'https://instagram.com', Icon: FaInstagram },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/sparktree-studio-marketing-digital', Icon: FaLinkedin },
    { label: 'Tiktok', href: 'https://tiktok.com', Icon: FaTiktok },
  ];

  const legalLinks = [
    { id: 'privacy', label: 'Política de privacidad' },
    { id: 'terms', label: 'Términos de servicio' },
  ];

  const servicesLinks = [
    { id: 'service-web', label: 'Diseño de paginas web' },
    { id: 'service-seo', label: 'Posicionamiento SEO' },
    { id: 'service-branding', label: 'Branding' },
    { id: 'service-ti', label: 'Servicio TI' },
    { id: 'service-automation', label: 'Automatización ( N8N + Flujos)' },
    { id: 'service-bots', label: 'SparkBots ( IA + Flujos )' },
    { id: 'service-content', label: 'Marketing de contenido' },
  ];

  const isActive = (id: string) => {
    if (!currentPage) return false;
    if (currentPage === id) return true;

    // Main sections and their sub-items
    if (id === 'services' && (currentPage.startsWith('service-') || currentPage === 'services')) return true;
    if (id === 'portfolio' && (currentPage.startsWith('portfolio') || currentPage === 'project-detail')) return true;
    if (id === 'blog' && (currentPage.startsWith('blog') || currentPage === 'blog-post')) return true;

    return false;
  };

  return (
    <footer className={`relative overflow-hidden bg-black text-white rounded-t-[90px] mt-auto component-exit ${isExiting ? 'exiting' : ''}`}>
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#41f0a5]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-12 mb-12 items-center lg:items-start text-center lg:text-left">
          {/* Column 1: Logo */}
          <div className="footer-reveal reveal space-y-6 w-full lg:w-auto flex flex-col items-center lg:items-start">
            <button
              onClick={() => onNavigate('home')}
              className="group relative flex items-center transition-transform duration-500 hover:scale-105"
            >
              {/* White Logo Base */}
              <img
                src="/assets/sparktree-horizontal.png"
                alt="SparkTree Logo"
                className="h-16 lg:h-20 w-auto object-contain brightness-110"
              />
              {/* Liquid Tint Overlay (Preserves Logo Details & Anti-aliasing) */}
              <div 
                className="absolute inset-0 mix-blend-multiply pointer-events-none overflow-hidden"
                style={{
                  WebkitMaskImage: `url('/assets/sparktree-horizontal.png')`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: `url('/assets/sparktree-horizontal.png')`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                }}
              >
                {/* Wavy liquid wrapper */}
                <div className="absolute left-1/2 top-full w-[200%] aspect-square -translate-x-1/2 translate-y-2 group-hover:-translate-y-[60%] transition-transform duration-1000 ease-in-out">
                  {/* Spinning blob to create waves */}
                  <div className="w-full h-full bg-[#41f0a5] rounded-[45%] animate-[spin_5s_linear_infinite]" />
                </div>
              </div>
            </button>
            <p className="hidden lg:block text-gray-400 text-sm max-w-xs leading-relaxed">
              Impulsando el crecimiento digital de tu empresa con soluciones innovadoras y personalizadas.
            </p>
          </div>

          {/* Column 2: Menú (Hidden on Mobile) */}
          <div className="hidden lg:block footer-reveal reveal space-y-6 lg:pl-12">
            <h3 className="text-lg font-bold text-white tracking-wider uppercase">Menú</h3>
            <div className="flex flex-col space-y-3">
              {mainLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`text-left text-gray-400 transition-all duration-300 hover:text-[#0ea5e9] hover:translate-x-1 relative ${isActive(link.id) ? 'font-bold text-[#0ea5e9]' : ''}`}>
                  {isActive(link.id) && (
                    <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#0ea5e9] rounded-full shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                  )}
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Servicios (Hidden on Mobile) */}
          <div className="hidden lg:block footer-reveal reveal space-y-6">
            <h3 className="text-lg font-bold text-white tracking-wider uppercase">Servicios</h3>
            <div className="flex flex-col space-y-3">
              {servicesLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`group relative flex items-center text-left text-gray-400 transition-all duration-300 hover:text-[#0ea5e9] hover:translate-x-1 ${isActive(link.id) ? 'font-bold text-[#0ea5e9]' : ''}`}>
                  {isActive(link.id) && (
                    <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#0ea5e9] rounded-full shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                  )}
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column 4: Redes */}
          <div className="footer-reveal reveal space-y-4 w-full lg:w-auto">
            <h3 className="hidden lg:block text-lg font-bold text-white tracking-wider uppercase">Conectemos</h3>
            <div className="flex flex-row lg:flex-col items-center justify-center lg:items-start lg:justify-start gap-2 lg:space-y-1">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 transition-all duration-300 hover:text-[#41f0a5] group">
                  <span className="p-2.5 lg:p-3 rounded-xl bg-white/5 group-hover:bg-[#41f0a5]/10 group-hover:scale-110 transition-all shadow-lg">
                    <link.Icon size={22} />
                  </span>
                  <span className="hidden lg:inline">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-reveal reveal w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-8 lg:my-12" />

        <div className="footer-reveal reveal flex flex-col lg:flex-row justify-between items-center gap-6 text-sm text-gray-400">
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-6">
            {legalLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="transition-colors duration-300 hover:text-white underline-offset-4 hover:underline">
                {link.label}
              </button>
            ))}
          </div>
          <p className="text-center lg:text-right">&copy; {new Date().getFullYear()} SparkTree. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* Floating Back-to-top button */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${showBackToTop ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-white text-black rounded-full p-4 shadow-2xl hover:bg-[#41f0a5] hover:text-black hover:scale-110 transition-all duration-300 group"
          aria-label="Volver arriba"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  );
}
