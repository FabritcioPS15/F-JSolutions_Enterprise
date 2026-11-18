'use client';

import { useEffect, useRef, useState } from 'react';
import { FaRocket, FaCheck } from 'react-icons/fa6';
import PageBanner from '@/components/ui/PageBanner';
import { usePageMeta } from '@/hooks/usePageMeta';
import { isServiceSelected, toggleServiceSelection } from '@/lib/servicesStore';

interface ServicePageProps {
  onNavigate?: (page: string) => void;
}

export default function ServiceWeb({ onNavigate }: ServicePageProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Servicios', path: '/services' },
    { label: 'Diseño Web' }
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
    setIsSelected(isServiceSelected('Diseño Web'));

    const handleServiceChange = () => {
      setIsSelected(isServiceSelected('Diseño Web'));
    };
    window.addEventListener('sparktree_services_changed', handleServiceChange);
    return () => window.removeEventListener('sparktree_services_changed', handleServiceChange);
  }, []);

  const handleToggleSelection = () => {
    toggleServiceSelection('Diseño Web');
  };

  usePageMeta({
    title: 'Diseño Web Profesional | SparkTree - Agencia Marketing Digital Lima',
    description: 'Creamos sitios web personalizados y optimizados para SEO en Lima. Diseño responsive, desarrollo moderno y experiencia de usuario excepcional para tu negocio. ¡Transforma tu presencia digital! Especialistas en diseño web Lima, desarrollo web Perú, páginas web profesionales, diseño responsive, SEO web, experiencia usuario UX, agencia web, sitio web empresarial.',
    url: 'https://sparktree.pe/services/web',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Diseño Web Profesional",
      "description": "Servicio de diseño y desarrollo web personalizado con optimización SEO incluida",
      "provider": {
        "@type": "Organization",
        "name": "SparkTree",
        "url": "https://sparktree.pe"
      },
      "serviceType": "Web Design",
      "areaServed": "Lima, Perú",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Servicios de Diseño Web",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Diseño Web Personalizado"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Desarrollo Web Responsive"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Optimización SEO"
            }
          }
        ]
      }
    }
  });

  const processSteps = [
    {
      number: "1",
      title: "Análisis y estrategia",
      description: "Primero analizamos el negocio, el mercado y los objetivos del proyecto.",
      items: ["objetivos del sitio web", "público objetivo", "estructura del contenido", "estrategia digital"]
    },
    {
      number: "2",
      title: "Arquitectura y planificación del sitio",
      description: "Creamos la estructura del sitio web, organizando todas las páginas y secciones para asegurar una navegación clara y eficiente.",
      items: ["mapa del sitio", "jerarquía de contenido", "estructura de navegación"]
    },
    {
      number: "3",
      title: "Diseño visual (UI / UX)",
      description: "Diseñamos la apariencia visual del sitio web teniendo en cuenta:",
      items: ["identidad de marca", "experiencia de usuario", "diseño moderno y profesional", "navegación intuitiva"],
      footer: "El objetivo es que el sitio sea atractivo, funcional y fácil de usar"
    },
    {
      number: "4",
      title: "Desarrollo web",
      description: "En esta etapa construimos el sitio web utilizando tecnologías modernas y optimizadas.",
      items: ["velocidad de carga", "adaptabilidad móvil (Responsive)", "SEO técnico", "seguridad y rendimiento"]
    },
    {
      number: "5",
      title: "Optimización SEO inicial",
      description: "Implementamos las bases para el posicionamiento en buscadores. Esto incluye:",
      items: ["optimización de estructura", "uso de palabras clave", "optimización de imágenes", "velocidad de carga", "etiquetas SEO"],
      footer: "Esto permite que el sitio tenga mejores oportunidades de posicionarse en Google"
    },
    {
      number: "6",
      title: "Pruebas y lanzamiento",
      description: "Antes de publicar el sitio realizamos pruebas para garantizar que todo funcione correctamente. Revisamos:",
      items: ["compatibilidad con navegadores", "funcionamiento en dispositivos móviles", "enlaces y formularios", "rendimiento del sitio"],
      footer: "Finalmente publicamos el sitio y lo dejamos listo para su uso"
    }
  ];

  const benefits = [
    {
      title: "Mayor visibilidad en Google",
      description: "Una página web optimizada para SEO (Search Engine Optimization) permite que tu negocio aparezca cuando los clientes buscan tus servicios en internet."
    },
    {
      title: "Generación constante de clientes potenciales",
      description: "Un sitio web bien estructurado puede atraer visitantes interesados que luego se convierten en clientes potenciales o ventas."
    },
    {
      title: "Fortalece la imagen de marca",
      description: "Un diseño web profesional transmite credibilidad, confianza y profesionalismo, aspectos clave para cualquier empresa."
    },
    {
      title: "Mejora la experiencia del usuario",
      description: "Un sitio optimizado permite que los visitantes encuentren rápidamente la información que necesitan, mejorando su experiencia y aumentando las posibilidades de conversión."
    },
    {
      title: "Escalabilidad y crecimiento",
      description: "Una página web puede crecer junto con tu negocio, integrando nuevas funcionalidades como blog, e-commerce, reservas, automatización o integración con herramientas digitales."
    }
  ];

  return (
    <div className="pt-[72px]">
      <PageBanner 
        title="Diseño de Páginas Web Personalizadas" 
        subtitle="Tu presencia digital, diseñada para vender e impresionar."
        breadcrumbs={breadcrumbs}
      />

      <section ref={rootRef as any} className="relative py-16 md:py-24 overflow-hidden bg-white">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#41f0a5]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3750f0]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Main Hero View - Centered Intro */}
          <div className="text-center mb-16 md:mb-24">
            <h1 className="text-4xl md:text-6xl font-black text-gray-950 mb-8 tracking-tight reveal">
              Diseño de Páginas Web <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">Personalizadas</span>
            </h1>
          </div>

          {/* Intro Section - Split Layout */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="space-y-8 reveal slide-left">
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                En SparkTree Studio diseñamos páginas web estratégicas, modernas y optimizadas para SEO, pensadas para ayudar a las empresas en Lima y Perú a aumentar su visibilidad online, generar oportunidades de negocio y fortalecer su presencia digital con resultados medibles.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Una página web no solo es una tarjeta de presentación digital, sino una herramienta clave para atraer clientes, comunicar el valor de tu marca y generar ventas de manera constante.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed font-semibold text-gray-900">
                Nuestro enfoque combina diseño, estrategia, experiencia de usuario (UX), velocidad de carga y posicionamiento en buscadores, garantizando que tu sitio web no solo se vea bien, sino que también funcione como un activo digital que genere resultados reales para tu negocio.
              </p>
              
              <div className="pt-4">
                <button 
                  onClick={() => onNavigate?.('contact')}
                  className="px-10 py-5 bg-[#3750f0] text-white rounded-2xl font-black shadow-[0_20px_40px_rgba(55,80,240,0.3)] hover:scale-105 transition-all duration-500 hover:shadow-[0_25px_50px_rgba(55,80,240,0.4)] tracking-widest uppercase text-sm"
                >
                  Asesoría gratuita
                </button>
              </div>
            </div>

            {/* Layered Mockup Area */}
            <div className="relative flex justify-center items-center reveal scale-up">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#41f0a5]/20 to-[#3750f0]/10 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              
              <div className="w-full max-w-md rounded-3xl relative shadow-2xl overflow-hidden group z-10">
                <img 
                  src="/assets/service/PAGINA%20WEB%20SERVICIO.webp" 
                  alt="Diseño Web Profesional - SparkTree Agencia Digital" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Process Section */}
          <div className="py-24 border-t border-gray-100">
            <div className="text-center mb-20 scroll-entrance">
              <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-6 tracking-tight">
                Nuestro proceso de diseño y desarrollo web
              </h2>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto font-medium">
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
          <div className="py-24">
            <div className="text-center mb-16 scroll-entrance">
              <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-6 tracking-tight">
                Beneficios de tener una página web optimizada
              </h2>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto font-medium">
                Un sitio web optimizado ofrece múltiples ventajas para el crecimiento de una empresa.
              </p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {benefits.map((benefit, idx) => (
                <div 
                  key={idx} 
                  className="p-6 md:p-8 rounded-2xl md:rounded-[2rem] bg-gradient-to-r from-blue-500 to-[#41f0a5] text-white shadow-[0_10px_30px_rgba(65,240,165,0.2)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(65,240,165,0.3)] transition-all duration-500 scroll-entrance scale-up relative overflow-hidden group"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Subtle shimmer effect */}
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  
                  <div className="relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-white/90 font-medium leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-24 flex flex-col sm:flex-row justify-center items-center gap-6 reveal bounce-in">
            <button 
              onClick={handleToggleSelection}
              className={`px-10 py-5 rounded-2xl font-black transition-all duration-500 tracking-widest uppercase text-sm border-2 ${
                isSelected 
                  ? 'bg-gradient-to-r from-[#3750f0] to-[#41f0a5] text-white border-transparent shadow-[0_15px_30px_rgba(55,80,240,0.25)] animate-pulse'
                  : 'bg-white text-gray-950 border-gray-200 hover:border-gray-950 hover:scale-105 shadow-md'
              }`}
            >
              {isSelected ? '✓ Seleccionado para Cotizar' : 'Me interesa este servicio'}
            </button>
            <button 
              onClick={() => onNavigate?.('portfolio')}
              className="px-10 py-5 bg-gray-950 text-white rounded-2xl font-black shadow-xl hover:scale-105 transition-all duration-500 tracking-widest uppercase text-sm"
            >
              Ver portafolio de diseño
            </button>
            <button 
              onClick={() => onNavigate?.('services')}
              className="px-10 py-5 bg-white border-2 border-gray-100 text-gray-950 rounded-2xl font-black hover:border-[#41f0a5] transition-all duration-500 tracking-widest uppercase text-sm"
            >
              Explorar otros servicios
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}


