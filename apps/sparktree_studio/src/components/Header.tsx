'use client';

import { FaWhatsapp, FaX, FaInstagram, FaLinkedin, FaTiktok, FaMagnifyingGlass } from 'react-icons/fa6';
import { CgMenuRight } from 'react-icons/cg';
import { Home as HomeIcon, Wrench, Folder, FileText, Briefcase, Newspaper } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Project } from '@/data/projects';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import AnimatedButton from './ui/AnimatedButton';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isExiting?: boolean;
}

export default function Header({ currentPage, onNavigate, isExiting = false }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // Removed sliding indicator; keeping minimal state
  const desktopNavRef = useRef<HTMLDivElement | null>(null);
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement | null>(null);
  const desktopInputRef = useRef<HTMLInputElement | null>(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const servicesDropdownSourceRef = useRef<'hover' | 'click' | null>(null);
  const servicesHoverOpenTimerRef = useRef<number | null>(null);
  const servicesHoverCloseTimerRef = useRef<number | null>(null);

  const clearServicesHoverTimers = useCallback(() => {
    if (servicesHoverOpenTimerRef.current !== null) {
      window.clearTimeout(servicesHoverOpenTimerRef.current);
      servicesHoverOpenTimerRef.current = null;
    }
    if (servicesHoverCloseTimerRef.current !== null) {
      window.clearTimeout(servicesHoverCloseTimerRef.current);
      servicesHoverCloseTimerRef.current = null;
    }
  }, []);

  const closeServicesDropdown = useCallback(() => {
    clearServicesHoverTimers();
    servicesDropdownSourceRef.current = null;
    setIsServicesDropdownOpen(false);
  }, [clearServicesHoverTimers]);

  useEffect(() => () => clearServicesHoverTimers(), [clearServicesHoverTimers]);

  useEffect(() => {
    if (!isServicesDropdownOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeServicesDropdown();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isServicesDropdownOpen, closeServicesDropdown]);

  useEffect(() => {
    async function fetchProjectsForSearch() {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, client, category, services')
          .eq('isVisible', true);

        if (error) {
          console.warn('Could not fetch search projects:', error.message || error);
        } else if (data) {
          setDbProjects(data as Project[]);
        }
      } catch (err) {
        console.warn('Network error fetching search projects:', err);
      }
    }
    fetchProjectsForSearch();
  }, []);

  const projectEntries = dbProjects.map((p) => ({
    label: p.title,
    type: 'Proyecto',
    href: `/portfolio/${p.id}`,
    keywords: `${p.client} ${p.category} ${(p.services ?? []).join(' ')} ${p.title}`
  }));

  const TypeIcon = ({ type }: { type: string }) => {
    const common = { size: 18, strokeWidth: 2.25 } as const;
    const icon = (() => {
      switch (type) {
        case 'Página':
          return <HomeIcon {...common} className="text-white" />;
        case 'Servicio':
          return <Wrench {...common} className="text-white" />;
        case 'Categoría':
          return <Folder {...common} className="text-white" />;
        case 'Artículo':
          return <Newspaper {...common} className="text-white" />;
        case 'Proyecto':
          return <Briefcase {...common} className="text-white" />;
        default:
          return <FileText {...common} className="text-white" />;
      }
    })();
    return <span className="inline-flex items-center justify-center w-5 h-5">{icon}</span>;
  };

  // Simple site-wide index (pages, services, categories, posts)
  const searchIndex = [
    // Pages
    { label: 'Inicio', type: 'Página', href: 'home', keywords: 'inicio home principal sparktree' },
    { label: 'Nosotros', type: 'Página', href: 'nosotros', keywords: 'nosotros agencia sobre nosotros hub empresarial equipo' },
    { label: 'Servicios', type: 'Página', href: 'services', keywords: 'servicios' },
    { label: 'Portafolio', type: 'Página', href: 'portfolio', keywords: 'portafolio proyectos trabajos' },
    { label: 'Blog', type: 'Página', href: 'blog', keywords: 'blog artículos' },
    { label: 'Contacto', type: 'Página', href: 'contact', keywords: 'contacto consulta whatsapp email' },
    // Services
    { label: 'Diseño de paginas web', type: 'Servicio', href: 'service-web', keywords: 'web diseño paginas sitio' },
    { label: 'Posicionamiento SEO', type: 'Servicio', href: 'service-seo', keywords: 'seo posicionamiento google' },
    { label: 'Branding', type: 'Servicio', href: 'service-branding', keywords: 'branding identidad marca' },
    { label: 'Servicio TI', type: 'Servicio', href: 'service-ti', keywords: 'ti tecnologia tecnología soporte sistemas infraestructura' },
    { label: 'Automatización ( N8N + Flujos)', type: 'Servicio', href: 'service-automation', keywords: 'automatizacion n8n flujos procesos' },
    { label: 'SparkBots ( IA + Flujos )', type: 'Servicio', href: 'service-bots', keywords: 'ia bot sparkbots inteligencia artificial automatizacion' },
    { label: 'Marketing de contenido', type: 'Servicio', href: 'service-content', keywords: 'marketing contenido redes' },
    // Blog categories (navigate to blog)
    { label: 'Marketing', type: 'Categoría', href: 'blog', keywords: 'marketing' },
    { label: 'SEO', type: 'Categoría', href: 'blog', keywords: 'seo' },
    { label: 'E-commerce', type: 'Categoría', href: 'blog', keywords: 'ecommerce e-commerce' },
    { label: 'Redes Sociales', type: 'Categoría', href: 'blog', keywords: 'redes sociales social' },
    { label: 'Tecnología', type: 'Categoría', href: 'blog', keywords: 'tecnologia tecnología' },
    { label: 'Conversión', type: 'Categoría', href: 'blog', keywords: 'conversion conversión optimizacion optimización' },
    // Blog posts (recientes del listado) -> rutas directas
    { label: 'Tendencias de Marketing Digital 2025', type: 'Artículo', href: '/blog/tendencias-marketing-digital-2025', keywords: 'marketing digital tendencias 2025' },
    { label: '¿Cuales son las redes que más utilizan los E-commerce?', type: 'Artículo', href: '/blog/redes-sociales-ecommerce', keywords: 'ecommerce redes sociales' },
    { label: 'Cómo aumentar la tasa de conversión de tu sitio web', type: 'Artículo', href: '/blog/aumentar-tasa-conversion', keywords: 'conversion optimizacion' },
    { label: 'Posicionamiento SEO: El motor del crecimiento online', type: 'Artículo', href: '/blog/posicionamiento-seo-crecimiento', keywords: 'seo crecimiento' },
    { label: 'Estrategias de contenido para redes sociales', type: 'Artículo', href: '/blog/estrategias-contenido-redes-sociales', keywords: 'contenido redes sociales' },
    { label: 'Inteligencia Artificial en el Marketing Digital', type: 'Artículo', href: '/blog/ia-marketing-digital', keywords: 'ia inteligencia artificial' },
  ].concat(projectEntries);

  const queryTokens = searchQuery
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const filteredResults = queryTokens.length === 0
    ? []
    : searchIndex
      .map((item) => {
        const haystack = `${item.label} ${item.type} ${item.keywords}`.toLowerCase();
        const matchesAll = queryTokens.every((t) => haystack.includes(t));
        let score = 0;
        if (matchesAll) {
          queryTokens.forEach((t) => {
            if (item.label.toLowerCase().startsWith(t)) score += 3;
            if (item.label.toLowerCase().includes(t)) score += 2;
            if (item.keywords.toLowerCase().includes(t)) score += 1;
          });
        }
        return { item, matchesAll, score };
      })
      .filter((r) => r.matchesAll)
      .sort((a, b) => b.score - a.score)
      .slice(0, 7)
      .map((r) => r.item);

  const highlight = (text: string) => {
    if (queryTokens.length === 0) return text;
    const escaped = queryTokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const re = new RegExp(`(${escaped.join('|')})`, 'ig');
    const parts = text.split(re);
    return parts.map((part, i) =>
      re.test(part) ? (
        <mark key={i} className="bg-yellow-100 text-gray-900 px-0.5 rounded-sm">{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const threshold = currentPage === 'home' ? Math.max(0, window.innerHeight - 80) : 20;
      setIsScrolled(scrollTop > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    setIsMounted(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  // Determinar si los navItems deben ser blancos o negros
  const isHomeTop = currentPage === 'home' && !isScrolled;
  const isOtherTop = currentPage !== 'home' && !isScrolled;
  const shouldNavItemsBeWhite = isHomeTop || isScrolled;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.services-dropdown') && !target.closest('[data-nav-item="services"]')) {
        closeServicesDropdown();
      }
    };

    if (isServicesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isServicesDropdownOpen, closeServicesDropdown]);

  // Close search when clicking outside
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isSearchOpen]);

  // Close mobile search panel when clicking outside
  useEffect(() => {
    if (!isMobileSearchOpen) return;
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(target)) {
        setIsMobileSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isMobileSearchOpen]);

  // Autofocus desktop input when opening search
  useEffect(() => {
    if (isSearchOpen) {
      desktopInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  // Sliding indicator removed for a minimal style
  // Animated sliding indicator for active desktop nav link
  useEffect(() => {
    const navRoot = desktopNavRef.current;
    if (!navRoot) return;

    const compute = () => {
      const activeId = currentPage.startsWith('service-') ? 'services' : currentPage;
      const activeEl = navRoot.querySelector(`[data-nav-item="${activeId}"]`) as HTMLElement | null;
      if (!activeEl) {
        setIndicatorVisible(false);
        return;
      }
      const navRect = navRoot.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      const left = elRect.left - navRect.left + 4; // slight inset from container
      const width = Math.max(0, elRect.width - 8); // inset on both sides
      setIndicatorLeft(left);
      setIndicatorWidth(width);
      setIndicatorVisible(true);
    };

    compute();
    const onResize = () => compute();
    window.addEventListener('resize', onResize);
    const rId = window.requestAnimationFrame(compute);
    return () => {
      window.removeEventListener('resize', onResize);
      window.cancelAnimationFrame(rId);
    };
  }, [currentPage, isServicesDropdownOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('menu-open');
    };
  }, [isMobileMenuOpen]);

  // Set --app-vh to handle mobile viewport height reliably (responsive to URL bar)
  useEffect(() => {
    const setVh = () => {
      // Use dynamic viewport height if available, or visualViewport as fallback
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--app-vh', `${vh}px`);
    };
    setVh();
    const onResize = () => setVh();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onResize);
    }
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onResize);
      }
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'nosotros', label: 'Nosotros' },
    { id: 'services', label: 'Servicios', hasDropdown: true },
    { id: 'portfolio', label: 'Portafolio' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contacto' },
  ];

  const servicesItems = [
    { id: 'service-web', label: 'Diseño de paginas web', description: 'Sitios web que convierten' },
    { id: 'service-seo', label: 'Posicionamiento SEO', description: 'Aparece en Google' },
    { id: 'service-branding', label: 'Branding', description: 'Identidad de marca' },
    { id: 'service-ti', label: 'Servicio TI', description: 'Soluciones tecnológicas' },
    { id: 'service-automation', label: 'Automatización ( N8N + Flujos)', description: 'Optimiza tus procesos' },
    { id: 'service-bots', label: 'SparkBots ( IA + Flujos )', description: 'Automatización inteligente' },
    { id: 'service-content', label: 'Marketing de contenido', description: 'Conecta con tu audiencia' },
  ];

  const openServicesDropdownOnHover = () => {
    clearServicesHoverTimers();
    if (isServicesDropdownOpen && servicesDropdownSourceRef.current !== null) return;

    servicesHoverOpenTimerRef.current = window.setTimeout(() => {
      servicesHoverOpenTimerRef.current = null;
      servicesDropdownSourceRef.current = 'hover';
      setIsServicesDropdownOpen(true);
    }, 120);
  };

  const closeServicesDropdownOnHover = () => {
    clearServicesHoverTimers();
    if (servicesDropdownSourceRef.current !== 'hover') return;

    servicesHoverCloseTimerRef.current = window.setTimeout(() => {
      servicesHoverCloseTimerRef.current = null;
      const activeElement = document.activeElement;
      if (activeElement instanceof Element && activeElement.closest('[data-nav-item="services"]')) return;

      servicesDropdownSourceRef.current = null;
      setIsServicesDropdownOpen(false);
    }, 180);
  };

  const toggleServicesDropdown = () => {
    clearServicesHoverTimers();
    const next = !isServicesDropdownOpen;
    servicesDropdownSourceRef.current = next ? 'click' : null;
    setIsServicesDropdownOpen(next);
  };

  const handleServicesClick = () => {
    clearServicesHoverTimers();
    if (isServicesDropdownOpen && servicesDropdownSourceRef.current === 'hover') {
      servicesDropdownSourceRef.current = 'click';
      return;
    }

    const next = !isServicesDropdownOpen;
    servicesDropdownSourceRef.current = next ? 'click' : null;
    setIsServicesDropdownOpen(next);
  };

  const handleNavClick = (pageId: string) => {
    console.log('Header: Navigating to:', pageId); // Debug log
    onNavigate(pageId);
    setIsMobileMenuOpen(false);
    closeServicesDropdown();
  };

  const handleServicesMainClick = () => {
    // Navegar a la página de servicios y cerrar el dropdown
    onNavigate('services');
    closeServicesDropdown();
    setIsMobileMenuOpen(false);
  };

  const handleServiceClick = (serviceId: string) => {
    onNavigate(serviceId);
    closeServicesDropdown();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isExiting ? 'exiting' : ''
      } ${isHomeTop
        ? 'bg-transparent py-2 sm:py-3 border-b border-transparent'
        : isOtherTop
          ? 'bg-white py-2 sm:py-2 border-b border-gray-100 shadow-sm'
          : 'bg-black/70 backdrop-blur-xl shadow-2xl py-1 border-b border-white/10'
      } ${isMounted ? 'animate-slide-in-top' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-14">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className={`shrink-0 transition-transform duration-300 hover:scale-105 ${isMounted ? 'animate-slide-in-top entrance-stagger-1' : 'opacity-0'}`}
          >
            <img
              src={shouldNavItemsBeWhite ? '/assets/Logotipo_SparkTree_Studio-degradado-blanco.png' : '/assets/Logotipo_SparkTree_Studio-degradado.png'}
              alt="SparkTree Studio"
              className={`h-14 lg:h-12 xl:h-16 w-auto object-contain transition-all duration-300 ${isHomeTop ? 'brightness-0 invert' : ''}`}
            />
          </button>

          {/* Desktop Navigation LA BARRA DEL MENÚ :V PARA MOVER LA POSICION CON ML PS*/}
          <nav ref={desktopNavRef} className="hidden lg:flex items-center gap-2 relative px-1 py-0.5 ml-4 lg:ml-6 xl:ml-32">
            {/* Animated active indicator */}
            <span
              className={`absolute bottom-1 h-[3px] rounded-full transition-all duration-300 ease-out bg-[#41f0a5] shadow-[0_0_10px_rgba(65,240,165,0.8)] ${indicatorVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ left: indicatorLeft, width: indicatorWidth }}
              aria-hidden
            />
            {navItems.map((item, idx) => (
              <div
                key={item.id}
                className={`relative ${isMounted ? `animate-slide-in-top entrance-stagger-${idx + 2}` : 'opacity-0'}`}
                data-nav-item={item.id}
                onPointerEnter={item.hasDropdown ? (event) => {
                  if (event.pointerType === 'mouse') openServicesDropdownOnHover();
                } : undefined}
                onPointerLeave={item.hasDropdown ? (event) => {
                  if (event.pointerType === 'mouse') closeServicesDropdownOnHover();
                } : undefined}
              >
                {item.hasDropdown ? (
                  <div className="flex items-center">
                    <button
                      onClick={handleServicesMainClick}
                      aria-current={(currentPage === item.id || currentPage.startsWith('service-')) ? 'page' : undefined}
                      className={`text-base font-medium tracking-tight transition-all duration-300 hover:scale-[1.05] hover:-translate-y-0.5 relative pl-3.5 pr-2 py-2 rounded-l-md ${shouldNavItemsBeWhite
                        ? 'text-white hover:text-[#41f0a5] hover:drop-shadow-[0_0_8px_rgba(65,240,165,0.5)]'
                        : 'text-gray-900 hover:text-[#0ea161]'
                        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300`}
                    >
                      {(currentPage === item.id || currentPage.startsWith('service-')) ? (
                        <span className={`${shouldNavItemsBeWhite ? 'text-[#41f0a5] drop-shadow-[0_0_8px_rgba(65,240,165,0.5)]' : 'text-[#0ea161]'}`}>{item.label}</span>
                      ) : (
                        item.label
                      )}
                    </button>
                    <button
                      onClick={handleServicesClick}
                      aria-label="Mostrar servicios"
                      aria-expanded={isServicesDropdownOpen}
                      aria-current={(currentPage === item.id || currentPage.startsWith('service-')) ? 'page' : undefined}
                      className={`text-base font-medium tracking-tight transition-all duration-300 hover:scale-[1.05] hover:-translate-y-0.5 relative -ml-1 pl-1 pr-2.5 py-2 rounded-r-md ${shouldNavItemsBeWhite
                        ? 'text-white hover:text-[#41f0a5] hover:drop-shadow-[0_0_8px_rgba(65,240,165,0.5)]'
                        : 'text-gray-900 hover:text-[#0ea161]'
                        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300`}
                    >
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''} ${(currentPage === item.id || currentPage.startsWith('service-'))
                          ? (shouldNavItemsBeWhite ? 'text-[#41f0a5] drop-shadow-[0_0_8px_rgba(65,240,165,0.5)]' : 'text-[#0ea161]')
                          : ''
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigate(item.id)}
                    aria-current={currentPage === item.id ? 'page' : undefined}
                    className={`text-base font-medium tracking-tight transition-all duration-300 hover:scale-[1.05] hover:-translate-y-0.5 relative px-3.5 py-2 rounded-md ${shouldNavItemsBeWhite
                      ? 'text-white hover:text-[#41f0a5] hover:drop-shadow-[0_0_8px_rgba(65,240,165,0.5)]'
                      : 'text-gray-900 hover:text-[#0ea161]'
                      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300`}
                  >
                    {currentPage === item.id ? (
                      <span className={`${shouldNavItemsBeWhite ? 'text-[#41f0a5] drop-shadow-[0_0_8px_rgba(65,240,165,0.5)]' : 'text-[#0ea161]'}`}>{item.label}</span>
                    ) : (
                      item.label
                    )}
                  </button>
                )}

                {/* Services Dropdown */}
                {item.hasDropdown && isServicesDropdownOpen && (
                  <div className="services-dropdown absolute top-full left-0 mt-2 w-[550px] bg-black/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-3 z-50 grid grid-cols-2 gap-2">
                    {servicesItems.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceClick(service.id)}
                        className={`group relative w-full text-left px-5 py-3 rounded-xl transition-all duration-300 hover:bg-[#41f0a5]/10 hover:translate-x-1.5 hover:scale-[1.02] ${currentPage === service.id ? 'bg-[#41f0a5]/10 border border-[#41f0a5]/20' : 'border border-transparent'
                          }`}
                      >
                        <div className="font-semibold text-white text-sm transition-colors group-hover:text-[#41f0a5]">{service.label}</div>
                        <div className="text-xs text-gray-400 mt-1 transition-colors group-hover:text-gray-200">{service.description}</div>
                        
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                          <svg className="w-5 h-5 text-[#41f0a5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3 relative">
            {/* Search (desktop) */}
            <div
              ref={searchRef}
              className={`hidden sm:flex items-center overflow-visible border ${isSearchOpen ? 'w-64 pl-2 pr-2.5' : 'w-10 px-2'} h-10 rounded-full transition-all duration-300 ease-out shadow-sm relative bg-white border-gray-200 ${isMounted ? 'animate-slide-in-top entrance-stagger-7' : 'opacity-0'}`}
            >
              <button
                type="button"
                aria-label="Buscar"
                onClick={() => setIsSearchOpen((v) => !v)}
                className="flex items-center justify-center w-6 h-6 text-gray-900 hover:text-black"
              >
                <FaMagnifyingGlass size={16} />
              </button>
              <input
                ref={desktopInputRef}
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsSearchOpen(false);
                  if (e.key === 'Enter' && filteredResults.length > 0) {
                    const first = filteredResults[0];
                    if (first.href === 'blog' && searchQuery.trim()) {
                      const qp = new URLSearchParams(window.location.search);
                      qp.set('q', searchQuery.trim());
                      window.history.replaceState(null, '', `?${qp.toString()}`);
                    } else {
                      const qp = new URLSearchParams(window.location.search);
                      qp.delete('q');
                      window.history.replaceState(null, '', qp.toString() ? `?${qp.toString()}` : window.location.pathname);
                    }
                    onNavigate(first.href);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }
                }}
                className={`outline-none bg-transparent text-sm text-gray-900 font-normal transition-all duration-300 ${isSearchOpen ? 'w-full pl-3' : 'w-0 pl-0'} placeholder:text-gray-400`}
              />
              {isSearchOpen && searchQuery.length > 0 && (
                <button
                  type="button"
                  aria-label="Limpiar búsqueda"
                  onClick={() => {
                    setSearchQuery('');
                    // mantener el foco en el input
                    setTimeout(() => desktopInputRef.current?.focus(), 0);
                  }}
                  className="ml-1 p-1 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                >
                  <FaX size={14} />
                </button>
              )}
              {/* Suggestions dropdown (desktop) */}
              {isSearchOpen && filteredResults.length > 0 && (
                <div className="absolute top-[110%] left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
                  <ul className="max-h-80 overflow-auto">
                    {filteredResults.map((item, idx) => (
                      <li key={idx}>
                        <button
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-3"
                          onClick={() => {
                            if (item.href === 'blog' && searchQuery.trim()) {
                              const qp = new URLSearchParams(window.location.search);
                              qp.set('q', searchQuery.trim());
                              window.history.replaceState(null, '', `?${qp.toString()}`);
                            } else {
                              const qp = new URLSearchParams(window.location.search);
                              qp.delete('q');
                              window.history.replaceState(null, '', qp.toString() ? `?${qp.toString()}` : window.location.pathname);
                            }
                            onNavigate(item.href);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <div className="text-gray-500"><TypeIcon type={item.type} /></div>
                            <span className="text-sm text-gray-900 truncate">{highlight(item.label)}</span>
                          </span>
                          <span className="text-[11px] text-gray-400 ml-3 shrink-0">{item.type}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {/* Mobile search trigger hidden here (moved next to menu) */}
            <button type="button" className="hidden" aria-hidden="true">
              <FaMagnifyingGlass size={18} />
            </button>
            {/* Desktop CTA */}
            <AnimatedButton
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:flex items-center gap-2 transition-all duration-300 ${isMounted ? 'animate-slide-in-top entrance-stagger-8' : 'opacity-0'}`}
              variant={shouldNavItemsBeWhite ? 'transparent-white' : 'default'}
            >
              <FaWhatsapp size={18} />
              <span className="whitespace-nowrap">
                {isSearchOpen ? 'Contactanos!' : 'Agenda tu consulta'}
              </span>
            </AnimatedButton>
          </div>

          {/* Mobile Actions: search + menu */}
          <div className="lg:hidden flex items-center gap-2 relative">
            {/* Mobile search trigger next to menu */}
            <button
              type="button"
              className={`p-2.5 hover:bg-gray-100 rounded-lg transition-colors duration-300 ${shouldNavItemsBeWhite
                ? 'text-white hover:text-white'
                : 'text-gray-700 hover:text-gray-900'
                }`}
              aria-label="Abrir búsqueda"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <FaMagnifyingGlass size={18} />
            </button>
            {/* Mobile search dropdown anchored below icon */}
            {isMobileSearchOpen && (
              <div
                ref={mobileSearchRef}
                className="absolute right-0 top-full mt-2 w-[92vw] max-w-sm bg-white border border-gray-100 rounded-2xl shadow-xl p-3 z-[120]"
              >
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 h-10">
                  <FaMagnifyingGlass className="text-gray-500" size={16} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setIsMobileSearchOpen(false);
                      if (e.key === 'Enter' && filteredResults.length > 0) {
                        const first = filteredResults[0];
                        if (first.href === 'blog' && searchQuery.trim()) {
                          const qp = new URLSearchParams(window.location.search);
                          qp.set('q', searchQuery.trim());
                          window.history.replaceState(null, '', `?${qp.toString()}`);
                        } else {
                          const qp = new URLSearchParams(window.location.search);
                          qp.delete('q');
                          window.history.replaceState(null, '', qp.toString() ? `?${qp.toString()}` : window.location.pathname);
                        }
                        onNavigate(first.href);
                        setIsMobileSearchOpen(false);
                        setSearchQuery('');
                      }
                    }}
                    className="flex-1 ml-2 outline-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400"
                  />
                  <button
                    aria-label="Cerrar"
                    className="ml-2 p-1.5 rounded-md hover:bg-gray-200 text-gray-400"
                    onClick={() => setIsMobileSearchOpen(false)}
                  >
                    <FaX size={14} />
                  </button>
                </div>
                <div className="mt-2 max-h-72 overflow-auto">
                  {searchQuery.trim().length === 0 ? (
                    <div className="px-2 py-3 text-sm text-gray-500">Empieza a escribir para ver resultados</div>
                  ) : filteredResults.length === 0 ? (
                    <div className="px-2 py-3 text-sm text-gray-500">No se encontraron resultados</div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {filteredResults.map((item, idx) => (
                        <li key={idx}>
                          <button
                            className="w-full text-left px-3 py-2.5 hover:bg-gray-50"
                            onClick={() => {
                              if (item.href === 'blog' && searchQuery.trim()) {
                                const qp = new URLSearchParams(window.location.search);
                                qp.set('q', searchQuery.trim());
                                window.history.replaceState(null, '', `?${qp.toString()}`);
                              } else {
                                const qp = new URLSearchParams(window.location.search);
                                qp.delete('q');
                                window.history.replaceState(null, '', qp.toString() ? `?${qp.toString()}` : window.location.pathname);
                              }
                              onNavigate(item.href);
                              setIsMobileSearchOpen(false);
                              setSearchQuery('');
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="text-gray-500"><TypeIcon type={item.type} /></div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{highlight(item.label)}</div>
                                <div className="text-xs text-gray-500">{item.type}</div>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2.5 hover:bg-gray-100 rounded-lg transition-colors duration-300 ${shouldNavItemsBeWhite
                ? 'text-white hover:text-white'
                : 'text-gray-700 hover:text-gray-900'
                }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaX size={22} /> : <CgMenuRight size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden fixed inset-0 z-[100] transition-all duration-300 ${isMobileMenuOpen
        ? 'opacity-100 pointer-events-auto'
        : 'opacity-0 pointer-events-none'
        }`} style={{ height: '100dvh' }}>
        {/* Full-Screen Backdrop */}
        <div
          className={`absolute inset-0 bg-white transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Full-Screen Content */}
        <div
          className={`absolute inset-0 flex flex-col transition-transform duration-500 ease-out z-[101] ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
            }`}>
          {/* Header Section */}
          <div className="flex items-center justify-between h-20 px-8 shrink-0 bg-white">
            <button
              onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
              className="transition-transform active:scale-95"
            >
              <img
                src="/assets/Logotipo_SparkTree_Studio-degradado.png"
                alt="SparkTree Studio"
                className="h-14 w-auto object-contain"
              />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 bg-gray-50 text-gray-900 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
              aria-label="Cerrar menú"
            >
              <FaX size={18} />
            </button>
          </div>

          {/* Navigation Links - Scrollable on small screens */}
          <div className="flex-1 flex flex-col overflow-y-auto px-8">
            <nav className="space-y-1 py-4">
              {navItems.map((item) => (
                <div key={item.id}>
                  {item.hasDropdown ? (
                    <div className="space-y-1" data-nav-item={item.id}>
                      <div className="flex items-center group">
                        <button
                          onClick={toggleServicesDropdown}
                          aria-expanded={isServicesDropdownOpen}
                          className={`flex-1 text-left py-3 px-4 text-4xl font-black tracking-tighter transition-all duration-300 ${currentPage === item.id || currentPage.startsWith('service-')
                            ? 'text-[#41f0a5] active-relieve'
                            : 'text-gray-900 hover:text-[#41f0a5]'
                            }`}
                        >
                          {item.label}
                        </button>
                        <button
                          onClick={toggleServicesDropdown}
                          aria-label="Mostrar servicios"
                          aria-expanded={isServicesDropdownOpen}
                          className="p-3 text-gray-400"
                        >
                          <svg
                            className={`w-6 h-6 transition-transform duration-300 ${isServicesDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {/* Compact Services List */}
                      <div className={`overflow-hidden transition-all duration-300 ${isServicesDropdownOpen ? 'max-h-[350px] opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-4 border-l-2 border-[#41f0a5] space-y-3 py-2">
                          <button
                            onClick={handleServicesMainClick}
                            className="w-full text-left text-lg font-bold text-[#41f0a5] hover:text-gray-900 transition-colors duration-200"
                          >
                            Ir a Servicios General
                          </button>
                          {servicesItems.map((service) => (
                            <button
                              key={service.id}
                              onClick={() => handleServiceClick(service.id)}
                              className={`w-full text-left text-lg font-semibold transition-colors duration-200 ${currentPage === service.id ? 'text-[#41f0a5]' : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                              {service.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left py-3 px-4 text-4xl font-black tracking-tighter transition-all duration-300 ${currentPage === item.id
                        ? 'text-[#41f0a5] active-relieve'
                        : 'text-gray-900 hover:text-[#41f0a5]'
                        }`}
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Bottom Section - Social & Contact (Sticky at bottom) */}
          <div className="px-4 sm:px-8 pb-6 sm:pb-10 pt-4 sm:pt-6 bg-white shrink-0">
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {/* WhatsApp Button */}
              <AnimatedButton
                href="https://wa.me/51999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-lg font-bold shadow-xl shadow-[#41f0a5]/20"
                variant="default"
              >
                <FaWhatsapp size={18} />
                <span className="hidden sm:inline">Agenda tu consulta</span>
                <span className="sm:hidden">WhatsApp</span>
              </AnimatedButton>

              {/* Social & Contact Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-6 border-t border-gray-100 pt-3 sm:pt-6">
                {/* Socials */}
                <div className="flex gap-3">
                  {[
                    { icon: FaInstagram, href: 'https://instagram.com' },
                    { icon: FaLinkedin, href: 'https://www.linkedin.com/company/sparktree-studio-marketing-digital' },
                    { icon: FaTiktok, href: 'https://tiktok.com' }
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-[#0ea161] transition-colors"
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>

                {/* Contact Links */}
                <div className="flex flex-col gap-0.5 items-end text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-tighter">
                  <a href="tel:+51999999999" className="hover:text-gray-900">+51 999 999 999</a>
                  <a href="mailto:sparktree.rs@gmail.com" className="hover:text-gray-900">sparktree.rs@gmail.com</a>
                </div>
              </div>

              {/* Footer Mini */}
              <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-2">
                <span>© 2025 SPARK TREE</span>
                <div className="flex gap-2 sm:gap-3">
                  <button onClick={() => handleNavClick('privacy')} className="hover:text-gray-900 transition-colors">Privacidad</button>
                  <button onClick={() => handleNavClick('terms')} className="hover:text-gray-900 transition-colors">Términos</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Eliminar scroll del body cuando el menú está abierto */
        body.menu-open {
          overflow: hidden !important;
          height: 100dvh !important;
          touch-action: none;
        }

        .active-relieve {
          color: #41f0a5 !important;
          text-shadow: 
            1px 1px 0px #000,
            2px 2px 0px #000,
            3px 3px 0px #000,
            4px 4px 0px rgba(0,0,0,0.8),
            6px 6px 15px rgba(0,0,0,0.3);
          transform: none !important;
          transition: all 0.3s ease;
        }


        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 rgba(0,0,0,0); }
          50% { box-shadow: 0 0 22px rgba(17,24,39,0.12); }
        }
        .mobile-glow {
          animation: glowPulse 2.6s ease-in-out infinite;
        }
        @keyframes shineSweep {
          0% { transform: translateX(-160%) skewX(-15deg); opacity: 0; }
          35% { opacity: 0.55; }
          65% { opacity: 0.18; }
          100% { transform: translateX(220%) skewX(-15deg); opacity: 0; }
        }
        .mobile-shine::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0) 100%);
          filter: blur(0.5px);
          animation: shineSweep 2.2s linear infinite;
        }
      `}</style>
    </header>
  );
}