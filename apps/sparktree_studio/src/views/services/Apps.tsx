'use client';

import { useEffect, useRef, useState } from 'react';
import { FaRocket, FaCheck, FaMobile, FaDesktop, FaCode, FaDatabase, FaShield } from 'react-icons/fa6';
import PageBanner from '@/components/ui/PageBanner';
import { isServiceSelected, toggleServiceSelection } from '@/lib/servicesStore';

interface ServicePageProps {
  onNavigate?: (page: string) => void;
}

export default function ServiceApps({ onNavigate }: ServicePageProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Servicios', path: '/services' },
    { label: 'Desarrollo de Aplicaciones' }
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
    setIsSelected(isServiceSelected('Desarrollo de Apps'));

    const handleServiceChange = () => {
      setIsSelected(isServiceSelected('Desarrollo de Apps'));
    };
    window.addEventListener('sparktree_services_changed', handleServiceChange);
    return () => window.removeEventListener('sparktree_services_changed', handleServiceChange);
  }, []);

  const handleToggleSelection = () => {
    toggleServiceSelection('Desarrollo de Apps');
  };

  const appTypes = [
    {
      icon: FaMobile,
      title: "Apps Móviles Nativas",
      description: "Aplicaciones nativas para iOS y Android con máximo rendimiento y acceso completo a las funcionalidades del dispositivo."
    },
    {
      icon: FaDesktop,
      title: "Apps de Escritorio",
      description: "Software de escritorio multiplataforma para Windows, Mac y Linux con interfaces modernas y eficientes."
    },
    {
      icon: FaCode,
      title: "Apps Web Progresivas",
      description: "PWAs que combinan lo mejor de web y móvil, funcionando offline con experiencia nativa."
    },
    {
      icon: FaDatabase,
      title: "Backend y APIs",
      description: "Arquitectura robusta del lado del servidor con APIs RESTful y GraphQL para conectar tus aplicaciones."
    }
  ];

  const processSteps = [
    {
      number: "1",
      title: "Descubrimiento y planificación",
      description: "Analizamos tus requisitos, definimos el alcance técnico y establecemos la arquitectura óptima.",
      items: ["análisis de requisitos", "diseño de arquitectura", "selección de tecnologías", "planificación de sprints"]
    },
    {
      number: "2", 
      title: "Diseño UX/UI",
      description: "Creamos prototipos interactivos y diseños atractivos que priorizan la experiencia del usuario.",
      items: ["wireframes y prototipos", "diseño de interfaz", "experiencia de usuario", "guías de estilo"]
    },
    {
      number: "3",
      title: "Desarrollo ágil",
      description: "Implementamos funcionalidades mediante metodologías ágiles con entregas incrementales.",
      items: ["desarrollo iterativo", "integración continua", "revisiones de código", "testing automatizado"]
    },
    {
      number: "4",
      title: "Despliegue y mantenimiento",
      description: "Lanzamos la aplicación y proporcionamos soporte continuo para asegurar su óptimo funcionamiento.",
      items: ["despliegue en producción", "monitoreo y analytics", "actualizaciones y mejoras", "soporte técnico 24/7"],
      footer: "Acompañamiento a largo plazo para tu éxito digital"
    }
  ];

  const technologies = [
    { name: "React Native", category: "Móvil" },
    { name: "Flutter", category: "Móvil" },
    { name: "Swift/Kotlin", category: "Nativo" },
    { name: "Electron", category: "Escritorio" },
    { name: "Node.js", category: "Backend" },
    { name: "Python", category: "Backend" },
    { name: "PostgreSQL", category: "Base de Datos" },
    { name: "MongoDB", category: "Base de Datos" }
  ];

  return (
    <div className="pt-[72px]">
      <PageBanner 
        title="Desarrollo de Aplicaciones a Medida" 
        subtitle="Transforma tus ideas en soluciones digitales potentes."
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
              Desarrollo de Aplicaciones <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">Innovadoras</span>
            </h1>
          </div>

          {/* Intro Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="space-y-8 reveal slide-left">
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                En Spark Tree Studio desarrollamos aplicaciones personalizadas que resuelven problemas reales y crean oportunidades de negocio. Desde apps móviles hasta sistemas de escritorio, cada solución está diseñada para escalar y evolucionar con tus necesidades.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Combinamos experiencia técnica con visión de negocio para crear aplicaciones que no solo funcionen perfectamente, sino que también impulsen el crecimiento y la eficiencia de tu empresa.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed font-semibold text-gray-900">
                Utilizamos las tecnologías más avanzadas y metodologías ágiles para entregar soluciones robustas, seguras y con experiencias de usuario excepcionales.
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <button 
                  onClick={() => {
                    if (!isSelected) handleToggleSelection();
                    onNavigate?.('contact');
                  }}
                  className="px-10 py-5 bg-[#3750f0] text-white rounded-2xl font-black shadow-[0_20px_40px_rgba(55,80,240,0.3)] hover:scale-105 transition-all duration-500 hover:shadow-[0_25px_50px_rgba(55,80,240,0.4)] tracking-widest uppercase text-sm"
                >
                  Cotizar proyecto
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

            {/* App Types Grid */}
            <div className="grid grid-cols-2 gap-6 reveal scale-up">
              {appTypes.map((app, idx) => (
                <div key={idx} className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#41f0a5]/30 transition-all duration-300 hover:shadow-xl group">
                  <div className="w-12 h-12 bg-gray-950 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <app.icon className="text-[#41f0a5] text-xl" />
                  </div>
                  <h3 className="font-bold text-gray-950 mb-2">{app.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{app.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies Section */}
          <div className="py-16 border-t border-gray-100">
            <div className="text-center mb-16 scroll-entrance">
              <h2 className="text-3xl md:text-4xl font-black text-gray-950 mb-6 tracking-tight">
                Tecnologías que dominamos
              </h2>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto font-medium">
                Utilizamos las mejores herramientas del mercado para garantizar calidad y rendimiento.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {technologies.map((tech, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl text-center hover:bg-[#41f0a5]/10 transition-colors duration-300 scroll-entrance scale-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="w-10 h-10 bg-gray-950 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FaCode className="text-[#41f0a5] text-sm" />
                  </div>
                  <h4 className="font-bold text-gray-950 text-sm">{tech.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{tech.category}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Process Section */}
          <div className="py-24 border-t border-gray-100">
            <div className="text-center mb-20 scroll-entrance">
              <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-6 tracking-tight">
                Nuestro proceso de desarrollo
              </h2>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto font-medium">
                Metodología ágil para entregar valor de forma rápida y consistente.
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

          {/* Security Section */}
          <div className="py-16 bg-gradient-to-r from-gray-950 to-gray-900 rounded-[3rem] p-12 text-white">
            <div className="text-center mb-12">
              <FaShield className="text-5xl text-[#41f0a5] mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">Seguridad y Calidad</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Implementamos las mejores prácticas de seguridad y calidad en cada fase del desarrollo para proteger tus datos y garantizar un rendimiento óptimo.
              </p>
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
              Ver proyectos
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
