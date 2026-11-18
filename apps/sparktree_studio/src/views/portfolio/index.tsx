'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Project } from '@/data/projects';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import PageBanner from '@/components/ui/PageBanner';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Laptop, Palette, Film, Settings, Megaphone, LayoutGrid, Sparkles, ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';

interface PortfolioProps {
  onViewProject?: (projectId: string) => void;
}

export default function Portfolio({ onViewProject }: PortfolioProps) {
  const portfolioRef = useRef<HTMLElement>(null);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  useEffect(() => {
    async function fetchProjects() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('isVisible', true)
          .order('orderRank', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Could not fetch projects:', error.message || error);
        } else if (data) {
          setProjectsList(data as Project[]);
        }
      } catch (err) {
        console.warn('Network error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const categories = [
    { id: 'Todos', label: 'Todos', icon: LayoutGrid },
    { id: 'Webs', label: 'Webs', icon: Laptop },
    { id: 'Diseño', label: 'Diseño', icon: Palette },
    { id: 'Multimedia', label: 'Multimedia', icon: Film },
    { id: 'Sistemas', label: 'Sistemas', icon: Settings },
    { id: 'Marketing', label: 'Marketing', icon: Megaphone },
  ];

  // Featured projects filter
  const featuredProjects = useMemo(() => projectsList.filter(p => p.isFeatured), [projectsList]);

  // Map existing categories to main ones for filtering
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'Todos') return projectsList;

    return projectsList.filter(p => {
      const cat = p.category.toLowerCase();
      if (activeCategory === 'Webs') return cat.includes('web') || cat.includes('ecommerce') || cat.includes('landing');
      if (activeCategory === 'Diseño') return cat.includes('branding') || cat.includes('diseño');
      if (activeCategory === 'Marketing') return cat.includes('marketing') || cat.includes('seo');
      if (activeCategory === 'Sistemas') return cat.includes('sistemas') || cat.includes('ti');
      if (activeCategory === 'Multimedia') return cat.includes('multimedia') || cat.includes('video');
      return false;
    });
  }, [activeCategory]);

  usePageMeta({
    title: 'Nuestro Portafolio | Empresa SparkTree',
    description: 'Explora nuestro portafolio de diseño web, branding y marketing digital. Proyectos con resultados reales para clientes en Perú e internacional.',
    url: 'https://sparktree.pe/portfolio',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Portafolio de Empresa SparkTree",
      "description": "Exposición de proyectos destacados en diseño y desarrollo web.",
      "url": "https://sparktree.pe/portfolio"
    }
  });

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Nuestro Portafolio' }
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const timeoutId = setTimeout(() => {
      if (portfolioRef.current) {
        const elements = portfolioRef.current.querySelectorAll('.reveal');
        elements.forEach(el => observer.observe(el));
      }

      const scrollElements = document.querySelectorAll('.scroll-entrance');
      scrollElements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);


  return (
    <div className="pt-[72px]">
      <PageBanner
        title="Nuestro Portafolio"
        subtitle="Portafolio de diseño web y branding: proyectos con resultados reales."
        breadcrumbs={breadcrumbs}
      />
      <section ref={portfolioRef} className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section: Featured Projects (Restored Carousel - Premium Light Style) */}
          {featuredProjects.length > 0 && (
            <div className="mb-24 px-4 sm:px-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100 shadow-sm">
                    <Sparkles className="w-6 h-6 text-[#41F0A5]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Proyectos Destacados</h2>
                    <p className="text-[#41F0A5] font-bold text-xs uppercase tracking-widest mt-1">Selección Premium</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const container = document.getElementById('featured-carousel');
                      if (container) container.scrollBy({ left: -400, behavior: 'smooth' });
                    }}
                    className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-[#41F0A5]/10 hover:border-[#41F0A5]/30 transition-all shadow-sm group"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-[#41F0A5] transition-colors" />
                  </button>
                  <button
                    onClick={() => {
                      const container = document.getElementById('featured-carousel');
                      if (container) container.scrollBy({ left: 400, behavior: 'smooth' });
                    }}
                    className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-[#41F0A5]/10 hover:border-[#41F0A5]/30 transition-all shadow-sm group"
                  >
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#41F0A5] transition-colors" />
                  </button>
                </div>
              </div>

              <div
                id="featured-carousel"
                className="flex gap-8 overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {featuredProjects.map((project) => {
                  // Map category to icon
                  const CategoryIcon = categories.find(c => {
                    const pCat = project.category.toLowerCase();
                    const cLabel = c.label.toLowerCase();
                    if (cLabel === 'webs') return pCat.includes('web') || pCat.includes('ecommerce') || pCat.includes('landing');
                    if (cLabel === 'diseño') return pCat.includes('branding') || pCat.includes('diseño');
                    if (cLabel === 'marketing') return pCat.includes('marketing') || pCat.includes('seo');
                    if (cLabel === 'sistemas') return pCat.includes('sistemas') || pCat.includes('ti');
                    if (cLabel === 'multimedia') return pCat.includes('multimedia') || pCat.includes('video');
                    return false;
                  })?.icon || Sparkles;

                  return (
                    <div
                      key={project.id}
                      onClick={() => onViewProject?.(project.id)}
                      className="min-w-[85%] md:min-w-[calc(50%-1rem)] lg:min-w-[calc(33.33%-1.5rem)] snap-start group cursor-pointer"
                    >
                      <div className="relative bg-white rounded-[2.5rem] aspect-[16/10] mb-8 overflow-hidden shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)] border border-gray-100 group-hover:shadow-[0_40px_80px_-20px_rgba(65,240,165,0.15)] transition-all duration-700">
                        <img
                          src={project.cardImage || project.heroImage}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />

                        {/* Premium Icon Badge */}
                        <div className="absolute top-6 left-6 z-20">
                          <div className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/50 group-hover:bg-[#41F0A5] group-hover:text-gray-900 transition-all duration-500">
                            <CategoryIcon className="w-5 h-5" />
                          </div>
                        </div>

                        {/* Minimalist Hover Hint */}
                        <div className="absolute inset-0 bg-[#41F0A5]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-all duration-700">
                            <ArrowUpRight className="w-8 h-8 text-gray-900" />
                          </div>
                        </div>
                      </div>

                      <div className="px-6">
                        <div className="flex flex-col gap-1 mb-3">
                          <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#41F0A5] transition-colors tracking-tight">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#41F0A5] rounded-full"></div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                              {project.client}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-xs font-medium leading-relaxed line-clamp-1 max-w-2xl">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}          {/* Categories and Filters - Minimalist Redesign */}
          <div className="mt-20 mb-16 px-4">
            <div className="flex flex-wrap justify-center gap-2.5 animate-fade-in">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-7 py-2.5 rounded-full text-xs font-bold tracking-tight transition-all duration-300 ${activeCategory === cat.id
                      ? 'bg-[#41F0A5] text-gray-900 shadow-lg shadow-[#41F0A5]/20 scale-105'
                      : 'bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <style>{`
            @keyframes glowPulseMint {
              0%, 100% { text-shadow: 0 0 0 rgba(16,185,129,0); }
              50% { text-shadow: 0 0 10px rgba(110,231,183,0.9), 0 0 18px rgba(16,185,129,0.6); }
            }
            .glow-text { text-shadow: none; transition: text-shadow 200ms ease; }
            .glow-hover:hover .glow-text {
              animation: glowPulseMint 2.2s ease-in-out infinite;
              text-shadow: 0 0 8px rgba(110,231,183,0.75), 0 0 14px rgba(16,185,129,0.45);
            }
          `}</style>

          {/* Regular Grid - Redesigned Minimalist Card Portfolio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {filteredProjects.map((project, index) => {
              // Map category to icon
              const CategoryIcon = categories.find(c => {
                const pCat = project.category.toLowerCase();
                const cLabel = c.label.toLowerCase();
                if (cLabel === 'webs') return pCat.includes('web') || pCat.includes('ecommerce') || pCat.includes('landing');
                if (cLabel === 'diseño') return pCat.includes('branding') || pCat.includes('diseño');
                if (cLabel === 'marketing') return pCat.includes('marketing') || pCat.includes('seo');
                if (cLabel === 'sistemas') return pCat.includes('sistemas') || pCat.includes('ti');
                if (cLabel === 'multimedia') return pCat.includes('multimedia') || pCat.includes('video');
                return false;
              })?.icon || LayoutGrid;

              return (
                <div
                  key={project.id}
                  onClick={() => onViewProject?.(project.id)}
                  className="group cursor-pointer bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(65,240,165,0.12)] reveal scroll-entrance fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image Container */}
                  <div className="aspect-[16/11] overflow-hidden relative">
                    <img
                      src={project.cardImage || project.heroImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />

                    {/* Category ICON Badge - Top Corner */}
                    <div className="absolute top-5 left-5 z-20">
                      <div className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/50 group-hover:bg-[#41F0A5] group-hover:text-gray-900 transition-all duration-500">
                        <CategoryIcon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Ultra-Minimalist Hover Hint */}
                    <div className="absolute inset-0 bg-[#41F0A5]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-all duration-500">
                        <ArrowUpRight className="w-7 h-7 text-gray-900" />
                      </div>
                    </div>
                  </div>

                  {/* Info Section - Minimalist yet Informative */}
                  <div className="p-6 pt-0 -mt-2 relative z-10">
                    <div className="bg-white rounded-t-2xl pt-5">
                      <div className="flex flex-col gap-1 mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#41F0A5] transition-colors tracking-tight line-clamp-1">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-[#41F0A5] rounded-full"></div>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                            {project.client}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs font-medium text-gray-400 mb-5 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Extra Info Row: Duration & Status */}
                      <div className="flex items-center justify-between mb-5 py-2.5 border-y border-gray-50">
                        {project.duration && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Tiempo:</span>
                            <span className="text-[9px] font-black text-gray-700">{project.duration}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold text-gray-400 uppercase">Status:</span>
                          <span className="text-[9px] font-black text-gray-700 uppercase">Premium</span>
                        </div>
                      </div>

                      {/* Technologies Section */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 3).map((tech, i) => (
                          <span key={i} className="text-[8px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100/50">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {loading ? (
            <div className="flex justify-center py-32">
              <div className="w-12 h-12 border-4 border-[#41F0A5] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredProjects.length === 0 && (
            <div className="text-center py-32 animate-fade-up">
              <div className="w-24 h-24 bg-gray-50 rounded-[2rem] mx-auto mb-8 flex items-center justify-center border border-gray-100">
                <LayoutGrid className="w-12 h-12 text-gray-200" />
              </div>
              <p className="text-gray-400 text-xl font-black tracking-tight uppercase">Próximamente más proyectos</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}