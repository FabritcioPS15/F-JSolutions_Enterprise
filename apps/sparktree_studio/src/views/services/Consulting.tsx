'use client';

import { useEffect, useRef, useState } from 'react';
import { FaRocket, FaCheck, FaLightbulb, FaChartLine, FaGear, FaUsers, FaTrophy } from 'react-icons/fa6';
import PageBanner from '@/components/ui/PageBanner';
import { isServiceSelected, toggleServiceSelection } from '@/lib/servicesStore';

interface ServicePageProps {
  onNavigate?: (page: string) => void;
}

export default function ServiceConsulting({ onNavigate }: ServicePageProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Servicios', path: '/services' },
    { label: 'Consultoría Digital' }
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
    setIsSelected(isServiceSelected('Consultoría'));

    const handleServiceChange = () => {
      setIsSelected(isServiceSelected('Consultoría'));
    };
    window.addEventListener('sparktree_services_changed', handleServiceChange);
    return () => window.removeEventListener('sparktree_services_changed', handleServiceChange);
  }, []);

  const handleToggleSelection = () => {
    toggleServiceSelection('Consultoría');
  };

  const consultingAreas = [
    {
      icon: FaLightbulb,
      title: "Transformación Digital",
      description: "Guía completa para digitalizar procesos y adaptar tu modelo de negocio al entorno digital."
    },
    {
      icon: FaChartLine,
      title: "Estrategia Digital",
      description: "Desarrollo de roadmaps tecnológicos alineados con tus objetivos de negocio y KPIs."
    },
    {
      icon: FaGear,
      title: "Optimización de Procesos",
      description: "Análisis y mejora de flujos de trabajo mediante automatización y herramientas digitales."
    },
    {
      icon: FaUsers,
      title: "Gestión del Cambio",
      description: "Acompañamiento en la transición cultural y capacitación de equipos para la adopción tecnológica."
    }
  ];

  const processSteps = [
    {
      number: "1",
      title: "Diagnóstico digital",
      description: "Evaluamos exhaustivamente tu situación actual identificando fortalezas, debilidades y oportunidades.",
      items: ["auditoría tecnológica", "análisis de procesos", "evaluación de madurez digital", "identificación de brechas"]
    },
    {
      number: "2", 
      title: "Estrategia personalizada",
      description: "Diseñamos una hoja de ruta digital específica para tus necesidades y objetivos de negocio.",
      items: ["definición de objetivos", "selección de tecnologías", "plan de implementación", "gestión de riesgos"]
    },
    {
      number: "3",
      title: "Implementación guiada",
      description: "Acompañamos la ejecución de la estrategia asegurando alineación y resultados medibles.",
      items: ["gestión de proyectos", "capacitación de equipos", "implementación gradual", "monitoreo continuo"]
    },
    {
      number: "4",
      title: "Optimización y escalado",
      description: "Medimos resultados y ajustamos la estrategia para maximizar el impacto y preparar el crecimiento.",
      items: ["métricas de éxito", "ajustes estratégicos", "escalado de soluciones", "mejora continua"],
      footer: "Transformación digital sostenible y escalable"
    }
  ];

  const benefits = [
    {
      title: "Reducción de Costos Operativos",
      description: "Automatización de procesos repetitivos y optimización de recursos tecnológicos."
    },
    {
      title: "Mejora de la Productividad",
      description: "Herramientas digitales que potencian la eficiencia y colaboración de equipos."
    },
    {
      title: "Ventaja Competitiva",
      description: "Posicionamiento estratégico mediante adopción temprana de tecnologías disruptivas."
    },
    {
      title: "Toma de Decisiones Informada",
      description: "Analytics y dashboards para visualización de datos en tiempo real."
    },
    {
      title: "Experiencia del Cliente Mejorada",
      description: "Digitalización de puntos de contacto para satisfacción y fidelización."
    },
    {
      title: "Agilidad y Adaptabilidad",
      description: "Capacidad para responder rápidamente a cambios del mercado y nuevas oportunidades."
    }
  ];

  return (
    <div className="pt-[72px]">
      <PageBanner 
        title="Consultoría Digital Estratégica" 
        subtitle="Transforma tu negocio para el futuro digital."
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
              Consultoría Digital <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">Transformadora</span>
            </h1>
          </div>

          {/* Intro Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="space-y-8 reveal slide-left">
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                En Spark Tree Studio somos tu socio estratégico en la transformación digital. Analizamos tu negocio, identificamos oportunidades y diseñamos estrategias personalizadas que integran tecnología de manera efectiva en tus operaciones.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Más que consultores, somos facilitadores del cambio que entienden tanto la tecnología como los negocios. Te ayudamos a navegar la complejidad digital con claridad y confianza.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed font-semibold text-gray-900">
                Nuestro enfoque se centra en resultados tangibles: reducción de costos, aumento de productividad, mejora de la experiencia del cliente y preparación para el futuro digital.
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <button 
                  onClick={() => {
                    if (!isSelected) handleToggleSelection();
                    onNavigate?.('contact');
                  }}
                  className="px-10 py-5 bg-[#3750f0] text-white rounded-2xl font-black shadow-[0_20px_40px_rgba(55,80,240,0.3)] hover:scale-105 transition-all duration-500 hover:shadow-[0_25px_50px_rgba(55,80,240,0.4)] tracking-widest uppercase text-sm"
                >
                  Agendar diagnóstico
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

            {/* Consulting Areas Grid */}
            <div className="grid grid-cols-2 gap-6 reveal scale-up">
              {consultingAreas.map((area, idx) => (
                <div key={idx} className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#41f0a5]/30 transition-all duration-300 hover:shadow-xl group">
                  <div className="w-12 h-12 bg-gray-950 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <area.icon className="text-[#41f0a5] text-xl" />
                  </div>
                  <h3 className="font-bold text-gray-950 mb-2">{area.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{area.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Process Section */}
          <div className="py-24 border-t border-gray-100">
            <div className="text-center mb-20 scroll-entrance">
              <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-6 tracking-tight">
                Nuestra metodología de consultoría
              </h2>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto font-medium">
                Proceso estructurado para garantizar transformación exitosa y sostenible.
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

          {/* Benefits Section */}
          <div className="py-24">
            <div className="text-center mb-16 scroll-entrance">
              <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-6 tracking-tight">
                Beneficios de la transformación digital
              </h2>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto font-medium">
                Resultados concretos que impactan positivamente tu negocio.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit, idx) => (
                <div 
                  key={idx} 
                  className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#41f0a5]/30 hover:shadow-xl transition-all duration-500 scroll-entrance scale-up relative overflow-hidden group"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#41f0a5]/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
                  
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-gray-950 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Success Metrics Section */}
          <div className="py-16 bg-gradient-to-r from-[#41f0a5]/10 to-[#3750f0]/10 rounded-[3rem] p-12">
            <div className="text-center mb-12">
              <FaTrophy className="text-5xl text-[#41f0a5] mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-950 mb-4">Resultados Comprobados</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Empresas que han confiado en nuestra consultoría han logrado mejoras significativas en sus indicadores clave.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
              <div className="space-y-2">
                <div className="text-4xl font-black text-[#41f0a5]">40%</div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">Reducción en costos operativos</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-black text-[#3750f0]">60%</div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">Mejora en productividad</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-black text-[#41f0a5]">85%</div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">Satisfacción del cliente</div>
              </div>
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
