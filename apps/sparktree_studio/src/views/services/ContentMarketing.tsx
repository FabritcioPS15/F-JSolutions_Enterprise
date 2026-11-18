'use client';

import { useEffect, useRef, useState } from 'react';
import { FaRocket, FaCheck, FaPenNib, FaCamera, FaHashtag, FaUsers } from 'react-icons/fa6';
import PageBanner from '@/components/ui/PageBanner';
import { isServiceSelected, toggleServiceSelection } from '@/lib/servicesStore';

interface ServicePageProps {
  onNavigate?: (page: string) => void;
}

export default function ServiceContentMarketing({ onNavigate }: ServicePageProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Servicios', path: '/services' },
    { label: 'Marketing de contenido' }
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
    setIsSelected(isServiceSelected('Marketing de contenido'));

    const handleServiceChange = () => {
      setIsSelected(isServiceSelected('Marketing de contenido'));
    };
    window.addEventListener('sparktree_services_changed', handleServiceChange);
    return () => window.removeEventListener('sparktree_services_changed', handleServiceChange);
  }, []);

  const handleToggleSelection = () => {
    toggleServiceSelection('Marketing de contenido');
  };

  const services = [
    {
      icon: FaPenNib,
      title: "Redacción Creativa",
      description: "Artículos, blogs y copies persuasivos que conectan con tu audiencia y posicionan tu marca."
    },
    {
      icon: FaCamera,
      title: "Producción Audiovisual",
      description: "Fotografía y videos de alta calidad diseñados para captar la atención en redes y web."
    },
    {
      icon: FaHashtag,
      title: "Gestión de Redes Sociales",
      description: "Planificación y creación de contenidos optimizados para Instagram, TikTok, LinkedIn y más."
    },
    {
      icon: FaUsers,
      title: "Estrategia de Audiencia",
      description: "Analizamos tu mercado para crear mensajes que conviertan seguidores en clientes leales."
    }
  ];

  const processSteps = [
    {
      number: "1",
      title: "Investigación y análisis",
      description: "Estudiamos tu marca, tu audiencia objetivo y tu competencia para encontrar tu voz.",
      items: ["análisis de tendencias", "definición de tono", "estudio de mercado", "buyer personas"]
    },
    {
      number: "2", 
      title: "Planificación estratégica",
      description: "Creamos un calendario editorial con formatos y temáticas alineadas a tus objetivos.",
      items: ["calendario de contenidos", "storytelling", "definición de canales", "frecuencia"]
    },
    {
      number: "3",
      title: "Creación y diseño",
      description: "Desarrollamos las piezas gráficas, redactamos los textos y producimos los videos.",
      items: ["diseño gráfico", "copywriting", "edición de video", "fotografía"]
    },
    {
      number: "4",
      title: "Publicación y medición",
      description: "Distribuimos el contenido y medimos el impacto para ajustar la estrategia en tiempo real.",
      items: ["distribución", "análisis de engagement", "optimización", "reportes"],
      footer: "Contenido que genera conversaciones y ventas"
    }
  ];

  return (
    <div className="pt-[72px]">
      <PageBanner 
        title="Marketing de Contenido" 
        subtitle="Conecta con tu audiencia a través de historias, diseño y contenido de valor."
        breadcrumbs={breadcrumbs}
      />

      <section ref={rootRef as any} className="relative py-16 md:py-24 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#41f0a5]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3750f0]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <h1 className="text-4xl md:text-6xl font-black text-gray-950 mb-8 tracking-tight reveal">
              Contenido que <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">Enamora y Convierte</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="space-y-8 reveal slide-left">
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                En el entorno digital actual, el contenido es el rey. No basta con estar presente, necesitas captar la atención y aportar valor real a tus clientes potenciales.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Diseñamos estrategias de contenido a medida que educan, entretienen e inspiran a tu audiencia, guiándolos de manera natural hacia la decisión de compra.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed font-semibold text-gray-900">
                Desde artículos de blog que mejoran tu SEO hasta reels virales en Instagram o TikTok, nos encargamos de que tu marca siempre tenga algo interesante que decir.
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <button 
                  onClick={() => {
                    if (!isSelected) handleToggleSelection();
                    onNavigate?.('contact');
                  }}
                  className="px-10 py-5 bg-[#3750f0] text-white rounded-2xl font-black shadow-[0_20px_40px_rgba(55,80,240,0.3)] hover:scale-105 transition-all duration-500 hover:shadow-[0_25px_50px_rgba(55,80,240,0.4)] tracking-widest uppercase text-sm"
                >
                  Consulta gratuita
                </button>
                <button
                  onClick={handleToggleSelection}
                  className={`px-10 py-5 rounded-2xl font-black tracking-widest uppercase text-sm transition-all duration-300 border-2 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-[#3750f0] to-[#41f0a5] text-white border-transparent shadow-[0_10px_20px_rgba(55,80,240,0.15)] animate-pulse'
                      : 'bg-white text-gray-950 border-gray-200 hover:border-[#3750f0] hover:scale-105 shadow-sm'
                  }`}
                >
                  {isSelected ? '✓ Seleccionado' : 'Añadir a mi Cotización'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 reveal scale-up">
              {services.map((service, idx) => (
                <div key={idx} className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#41f0a5]/30 transition-all duration-300 hover:shadow-xl group">
                  <div className="w-12 h-12 bg-gray-950 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="text-[#41f0a5] text-xl" />
                  </div>
                  <h3 className="font-bold text-gray-950 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="py-24 border-t border-gray-100">
            <div className="text-center mb-20 scroll-entrance">
              <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-6 tracking-tight">
                Nuestro proceso creativo
              </h2>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto font-medium">
                Metodología que garantiza consistencia y calidad en cada publicación.
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
                          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Incluye:</p>
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

          <div className="mt-24 flex flex-col sm:flex-row justify-center items-center gap-6 reveal bounce-in">
            <button 
              onClick={handleToggleSelection}
              className={`px-10 py-5 rounded-2xl font-black tracking-widest uppercase text-sm border-2 transition-all duration-300 ${
                isSelected 
                  ? 'bg-gradient-to-r from-[#3750f0] to-[#41f0a5] text-white border-transparent shadow-[0_15px_30px_rgba(55,80,240,0.25)] animate-pulse'
                  : 'bg-white text-gray-950 border-gray-200 hover:border-[#3750f0] hover:scale-105 shadow-md'
              }`}
            >
              {isSelected ? '✓ Seleccionado para Cotizar' : 'Me interesa este servicio'}
            </button>
            <button 
              onClick={() => onNavigate?.('portfolio')}
              className="px-10 py-5 bg-gray-950 text-white rounded-2xl font-black shadow-xl hover:scale-105 transition-all duration-500 tracking-widest uppercase text-sm"
            >
              Ver casos de éxito
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
