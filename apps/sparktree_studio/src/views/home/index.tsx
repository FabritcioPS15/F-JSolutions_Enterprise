'use client';

import { useEffect, useRef, useState } from 'react';
import { Project } from '@/data/projects';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Star, Rocket, Zap, Linkedin } from 'lucide-react';
import CountUp from '@/components/common/CountUp';

import { TextRevealButton } from '@/components/ui/shadcn-io/text-reveal-button';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ServiceHero } from '@/components/home/ServiceHero';


interface HomeProps {
  onNavigate?: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const servicesRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [projectPage, setProjectPage] = useState(0);
  const itemsPerPage = 3;



  useEffect(() => {
    async function fetchRecentProjects() {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('isVisible', true)
          .order('orderRank', { ascending: true })
          .order('created_at', { ascending: false })
          .limit(12);

        if (error) {
          console.warn('Could not fetch recent projects:', error.message || error);
        } else if (data) {
          setRecentProjects(data as Project[]);
        }
      } catch (err) {
        console.warn('Network error fetching recent projects:', err);
      }
    }

    fetchRecentProjects();
  }, []);

  usePageMeta({
    title: 'SparkTree Studio | Agencia de Marketing Digital & Diseño Web en Lima',
    description: 'Convertimos visitas en ventas. Agencia líder en Lima especializada en diseño web de alto rendimiento, posicionamiento SEO y branding estratégico para negocios reales.',
    url: 'https://sparktree.pe',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Empresa SparkTree",
      "url": "https://sparktree.pe",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://sparktree.pe/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  });

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
      if (servicesRef.current) {
        const elements = servicesRef.current.querySelectorAll('.reveal');
        elements.forEach(el => observer.observe(el));
      }
      if (projectsRef.current) {
        const elements = projectsRef.current.querySelectorAll('.reveal');
        elements.forEach(el => observer.observe(el));
      }
      if (teamRef.current) {
        const elements = teamRef.current.querySelectorAll('.reveal');
        elements.forEach(el => observer.observe(el));
      }

      // Observe scroll-entrance elements
      const scrollElements = document.querySelectorAll('.scroll-entrance');
      scrollElements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Removed projects variable, using recentProjects state directly below

  const services = [
    {
      title: 'Tu Equipo de Marketing Externo',
      description: 'Olvídate de contratar personal. Nosotros operamos como tu departamento de marketing dedicado, gestionando estrategia, pauta y crecimiento digital con enfoque en ROI.',
      image: '/assets/service/SEO_SERVICIO.webp',
      gradient: 'from-[#41F0A5] to-[#3750F0]',
    },
    {
      title: 'Diseño Web de Alto Rendimiento',
      description: 'Sitios web optimizados para convertir. Nos enfocamos en la experiencia del usuario (UX) para que cada visita se transforme en una oportunidad de venta real.',
      image: '/assets/service/PAGINASWEB_SERVICIO.webp',
      gradient: 'from-[#41F0A5] to-[#3750F0]',
    },
    {
      title: 'Branding',
      description: 'Convertimos tu negocio en una marca memorable y de confianza. Más allá de un logo, definimos la voz, los valores y la personalidad que te diferenciarán de tu competencia.',
      image: '/assets/service/BRANDING_SERVICIO.webp',
      gradient: 'from-[#41F0A5] to-[#3750F0]',
    },
    {
      title: 'Automatización con IA (SaaS)',
      description: 'Impulsamos la eficiencia y seguridad tecnológica de tu negocio. Ofrecemos soluciones integrales y estratégicas que permiten a tu empresa operar de forma más ágil, segura y escalable.',
      image: '/assets/service/TI_SERVICIO.webp',
      gradient: 'from-[#3750f0] to-[#41F0A5]',
    },
    {
      title: 'Consultoría IT',
      description: 'Impulsamos la eficiencia y seguridad tecnológica de tu negocio. Ofrecemos soluciones integrales y estratégicas que permiten a tu empresa operar de forma más ágil, segura y escalable.',
      image: '/assets/service/TI_SERVICIO.webp',
      gradient: 'from-[#3750f0] to-[#41F0A5]',
    },
    {
      title: 'Desarrollo de Software a la Medida',
      description: 'Impulsamos la eficiencia y seguridad tecnológica de tu negocio. Ofrecemos soluciones integrales y estratégicas que permiten a tu empresa operar de forma más ágil, segura y escalable.',
      image: '/assets/service/TI_SERVICIO.webp',
      gradient: 'from-[#3750f0] to-[#41F0A5]',
    },
  ];

  const team = [
    { name: 'Fabritcio Peña', role: 'Desarrollador', linkedin: 'https://www.linkedin.com/in/fabritciops15/' },
    { name: 'Roman Reto', role: 'Diseñador UX / UI', linkedin: 'https://www.linkedin.com/in/roman-reto-dise%C3%B1o-gr%C3%A1fico-14447625a/' },
    { name: 'Ruth Belén de la Torre Gamarra', role: 'Profesional de Marketing', linkedin: 'https://www.linkedin.com/in/belen-de-la-torre-8058a6213/' },
    { name: 'Jimmy Sebastian Peña Flores', role: 'Desarrollador', linkedin: 'https://www.linkedin.com/in/jflorespe02/' },
    { name: 'Alvaro Carpio Lozano', role: 'Desarrollador', linkedin: 'https://www.linkedin.com/in/alvaro-adrian-carpio-lozano-b685172b8/' },
  ];

  return (
    <div className="pt-0">
      {/* New Hero Section */}
      <ServiceHero onNavigate={onNavigate} />

      {/* Mini Stats Bar */}
      <div className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <CountUp end={98} suffix="%" className="text-2xl md:text-3xl font-black text-gray-900 block" />
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Retención</p>
            </div>
            <div>
              <CountUp end={150} suffix="+" className="text-2xl md:text-3xl font-black text-gray-900 block" />
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Casos de Éxito</p>
            </div>
            <div>
              <CountUp end={24} suffix="/7" className="text-2xl md:text-3xl font-black text-gray-900 block" />
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Soporte IA</p>
            </div>
            <div>
              <CountUp end={100} suffix="%" className="text-2xl md:text-3xl font-black text-gray-900 block" />
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Compromiso</p>
            </div>
          </div>
        </div>
      </div>


      {/* About Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <div className="bg-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 text-center mb-6 sm:mb-8 md:mb-10 scroll-entrance scale-up scroll-stagger-1 hover:bg-gray-200 hover:scale-105 hover:shadow-lg transition-all duration-500 cursor-default smooth-exit">
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-2">SparkTree Hub</h2>
              <p className="text-emerald-600 font-bold tracking-widest uppercase text-xs">Ecosistema de Soluciones Digitales</p>
            </div>
            <p className="text-gray-600 leading-relaxed text-center text-xs sm:text-sm md:text-base px-2 sm:px-0 scroll-entrance slide-left scroll-stagger-2 hover:text-gray-800 hover:scale-105 transition-all duration-500 cursor-default">
              Somos un hub empresarial diseñado para impulsar negocios reales. No solo creamos herramientas, construimos el motor tecnológico y creativo que tu empresa necesita para dominar el mercado digital actual.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
            <div className="bg-gray-100 rounded-2xl aspect-[4/3] sm:aspect-[3/2] flex items-center justify-center scroll-entrance slide-left scroll-stagger-3 hover:bg-gray-200 hover:scale-105 hover:shadow-lg transition-all duration-500 cursor-default group smooth-exit p-4">
              <p className="text-gray-500 group-hover:text-gray-700 transition-colors duration-500 text-xs sm:text-sm text-center">
                Imagen referencial del resultado del proyecto
              </p>
            </div>
            <div className="bg-gray-100 rounded-2xl aspect-[4/3] sm:aspect-[3/2] flex items-center justify-center scroll-entrance slide-right scroll-stagger-4 hover:bg-gray-200 hover:scale-105 hover:shadow-lg transition-all duration-500 cursor-default group smooth-exit p-4">
              <p className="text-gray-500 group-hover:text-gray-700 transition-colors duration-500 text-xs sm:text-sm text-center">
                Imagen referencial del resultado del proyecto
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Spotlight Section */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full -z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="scroll-entrance slide-left">
              <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-widest uppercase border border-emerald-400 text-emerald-400 rounded-full">
                SaaS & Automatización
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Alquila tu área de <span className="text-emerald-400">Atención Automática</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Presentamos <strong>SparkBots</strong>: Nuestra tecnología propietaria de IA diseñada para responder, calificar y agendar clientes 24/7 sin intervención humana.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3">
                  <div className="bg-emerald-500/20 p-1 rounded-full"><Rocket className="w-4 h-4 text-emerald-400" /></div>
                  <span className="text-sm md:text-base">Respuesta instantánea en WhatsApp y Web.</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-emerald-500/20 p-1 rounded-full"><Rocket className="w-4 h-4 text-emerald-400" /></div>
                  <span className="text-sm md:text-base">Integración con tu CRM actual.</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-emerald-500/20 p-1 rounded-full"><Rocket className="w-4 h-4 text-emerald-400" /></div>
                  <span className="text-sm md:text-base">Entrenados con la voz de tu marca.</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => onNavigate?.('contact')} className="px-8 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">
                  Alquilar SparkBots →
                </button>
                <button onClick={() => onNavigate?.('service-bots')} className="px-8 py-4 bg-transparent border border-emerald-500/30 text-emerald-400 font-bold rounded-xl hover:bg-emerald-500/10 transition-all">
                  Conoce más
                </button>
              </div>
            </div>
            <div className="relative scroll-entrance scale-up">
              <div className="aspect-video bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Zap className="w-10 h-10 text-emerald-400" />
                  </div>
                  <p className="text-emerald-400 font-mono text-sm">[Interfaz SparkBots en desarrollo...]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Sections (one per service) */}
      <section ref={servicesRef} className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl sm:text-3xl md:text-7xl font-bold text-gray-900    mb-6 text-center scroll-entrance scroll-stagger-1">
            Nuestros servicios: Estrategia, diseño y crecimiento
          </h2>
        </div>
        {services.map((service, index) => (
          <section
            key={index}
            id={
              index === 0
                ? 'service-diseno'
                : index === 1
                  ? 'service-seo'
                  : index === 2
                    ? 'service-branding'
                    : 'service-ti'
            }
            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} py-10 sm:py-12 md:py-16 lg:py-20`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`grid lg:grid-cols-12 gap-y-8 gap-x-4 md:gap-x-8 items-center scroll-entrance scale-up scroll-stagger-${index + 2}`}
              >
                <div
                  className={`${index % 2 === 0 ? 'lg:col-span-7' : 'lg:col-span-7 lg:order-2'} max-w-xl`}
                >
                  <div className="mb-3 sm:mb-4">
                    <TextRevealButton
                      text={service.title}
                      revealColor="#41bef0ff"
                      strokeColor="#41f0a5"
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-normal font-bold"
                      style={{ WebkitTextStroke: '0px transparent' }}
                    />
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg mb-5 sm:mb-6">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => onNavigate?.(index === 0 ? 'service-web' : index === 1 ? 'service-seo' : index === 2 ? 'service-branding' : 'service-ti')} className="px-4 sm:px-5 md:px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium text-sm hover-shadow-mint">
                      Ver servicio
                    </button>
                    <button onClick={() => onNavigate?.('portfolio')} className="px-4 sm:px-5 md:px-6 py-2.5 bg-white text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-300 font-medium text-sm hover-shadow-blue">
                      Ver casos →
                    </button>
                  </div>
                </div>
                <div className={`${index % 2 === 0 ? 'lg:col-span-5' : 'lg:col-span-5 lg:order-1'} flex items-center justify-center`}>
                  <div
                    className="relative w-full max-w-2xl mx-auto p-6 rounded-3xl"
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-auto drop-shadow-2xl rounded-2xl hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </section>

      {/* Service Modals removed: direct navigation */}

      {/* Projects Section */}
      <section ref={projectsRef} className="bg-gray-50 py-10 sm:py-12 md:py-16 lg:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center md:text-left scroll-entrance scroll-stagger-1">
              <span className="inline-block hover:scale-105 hover:text-gray-700 transition-all duration-500 cursor-default">
                Proyectos Recientes
              </span>
              <br />
              <span className="inline-block hover:scale-105 hover:text-gray-700 transition-all duration-500 cursor-default">
                que Impulsamos
              </span>
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => setProjectPage(prev => Math.max(0, prev - 1))}
                disabled={projectPage === 0}
                className="p-3 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={() => setProjectPage(prev => (prev + 1) * itemsPerPage < recentProjects.length ? prev + 1 : prev)}
                disabled={(projectPage + 1) * itemsPerPage >= recentProjects.length}
                className="p-3 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              className="flex transition-transform duration-700 ease-in-out gap-6"
              style={{ transform: `translateX(-${projectPage * 100}%)` }}
            >
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onNavigate?.(`/portfolio/${project.id}`)}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 group cursor-pointer scroll-entrance scale-up transition-all duration-500"
                >
                  <div className="relative bg-gray-200 rounded-2xl aspect-[4/5] sm:aspect-[3/4] mb-4 overflow-hidden shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500">
                    {/* Featured Tag */}
                    {project.isFeatured && (
                      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                        <Star className="w-3 h-3 fill-current" />
                        <span>DESTACADO</span>
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-500 text-xs sm:text-sm">imagen</span>
                    </div>

                    <div
                      className="absolute inset-x-0 bottom-0 h-[80%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: `linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.4), transparent)` }}
                    />

                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <div className="text-white">
                        <p className="text-xl md:text-2xl font-bold leading-tight">{project.title}</p>
                        <p className="text-sm mt-2 text-white/80">{project.client}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {project.services?.slice(0, 2).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded text-[10px] uppercase tracking-wider">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-center text-gray-900 font-bold group-hover:text-emerald-600 transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate?.('portfolio')}
              className="px-8 py-3 bg-white text-gray-900 font-bold rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all active:scale-95"
            >
              Ver todos los proyectos
            </button>
          </div>
        </div>
      </section>


      {/* Team Section */}
      <section ref={teamRef} className="py-10 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-center px-2 sm:px-0 scroll-entrance scroll-stagger-1">
            <span className="inline-block scroll-stagger-1 hover:scale-105 hover:text-gray-700 transition-all duration-500 cursor-default">
              Somos Ciencia &
            </span>
            <br />
            <span className="inline-block scroll-stagger-2 hover:scale-105 hover:text-gray-700 transition-all duration-500 cursor-default">
              Creatividad
            </span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto mb-8 sm:mb-10 md:mb-12">
            {team.map((member, index) => (
              <div
                key={index}
                className={`relative bg-gray-100 rounded-2xl pt-6 px-6 pb-10 sm:pt-8 sm:px-8 sm:pb-12 text-center scroll-entrance scale-up scroll-stagger-${index + 3} hover:bg-white hover:scale-105 hover:shadow-2xl transition-all duration-500 cursor-default group filter grayscale hover:grayscale-0 border border-transparent hover:border-emerald-100`}
              >
                <div className="bg-gray-200 w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 group-hover:bg-gray-100 group-hover:scale-110 transition-all duration-500 flex items-center justify-center overflow-hidden">
                  <span className="text-gray-400 group-hover:text-emerald-500 transition-colors">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <p className="text-gray-900 font-bold mb-1 group-hover:text-emerald-600 transition-colors duration-500 text-sm">
                  {member.name}
                </p>
                <p className="text-gray-500 text-xs mt-1 group-hover:text-gray-700 transition-colors duration-500 italic">
                  {member.role}
                </p>
                <div className="absolute left-0 right-0 bottom-3 sm:bottom-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors p-1" title="LinkedIn">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>


          <p className="text-center text-gray-600 leading-relaxed max-w-3xl mx-auto text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-0 scroll-entrance slide-left scroll-stagger-5 hover:text-gray-800 hover:scale-105 transition-all duration-500 cursor-default">
            Ayudamos a las marcas a crecer y destacar en el mercado a través de estrategias de marketing innovadoras y personalizadas, enfocadas en conectar con su audiencia y maximizar su impacto digital
          </p>
        </div>
      </section>
    </div>
  );
}