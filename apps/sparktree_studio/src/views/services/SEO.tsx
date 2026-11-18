'use client';

import { useEffect, useRef, useState } from 'react';
import PageBanner from '@/components/ui/PageBanner';
import { usePageMeta } from '@/hooks/usePageMeta';
import { FaRocket, FaCheck } from 'react-icons/fa6';
import { isServiceSelected, toggleServiceSelection } from '@/lib/servicesStore';

interface ServicePageProps {
  onNavigate?: (page: string) => void;
}

export default function ServiceSEO({ onNavigate }: ServicePageProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Servicios', path: '/services' },
    { label: 'Posicionamiento SEO' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const timeoutId = setTimeout(() => {
      if (rootRef.current) {
        const elements = rootRef.current.querySelectorAll('.reveal, .scroll-entrance');
        elements.forEach((el) => observer.observe(el));
      }
    }, 80);

    return () => { clearTimeout(timeoutId); observer.disconnect(); };
  }, []);

  useEffect(() => {
    setIsSelected(isServiceSelected('SEO'));

    const handleServiceChange = () => {
      setIsSelected(isServiceSelected('SEO'));
    };
    window.addEventListener('sparktree_services_changed', handleServiceChange);
    return () => window.removeEventListener('sparktree_services_changed', handleServiceChange);
  }, []);

  const handleToggleSelection = () => {
    toggleServiceSelection('SEO');
  };

  usePageMeta({
    title: 'Posicionamiento SEO en Google | SparkTree - Agencia Marketing Digital Lima',
    description: 'Especialistas en SEO para empresas en Lima. Mejoramos tu posicionamiento en Google con estrategias orgánicas efectivas. ¡Aumenta tu visibilidad y atrae más clientes!',
    url: 'https://sparktree.pe/services/seo',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Posicionamiento SEO",
      "description": "Servicio de optimización SEO para mejorar posicionamiento en Google",
      "provider": {
        "@type": "Organization",
        "name": "SparkTree",
        "url": "https://sparktree.pe"
      },
      "serviceType": "SEO Services",
      "areaServed": "Lima, Perú",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Servicios SEO",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Auditoría SEO"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "SEO On Page"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Link Building"
            }
          }
        ]
      }
    }
  });

  const processSteps = [
    {
      number: "1",
      title: "Auditoría SEO",
      description: "Analizamos el estado actual de tu web (errores, velocidad, estructura).",
      items: ["auditamos el sitio web", "velocidad de carga", "estructura y arquitectura", "salud técnica del sitio"],
      footer: "Una auditoría completa nos permite identificar oportunidades de mejora y establecer una base sólida para el posicionamiento orgánico."
    },
    {
      number: "2",
      title: "Investigación de palabras clave",
      description: "Identificamos cómo buscan tus clientes en Google.",
      items: ["palabras clave principales", "frases de cola larga", "intención del usuario", "tendencias de búsqueda"],
      footer: "Nos enfocamos en palabras clave relevantes para tu negocio y que tengan un volumen de búsqueda significativo."
    },
    {
      number: "3",
      title: "Optimización On Page",
      description: "Mejoramos títulos, contenido, estructura y experiencia de usuario.",
      items: ["optimización de títulos y meta descripciones", "mejora de contenido", "estructura de enlaces internos", "experiencia de usuario (UX)"],
      footer: "Las optimizaciones on-page aseguran que cada página esté optimizada para SEO y para los visitantes."
    },
    {
      number: "4",
      title: "Estrategia de contenido",
      description: "Creamos artículos y páginas orientadas a posicionamiento.",
      items: ["artículos de blog", "páginas de servicios", "contenido evergreen", "guías y recursos"],
      footer: "El contenido de valor atrae visitantes, los convierte en clientes potenciales y fortalece la autoridad del sitio."
    },
    {
      number: "5",
      title: "SEO técnico",
      description: "Optimizamos velocidad, indexación y arquitectura web.",
      items: ["optimización de velocidad de carga", "mejoras en la arquitectura web", "indexación en buscadores", "estructura de datos"],
      footer: "Un SEO técnico sólido asegura que los buscadores puedan rastrear e indexar el sitio eficientemente."
    },
    {
      number: "6",
      title: "Link building",
      description: "Aumentamos la autoridad con enlaces estratégicos.",
      items: ["construcción de enlaces relevantes", "estrategia de link building", "perfil de enlaces natural"],
      footer: "Los enlaces de calidad de otros sitios web aumentan la autoridad y credibilidad del sitio ante Google."
    },
    {
      number: "7",
      title: "Monitoreo y mejora continua",
      description: "Medimos resultados y optimizamos constantemente.",
      items: ["seguimiento de rankings", "análisis de tráfico orgánico", "informes mensuales", "optimización continua"],
      footer: "El SEO es un proceso continuo. Realizamos seguimiento constante para adaptar la estrategia y mejorar los resultados a lo largo del tiempo."
    }
  ];


  return (
    <div className="pt-[72px]">
      <PageBanner
        title="Posicionamiento SEO en Google"
        subtitle="Dejamos de depender solo de la publicidad pagada."
        breadcrumbs={breadcrumbs}
      />

      <section ref={rootRef as any} className="relative py-16 md:py-24 overflow-hidden bg-white">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#41f0a5]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3750f0]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Main Hero View - Centered Intro */}
          <div className="text-center mb-16 md:mb-24">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-950 mb-8 tracking-tight reveal">
              Posicionamiento SEO en Google <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">para empresas</span>
            </h1>
          </div>

          {/* Intro Section - Split Layout */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24 md:mb-32">
            <div className="space-y-6 reveal slide-left">
              <p className="text-base md:text-lg text-gray-900 font-bold leading-relaxed">
                Dejamos de depender solo de la publicidad pagada. Optimizamos tu web para que aparezca en los primeros resultados de Google cuando tus clientes en Lima y Perú busquen tus servicios o productos.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">
                En SparkTree Studio, desarrollamos estrategias de posicionamiento SEO enfocadas en aumentar tu visibilidad online, atraer tráfico de calidad y generar clientes potenciales de manera orgánica para empresas en Perú.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">
                Trabajamos el SEO como un proceso integral que combina análisis, optimización técnica y contenido estratégico.
              </p>

              <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-4">
                <button
                  onClick={() => {
                    if (!isSelected) handleToggleSelection();
                    onNavigate?.('contact');
                  }}
                  className="px-8 py-3.5 bg-[#3750f0] text-white rounded-xl font-bold tracking-wide shadow-[0_10px_20px_rgba(55,80,240,0.2)] hover:scale-105 transition-all duration-300 hover:shadow-[0_15px_30px_rgba(55,80,240,0.3)] text-sm md:text-base"
                >
                  Asesoría gratuita
                </button>
                <button
                  onClick={handleToggleSelection}
                  className={`px-8 py-3.5 rounded-xl font-bold tracking-wide transition-all duration-300 text-sm md:text-base border-2 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-[#3750f0] to-[#41f0a5] text-white border-transparent shadow-[0_10px_20px_rgba(55,80,240,0.15)] animate-pulse'
                      : 'bg-white text-gray-950 border-gray-200 hover:border-[#3750f0] hover:scale-105 shadow-sm'
                  }`}
                >
                  {isSelected ? '✓ SEO Seleccionado' : 'Añadir a mi Cotización'}
                </button>
              </div>
            </div>

            {/* Illustration Area */}
            <div className="relative flex justify-center items-center reveal scale-up">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#41f0a5]/20 to-[#3750f0]/10 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="w-full max-w-md rounded-3xl relative shadow-2xl overflow-hidden group z-10">
                <img 
                  src="/assets/service/SEO%20SERVICIO.webp" 
                  alt="Posicionamiento SEO - SparkTree" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Process Section */}
          <div className="py-16 md:py-24 border-t border-gray-100">
            <div className="text-center mb-12 md:mb-20 scroll-entrance">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-950 mb-4 tracking-tight">
                Nuestro proceso SEO
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto font-medium px-4">
                En Spark Tree Studio seguimos un proceso estratégico que garantiza resultados profesionales y alineados con los objetivos de cada cliente.
              </p>
            </div>

            <div className="space-y-12 max-w-4xl mx-auto">
              {processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`relative p-8 md:p-12 bg-white/40 backdrop-blur-xl border border-gray-100 rounded-[3rem] transition-all duration-500 hover:shadow-2xl hover:border-[#41f0a5]/30 scroll-entrance ${idx % 2 === 0 ? 'slide-left' : 'slide-right'}`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="absolute top-8 right-12 text-8xl font-black text-gray-950/5 select-none">{step.number}</div>

                  <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-16 h-16 bg-gray-950 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:rotate-6 transition-all">
                      <FaRocket className="text-[#41f0a5] text-2xl" />
                    </div>

                    <div className="flex-1 space-y-6">
                      <h3 className="text-2xl md:text-3xl font-black text-gray-950 tracking-tight">
                        {step.number}. {step.title}
                      </h3>
                      <p className="text-lg text-gray-600 font-medium leading-relaxed">
                        {step.description}
                      </p>

                      {step.items && (
                        <div className="space-y-4">
                          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Definimos:</p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                            {step.items.map((item, i) => (
                              <li key={i} className="flex items-center gap-3 group/item">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#41f0a5] group-hover/item:scale-150 transition-transform" />
                                <span className="text-gray-600 font-medium group-hover/item:text-gray-950 transition-colors uppercase text-xs tracking-wider">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.footer && (
                        <div className="pt-4 border-t border-gray-100 flex items-center gap-3 text-[#3750f0] font-bold italic">
                          <FaCheck size={14} />
                          <p>{step.footer}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="py-16 md:py-24 border-t border-gray-100">
            <div className="text-center mb-10 md:mb-16 scroll-entrance">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-950 mb-4 tracking-tight">
                Beneficios del SEO
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto font-medium px-4">
                Un sitio web optimizado ofrece múltiples ventajas para el crecimiento de una empresa.
              </p>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto px-4">
              {[
                "Más visibilidad en Google",
                "Tráfico constante sin pagar publicidad",
                "Mayor generación de clientes potenciales",
                "Posicionamiento de marca a largo plazo",
                "Mejor retorno de inversión (ROI)"
              ].map((benefit, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-[#3750f0] to-[#41f0a5] rounded-xl p-5 md:p-6 text-white text-center md:text-left transition-all duration-300 shadow-[0_4px_10px_rgba(55,80,240,0.1)] hover:shadow-[0_12px_24px_rgba(55,80,240,0.2)] hover:-translate-y-1 block md:flex md:items-center scroll-entrance slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <p className="font-bold text-base md:text-lg tracking-wide w-full">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-16 md:mt-24 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 reveal bounce-in">
            <button 
              onClick={handleToggleSelection}
              className={`px-8 py-4 rounded-xl font-black transition-all duration-300 tracking-widest uppercase text-sm border-2 ${
                isSelected 
                  ? 'bg-gradient-to-r from-[#3750f0] to-[#41f0a5] text-white border-transparent shadow-[0_15px_30px_rgba(55,80,240,0.25)] animate-pulse'
                  : 'bg-white text-gray-950 border-gray-200 hover:border-[#3750f0] hover:scale-105 shadow-md'
              }`}
            >
              {isSelected ? '✓ Seleccionado para Cotizar' : 'Me interesa este servicio'}
            </button>
            <button
              onClick={() => onNavigate?.('portfolio')}
              className="px-8 py-4 bg-gray-950 text-white rounded-xl font-black shadow-xl hover:scale-105 transition-all duration-300 tracking-widest uppercase text-sm"
            >
              Ver resultados
            </button>
            <button
              onClick={() => onNavigate?.('services')}
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-950 rounded-xl font-black hover:border-[#3750f0] transition-all duration-300 tracking-widest uppercase text-sm"
            >
              Explorar otros servicios
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}


