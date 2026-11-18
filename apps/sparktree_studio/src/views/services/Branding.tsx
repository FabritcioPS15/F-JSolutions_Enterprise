'use client';

import { useEffect, useRef, useState } from 'react';
import PageBanner from '@/components/ui/PageBanner';
import { usePageMeta } from '@/hooks/usePageMeta';
import { FaRocket, FaCheck } from 'react-icons/fa6';
import { isServiceSelected, toggleServiceSelection } from '@/lib/servicesStore';

interface ServicePageProps {
  onNavigate?: (page: string) => void;
}

export default function ServiceBranding({ onNavigate }: ServicePageProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  usePageMeta({
    title: 'Branding Estratégico en Lima | SparkTree - Identidad Corporativa',
    description: 'Servicio de branding y diseño de identidad corporativa en Lima. Creamos marcas que conectan, destacan y venden. Logótipo, manual de marca y estrategia visual.',
    url: 'https://sparktree.pe/services/branding',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Branding Estratégico",
      "provider": { "@type": "Organization", "name": "SparkTree" },
      "description": "Servicio de branding y diseño de identidad corporativa para empresas",
      "url": "https://sparktree.pe/services/branding"
    }
  });

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Servicios', path: '/services' },
    { label: 'Branding' }
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
    setIsSelected(isServiceSelected('Branding'));

    const handleServiceChange = () => {
      setIsSelected(isServiceSelected('Branding'));
    };
    window.addEventListener('sparktree_services_changed', handleServiceChange);
    return () => window.removeEventListener('sparktree_services_changed', handleServiceChange);
  }, []);

  const handleToggleSelection = () => {
    toggleServiceSelection('Branding');
  };

  const processSteps = [
    {
      number: "1",
      title: "Análisis de marca y mercado",
      description: "Investigamos tu negocio, competencia y público objetivo.",
      items: ["objetivos del proyecto", "público objetivo", "análisis de la competencia"]
    },
    {
      number: "2",
      title: "Definición estratégica",
      description: "Creamos el ADN de marca: propósito, valores, personalidad y tono.",
      items: ["propósito de la marca", "valores y principios", "personalidad de marca", "tono de comunicación"],
      footer: "Definimos los elementos clave que guiarán la comunicación de tu marca"
    },
    {
      number: "3",
      title: "Diseño de identidad visual",
      description: "Desarrollamos logotipo, colores, tipografías y estilo visual.",
      items: ["logotipo profesional", "paleta de colores", "tipografías corporativas", "estilo de imágenes"],
      footer: "Todo lo necesario para que tu marca se vea profesional y coherente en todos los canales"
    },
    {
      number: "4",
      title: "Construcción del mensaje",
      description: "Definimos cómo se comunica tu marca en todos los canales.",
      items: ["propuesta de valor", "mensajes clave", "eslogan", "argumentos de venta"],
      footer: "Esto permite que tu marca se comunique de manera clara y coherente en todos los canales"
    },
    {
      number: "5",
      title: "Entrega y guía de uso",
      description: "Creamos un manual de marca para asegurar coherencia.",
      items: ["manual de marca completo", "guía de aplicación", "archivos finales", "sesión de entrega"]
    }
  ];

  return (
    <div className="pt-[72px]">
      <PageBanner
        title="Branding estratégico para empresas"
        subtitle="Creamos marcas que conectan, destacan y venden."
        breadcrumbs={breadcrumbs}
      />

      <section ref={rootRef as any} className="relative py-16 md:py-24 overflow-hidden bg-white">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3750f0]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#41f0a5]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Main Hero View - Centered Intro */}
          <div className="text-center mb-16 md:mb-24">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-950 mb-8 tracking-tight reveal">
              Branding estratégico para <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">empresas en Lima</span>
            </h1>
          </div>

          {/* Intro Section - Split Layout */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24 md:mb-32">
            <div className="space-y-6 reveal slide-left">
              <p className="text-lg text-gray-900 font-bold leading-relaxed">
                Creamos marcas que conectan, destacan y venden.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">
                En SparkTree Studio, desarrollamos estrategias de branding que van más allá del diseño. Construimos una identidad sólida que comunica claramente quién eres, qué haces y por qué deberían elegirte.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Ayudamos a las empresas a proyectar una imagen profesional, coherente y diferenciada en todos sus canales digitales.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Convertimos tu negocio en una marca memorable y de confianza. Más allá de un logo, definimos la voz, los valores y la personalidad que te diferenciarán de tu competencia.
              </p>

              <div className="pt-6 flex justify-center lg:justify-start">
                <button
                  onClick={() => onNavigate?.('contact')}
                  className="px-8 py-3.5 bg-[#3750f0] text-white rounded-xl font-bold tracking-wide shadow-[0_10px_20px_rgba(55,80,240,0.2)] hover:scale-105 transition-all duration-300 hover:shadow-[0_15px_30px_rgba(55,80,240,0.3)] text-sm md:text-base"
                >
                  Asesoría gratuita
                </button>
              </div>
            </div>

            {/* Illustration Area */}
            <div className="relative flex justify-center items-center reveal scale-up">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#3750f0]/20 to-[#41f0a5]/10 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="w-full max-w-md rounded-3xl relative shadow-2xl overflow-hidden group z-10">
                <img
                  src="/assets/service/BRANDING_SERVICIO.webp"
                  alt="Branding Estratégico - SparkTree"
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
          <div className="py-16 md:py-24 border-t border-gray-100">
            <div className="text-center mb-10 md:mb-16 scroll-entrance">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-950 mb-4 tracking-tight">
                Beneficios del branding
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto font-medium px-4">
                Un branding estratégico ofrece múltiples ventajas para el crecimiento de una empresa.
              </p>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto px-4">
              {[
                "Mayor reconocimiento de marca",
                "Imagen profesional y confiable",
                "Diferenciación frente a la competencia",
                "Conexión emocional con tu audiencia",
                "Base sólida para estrategias de marketing"
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
              className={`px-8 py-4 rounded-xl font-black transition-all duration-300 tracking-widest uppercase text-sm border-2 ${isSelected
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
              Ver portafolio
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


