'use client';

import { useEffect, useRef, useState } from 'react';
import { FaHeadset, FaRocket, FaCalendar } from 'react-icons/fa6';
import { FaCheckCircle } from 'react-icons/fa';
import PageBanner from '@/components/ui/PageBanner';
import { usePageMeta } from '@/hooks/usePageMeta';
import { getSelectedServices, toggleServiceSelection, normalizeServiceName } from '@/lib/servicesStore';

interface ServicesProps {
  onNavigate?: (page: string) => void;
}

export default function Services({ onNavigate }: ServicesProps) {
  const servicesRef = useRef<HTMLElement>(null);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [lineProgress, setLineProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<HTMLDivElement[]>([]);
  const [selectedList, setSelectedList] = useState<string[]>([]);

  usePageMeta({
    title: 'Servicios Digitales | SparkTree - Diseño Web, SEO, Branding y Más',
    description: 'Descubre nuestros servicios de diseño web, marketing digital, SEO, branding, desarrollo de apps y consultoría digital en Lima. Soluciones personalizadas para tu negocio.',
    url: 'https://sparktree.pe/services',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Servicios Digitales de SparkTree",
      "provider": { "@type": "Organization", "name": "SparkTree" },
      "description": "Servicios de diseño web, marketing digital, SEO, branding y desarrollo de software",
      "url": "https://sparktree.pe/services"
    }
  });

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Servicios' }
  ];

  useEffect(() => {
    setSelectedList(getSelectedServices());

    const handleServiceChange = () => {
      setSelectedList(getSelectedServices());
    };
    window.addEventListener('sparktree_services_changed', handleServiceChange);
    return () => window.removeEventListener('sparktree_services_changed', handleServiceChange);
  }, []);

  const handleToggleService = (title: string) => {
    toggleServiceSelection(title);
  };

  const isSelected = (title: string) => {
    const normalized = normalizeServiceName(title);
    return selectedList.includes(normalized);
  };

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

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (servicesRef.current) {
        const elements = servicesRef.current.querySelectorAll('.reveal');
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

  // Animación del proceso basada en scroll y visibilidad
  useEffect(() => {
    // Observa pasos individualmente
    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idxAttr = (entry.target as HTMLElement).getAttribute('data-step-index');
          const idx = idxAttr ? parseInt(idxAttr, 10) : NaN;
          if (!Number.isNaN(idx) && entry.isIntersecting) {
            setVisibleSteps((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
            stepObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    stepRefs.current.forEach((el) => el && stepObserver.observe(el));

    // Progreso de línea basado en scroll dentro de la sección
    const updateProgress = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const total = rect.height;
      // cuánto del contenedor ha entrado al viewport
      const entered = Math.min(Math.max(viewportH - rect.top, 0), total);
      const pct = total > 0 ? Math.min(Math.max((entered / total) * 100, 0), 100) : 0;
      setLineProgress(pct);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      stepObserver.disconnect();
      window.removeEventListener('scroll', updateProgress as EventListener);
      window.removeEventListener('resize', updateProgress as EventListener);
    };
  }, []);

  const services = [
    {
      title: 'Diseño de Páginas Web',
      description:
        'Tu sitio será hermoso, rápido y, lo más importante, intuitivo. Nos enfocamos en la Experiencia del Usuario (UX) para que tus visitantes encuentren lo que necesitan sin fricción y realicen la acción que deseas (comprar, contactar, cotizar). Un diseño optimizado significa más clientes con el mismo tráfico.',
    },
    {
      title: 'SparkBots (Chatbots de IA)',
      description:
        'Alquila bots de IA conversacional para WhatsApp y web. Soporte y ventas automatizadas 24/7 con bots calificados con la personalidad de tu marca, agendando citas en tu calendario y cerrando leads calificados de forma autónoma. No dejes escapar ningún cliente potencial.',
    },
    {
      title: 'Marketing Digital',
      description:
        'Creamos estrategias integrales de marketing digital para aumentar tu visibilidad y atraer clientes calificados. Desde campañas en redes sociales hasta email marketing y publicidad pagada, te ayudamos a alcanzar tus objetivos de negocio y maximizar tu retorno de inversión.',
    },
    {
      title: 'Desarrollo de Aplicaciones',
      description:
        'Desarrollamos aplicaciones móviles y de escritorio a medida para tu negocio. Apps nativas, híbridas o progresivas que ofrecen experiencias excepcionales, mejoran la eficiencia operativa y crean nuevas oportunidades de conexión con tus clientes.',
    },
    {
      title: 'Posicionamiento SEO',
      description:
        'Dejaremos de depender solo de la publicidad pagada. Optimizamos tu web para que aparezca en los primeros resultados de Google cuando tus clientes busquen tus servicios o productos. Lograrás tráfico constante, calificado y gratuito que trabajará por ti 24/7',
    },
    {
      title: 'Branding',
      description:
        'Convertimos tu negocio en una marca memorable y de confianza. Más allá de un logo, definimos la voz, los valores y la personalidad que te diferenciarán de tu competencia. Una marca sólida genera lealtad y te permite cobrar lo que realmente vale tu servicio',
    },
    {
      title: 'Servicios TI',
      description:
        'Impulsamos la eficiencia y seguridad tecnológica de tu negocio. Ofrecemos soluciones integrales y estratégicas que permiten a tu empresa operar de forma más ágil, segura y escalable, protegiendo tu información y optimizando tu rendimiento digital.',
    },
  ];

  return (
    <div className="pt-[72px]">
      <PageBanner
        title="Nuestros servicios, impulsan resultados"
        subtitle="Descubre cómo ayudamos a tu negocio a crecer en el mundo digital con estrategias personalizadas."
        breadcrumbs={breadcrumbs}
      />
      <section ref={servicesRef} className="py-12 md:py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div
                key={index}
                className={`grid md:grid-cols-2 gap-12 lg:gap-20 items-center reveal hover:scale-105 transition-all duration-500 group scroll-entrance scale-up smooth-exit`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`${index % 2 === 1 ? 'md:order-2' : ''} group-hover:scale-105 transition-transform duration-300`}>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 group-hover:text-gray-700 transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 lg:text-lg leading-relaxed group-hover:text-gray-700 transition-colors">
                    {service.description}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4 items-center">
                    <button
                      onClick={() => onNavigate?.(`service-${service.title.toLowerCase().replace(/\s+/g, '-').replace('diseño-de-páginas-web', 'web').replace('posicionamiento-seo', 'seo').replace('servicios-ti', 'ti').replace('marketing-digital', 'marketing').replace('desarrollo-de-aplicaciones', 'apps').replace('consultoría-digital', 'consulting').replace('sparkbots-(chatbots-de-ia)', 'bots')}`)}
                      className="px-6 py-3 bg-gray-950 text-white rounded-full hover:bg-gray-800 transition-all duration-300 font-medium hover:scale-105 hover:shadow-xl text-sm smooth-exit"
                    >
                      Conoce más
                    </button>
                    <button
                      onClick={() => handleToggleService(service.title)}
                      className={`px-6 py-3 rounded-full font-bold text-sm border-2 transition-all duration-300 flex items-center gap-2 hover:scale-105 ${isSelected(service.title)
                          ? 'bg-gradient-to-r from-[#3750f0] to-[#41f0a5] text-white border-transparent shadow-[0_10px_20px_rgba(55,80,240,0.15)] animate-pulse'
                          : 'bg-white text-gray-950 border-gray-200 hover:border-gray-950'
                        }`}
                    >
                      {isSelected(service.title) ? (
                        <>
                          <FaCheckCircle size={14} className="text-white" />
                          Seleccionado
                        </>
                      ) : (
                        'Me interesa'
                      )}
                    </button>
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? 'md:order-1' : ''} group-hover:scale-105 transition-transform duration-300`}>
                  <div className="bg-gray-100 rounded-[2rem] aspect-video flex items-center justify-center group-hover:bg-gray-200 transition-all duration-300 group-hover:shadow-2xl relative overflow-hidden border border-gray-200">
                    <span className="text-gray-400 group-hover:text-gray-600 transition-colors font-medium">Visualización de Servicio</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Process Section - Timeline */}
          <section className="py-24 lg:py-32 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 lg:mb-20">
                <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 scroll-entrance">
                  Nuestro proceso de trabajo
                </h2>
                <p className="text-gray-500 text-lg lg:text-xl scroll-entrance px-2 max-w-2xl mx-auto">
                  Así es como trabajamos contigo para hacer realidad tu proyecto
                </p>
              </div>

              <div ref={timelineRef} className="relative">
                {/* Línea de tiempo */}
                <div className="hidden lg:block absolute top-8 left-1/2 transform -translate-x-1/2 w-[2px] h-[calc(100%-64px)] bg-gray-100">
                  <div
                    className="absolute top-0 left-0 w-full bg-[#41f0a5] transition-all duration-1000 ease-out shadow-[0_0_15px_#41f0a5]"
                    style={{ height: `${lineProgress}%` }}
                  />
                </div>

                <div className="space-y-12 lg:space-y-24">
                  {[
                    {
                      step: "01",
                      title: "Consulta inicial",
                      description: "Analizamos tus necesidades y objetivos en una reunión estratégica para entender cómo podemos ayudarte de la mejor manera.",
                      icon: FaHeadset
                    },
                    {
                      step: "02",
                      title: "Propuesta personalizada",
                      description: "Creamos un plan de acción detallado con cronograma, presupuesto y los objetivos claros que alcanzaremos juntos.",
                      icon: FaRocket
                    },
                    {
                      step: "03",
                      title: "Desarrollo y Estrategia",
                      description: "Ejecutamos el plan con precisión técnica y creatividad, manteniendo comunicación constante sobre cada avance.",
                      icon: FaCheckCircle
                    },
                    {
                      step: "04",
                      title: "Lanzamiento y Optimización",
                      description: "Lanzamos tu proyecto y seguimos monitoreando el rendimiento para asegurar un retorno de inversión real.",
                      icon: FaCalendar
                    }
                  ].map((process, index) => (
                    <div
                      key={index}
                      ref={(el) => {
                        if (el) stepRefs.current[index] = el;
                      }}
                      data-step-index={index}
                      className={`relative flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                        } transition-all duration-1000 ease-out ${visibleSteps.includes(index)
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-12'
                        }`}
                    >
                      {/* Punto de la línea de tiempo */}
                      <div className="hidden lg:flex relative z-10 flex-shrink-0 w-24 h-24 items-center justify-center mx-auto">
                        <div className={`absolute inset-0 bg-[#41f0a5] rounded-full blur-2xl transition-all duration-700 ${visibleSteps.includes(index) ? 'opacity-20 scale-125' : 'opacity-0 scale-50'}`} />
                        <div className={`relative w-20 h-20 bg-gray-950 rounded-full flex items-center justify-center transition-all duration-700 ${visibleSteps.includes(index)
                          ? 'scale-100 rotate-0'
                          : 'scale-75 rotate-12'
                          }`}>
                          <process.icon className={`text-2xl transition-colors duration-500 ${visibleSteps.includes(index) ? 'text-[#41f0a5]' : 'text-gray-500'}`} />
                        </div>
                      </div>

                      {/* Contenido del paso */}
                      <div className={`w-full lg:w-[42%] ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                        <div className="bg-gray-50 p-8 lg:p-10 rounded-[2.5rem] border border-gray-100 hover:border-gray-200 transition-all duration-500 group">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-[#41f0a5] font-bold text-lg tracking-widest">{process.step}</span>
                            <div className="h-[1px] flex-grow bg-gray-200 group-hover:bg-[#41f0a5] transition-colors duration-500" />
                          </div>
                          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                            {process.title}
                          </h3>
                          <p className="text-gray-500 text-lg leading-relaxed">
                            {process.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="text-center mt-24 reveal scroll-entrance bounce-in">
            <div className="relative rounded-[3rem] p-12 lg:p-24 max-w-5xl mx-auto overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-2xl group">
              {/* Dynamic Bubbles */}
              <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bubble-float-1 bubble-cyan opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
              <div className="absolute bottom-[-20%] right-[10%] w-96 h-96 bubble-float-2 bubble-neon opacity-15 group-hover:opacity-30 transition-opacity duration-700" />

              {/* Content Overlay */}
              <div className="relative z-10">
                <h3 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                  ¿Listo para impulsar <br className="hidden sm:block" /> tu negocio?
                </h3>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Descubre cómo nuestras soluciones digitales pueden transformar tu presencia y acelerar tu crecimiento.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => window.open('https://wa.me/', '_blank')}
                    className="group/btn relative px-12 py-5 bg-[#41f0a5] text-black font-bold rounded-full hover:scale-105 hover:shadow-[0_0_50px_rgba(65,240,165,0.3)] transition-all duration-500 overflow-hidden text-lg"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Comencemos a crecer
                      <span className="w-0 overflow-hidden group-hover/btn:w-6 transition-all duration-300 ease-out flex items-center">
                        <FaRocket className="text-xl translate-y-4 group-hover/btn:translate-y-0 transition-transform duration-500" />
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
