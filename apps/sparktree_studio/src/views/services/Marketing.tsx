'use client';

import { useEffect, useRef, useState } from 'react';
import { FaRocket, FaCheck, FaChartLine, FaBullhorn, FaEnvelope, FaGoogle } from 'react-icons/fa6';
import PageBanner from '@/components/ui/PageBanner';
import { isServiceSelected, toggleServiceSelection } from '@/lib/servicesStore';

interface ServicePageProps {
  onNavigate?: (page: string) => void;
}

export default function ServiceMarketing({ onNavigate }: ServicePageProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Servicios', path: '/services' },
    { label: 'Marketing Digital' }
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
    setIsSelected(isServiceSelected('Marketing Digital'));

    const handleServiceChange = () => {
      setIsSelected(isServiceSelected('Marketing Digital'));
    };
    window.addEventListener('sparktree_services_changed', handleServiceChange);
    return () => window.removeEventListener('sparktree_services_changed', handleServiceChange);
  }, []);

  const handleToggleSelection = () => {
    toggleServiceSelection('Marketing Digital');
  };

  const services = [
    {
      icon: FaBullhorn,
      title: "Redes Sociales",
      description: "Gestión completa de tus redes sociales con contenido estratégico y campañas de engagement."
    },
    {
      icon: FaEnvelope,
      title: "Email Marketing",
      description: "Campañas de email marketing automatizadas que nutren leads y fidelizan clientes."
    },
    {
      icon: FaGoogle,
      title: "Publicidad Pagada",
      description: "Campañas en Google Ads, Facebook Ads y plataformas especializadas con ROI medible."
    },
    {
      icon: FaChartLine,
      title: "Analítica y Reportes",
      description: "Seguimiento detallado de KPIs y métricas para optimizar estrategias continuamente."
    }
  ];

  const processSteps = [
    {
      number: "1",
      title: "Análisis y diagnóstico",
      description: "Evaluamos tu situación actual, competencia, audiencia y objetivos de negocio.",
      items: ["análisis de competencia", "definición de buyer personas", "establecimiento de KPIs", "auditoría digital"]
    },
    {
      number: "2", 
      title: "Estrategia digital",
      description: "Diseñamos una estrategia integral personalizada para tu negocio.",
      items: ["plan de contenidos", "calendario editorial", "estrategia de canales", "presupuesto optimizado"]
    },
    {
      number: "3",
      title: "Implementación y ejecución",
      description: "Lanzamos las campañas y activamos todas las estrategias definidas.",
      items: ["creación de contenido", "configuración de campañas", "automatización de procesos", "monitoreo inicial"]
    },
    {
      number: "4",
      title: "Optimización y crecimiento",
      description: "Analizamos resultados y ajustamos estrategias para maximizar el rendimiento.",
      items: ["análisis de métricas", "A/B testing", "optimización de presupuesto", "escalado de campañas exitosas"],
      footer: "Mejora continua basada en datos reales"
    }
  ];

  return (
    <div className="pt-[72px]">
      <PageBanner 
        title="Marketing Digital Estratégico" 
        subtitle="Conecta con tus clientes y haz crecer tu negocio."
        breadcrumbs={breadcrumbs}
      />

      <section ref={rootRef as any} className="relative py-16 md:py-24 overflow-hidden bg-white">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#41f0a5]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3750f0]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Main Hero View */}
          <div className="text-center mb-16 md:mb-24">
            <h1 className="text-4xl md:text-6xl font-black text-gray-950 mb-8 tracking-tight reveal">
              Marketing Digital <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">que Resulta</span>
            </h1>
          </div>

          {/* Intro Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="space-y-8 reveal slide-left">
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                En Spark Tree Studio creamos estrategias de marketing digital que conectan tu marca con el público adecuado en el momento preciso. No se trata solo de estar presente, sino de generar resultados medibles.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Combinamos creatividad con análisis de datos para diseñar campañas que aumentan tu visibilidad, generan leads calificados y maximizan tu retorno de inversión.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed font-semibold text-gray-900">
                Desde redes sociales hasta publicidad pagada, nuestro enfoque integral asegura que cada euro invertido en marketing trabaje para hacer crecer tu negocio de manera sostenible.
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

            {/* Services Grid */}
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

          {/* Process Section */}
          <div className="py-24 border-t border-gray-100">
            <div className="text-center mb-20 scroll-entrance">
              <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-6 tracking-tight">
                Nuestro proceso de marketing digital
              </h2>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto font-medium">
                Metodología probada que garantiza resultados y crecimiento sostenible.
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

          {/* Bottom Actions */}
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
