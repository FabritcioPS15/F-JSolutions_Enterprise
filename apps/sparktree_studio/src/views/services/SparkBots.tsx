'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, Bot, Users, BarChart3, ArrowRight, CheckCircle2, ShieldCheck, Globe, Cpu } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { isServiceSelected, toggleServiceSelection } from '@/lib/servicesStore';

interface SparkBotsProps {
  onNavigate?: (page: string) => void;
}

const SparkBots: React.FC<SparkBotsProps> = ({ onNavigate }) => {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSelected, setIsSelected] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsSelected(isServiceSelected('SparkBots'));

    const handleServiceChange = () => {
      setIsSelected(isServiceSelected('SparkBots'));
    };
    window.addEventListener('sparktree_services_changed', handleServiceChange);
    return () => window.removeEventListener('sparktree_services_changed', handleServiceChange);
  }, []);

  const handleToggleSelection = () => {
    toggleServiceSelection('SparkBots');
  };

  usePageMeta({
    title: 'SparkBots | Alquiler de Bots de IA para Atención al Cliente - SparkTree',
    description: 'Alquila bots de IA conversacional para WhatsApp y web. Atención 24/7, calificación automática de leads y agendamiento. Transforma tu servicio al cliente con SparkBots de SparkTree.',
    url: 'https://sparktree.pe/services/bots',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "SparkBots - IA Conversacional",
      "description": "Servicio de alquiler de bots de IA para atención al cliente automatizada",
      "provider": {
        "@type": "Organization",
        "name": "SparkTree",
        "url": "https://sparktree.pe"
      },
      "serviceType": "AI Chatbot Service",
      "areaServed": "Lima, Perú",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Servicios de Automatización con IA",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Bots para WhatsApp"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Atención Automatizada 24/7"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Calificación de Leads con IA"
            }
          }
        ]
      }
    }
  });

  const chatMessages = [
    { sender: 'SparktreeBot', text: '¡Hola! Soy el asistente virtual de Sparktree. ¿Cómo puedo ayudarte hoy con tu transformación digital?', type: 'bot' },
    { sender: 'Cliente', text: 'Hola, me interesa saber más sobre el desarrollo de software a medida.', type: 'client' },
    { sender: 'SparktreeBot', text: 'Excelente elección. Hemos desarrollado más de 50 sistemas robustos. ¿Para qué sector o industria sería tu proyecto?', type: 'bot' },
    { sender: 'Cliente', text: 'Es para una constructora, necesitamos gestionar inventarios y personal.', type: 'client' },
    { sender: 'SparktreeBot', text: 'Perfecto. Tenemos experiencia en Logística de Obra. ¿Te gustaría agendar una llamada con un consultor experto mañana a las 10:00 AM?', type: 'bot' },
  ];

  // Logic for Chat Slide
  useEffect(() => {
    if (currentSlide === 0) {
      const timer = setTimeout(() => {
        if (visibleMessages < chatMessages.length) {
          setVisibleMessages(prev => prev + 1);
        } else {
          // Wait 4 seconds after finishing chat and move to next slide
          setTimeout(() => {
            setCurrentSlide(1);
            setVisibleMessages(0);
          }, 4000);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visibleMessages, currentSlide]);

  // Logic for cycling slides manually or auto
  useEffect(() => {
    if (currentSlide === 1) {
      const timer = setTimeout(() => {
        setCurrentSlide(0);
      }, 8000); // Stay 8 seconds on Flow slide
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 text-emerald-400" />,
      title: "Respuesta Omnicanal",
      description: "Tus bots responden instantáneamente en WhatsApp, Messenger, Instagram y tu sitio web oficial."
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      title: "Calificación de Leads",
      description: "Filtra prospectos automáticamente según el presupuesto, interés y urgencia antes de pasar a un humano."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
      title: "Reportes en Tiempo Real",
      description: "Visualiza métricas de conversión, preguntas frecuentes y satisfacción del cliente en un solo dashboard."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "Seguridad Corporativa",
      description: "Encriptación de datos de extremo a extremo para proteger la información confidencial de tus clientes."
    },
    {
      icon: <Globe className="w-6 h-6 text-emerald-400" />,
      title: "Multilenguaje Natural",
      description: "Soporte para más de 50 idiomas con una comprensión semántica profunda de contextos y modismos."
    },
    {
      icon: <Cpu className="w-6 h-6 text-emerald-400" />,
      title: "Integración API",
      description: "Conecta SparkBots con tu CRM, calendario o base de datos actual mediante integraciones nativas."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Análisis de Marca",
      description: "Estudiamos la voz de tu empresa, tus productos y el tono con el que te comunicas con tus clientes."
    },
    {
      number: "02",
      title: "Entrenamiento IA",
      description: "Alimentamos a la IA con tu base de conocimientos específica para que no cometa errores y aprenda rápido."
    },
    {
      number: "03",
      title: "Despliegue Multiplataforma",
      description: "Lanzamos los bots en todos tus canales digitales para que la atención sea 24/7 y sin interrupciones."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
              <Bot className="w-4 h-4" />
              IA Conversacional Propietaria
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight scroll-entrance">
              No dejes que ningún <span className="text-emerald-500">Lead</span> se enfríe.
            </h1>
            <p className="text-gray-400 text-xl mb-10 leading-relaxed scroll-entrance delay-100">
              Presentamos <strong>SparkBots</strong>: La solución de IA que califica, responde y agenda citas 24/7 con el tono y la personalidad de tu marca. Ideal para empresas en Lima y Perú que buscan automatizar su atención al cliente.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 scroll-entrance delay-200">
              <button 
                onClick={() => {
                  if (!isSelected) handleToggleSelection();
                  onNavigate?.('contact');
                }}
                className="px-8 py-4 bg-emerald-500 text-black font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 flex items-center gap-2 group text-sm sm:text-base"
              >
                Alquilar SparkBot Ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={handleToggleSelection}
                className={`px-8 py-4 font-black rounded-2xl border transition-all flex items-center gap-2 hover:scale-105 active:scale-95 text-sm sm:text-base ${
                  isSelected 
                    ? 'bg-gradient-to-r from-[#3750f0] to-[#41f0a5] text-white border-transparent shadow-[0_15px_30px_rgba(55,80,240,0.25)] animate-pulse'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
                    Seleccionado ✓
                  </>
                ) : (
                  'Me interesa / Cotizar'
                )}
              </button>
              
              <button 
                onClick={() => {
                  const element = document.getElementById('preview');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all text-sm sm:text-base"
              >
                Ver Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section - Simulated UI */}
      <section id="preview" className="py-24 bg-gray-50 border-y border-gray-100 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6">
                Módulo 0{currentSlide + 1}
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight min-h-[80px]">
                {currentSlide === 0 ? "Así es como SparkBots atiende a tus clientes." : "Creación de Flujos Lógicos de Atención."}
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed min-h-[60px]">
                {currentSlide === 0 
                  ? "Nuestra interfaz simula una conversación humana natural. La IA entiende el contexto y califica al usuario automáticamente."
                  : "Diseña recorridos personalizados. Define qué sucede cuando un cliente pregunta por precios, soporte o ventas."}
              </p>
              
              <div className="flex gap-4 mb-8">
                {[0, 1].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentSlide(idx);
                      setVisibleMessages(0);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-12 bg-emerald-500' : 'w-4 bg-gray-300'}`}
                  />
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentSlide(0)}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${currentSlide === 0 ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Conversación Natural</h4>
                    <p className="text-sm text-gray-500">IA generativa que responde con empatía y precisión técnica.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentSlide(1)}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${currentSlide === 1 ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Flujos de Trabajo</h4>
                    <p className="text-sm text-gray-500">Automatiza la toma de decisiones y redirección de leads.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full relative min-h-[600px] flex items-center justify-center">
              {/* Slide 1: Chat Simulation (Phone Mockup) */}
              <div className={`transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) absolute inset-0 flex items-center justify-center ${currentSlide === 0 ? 'opacity-100 scale-100 rotate-0 translate-x-0' : 'opacity-0 scale-75 -rotate-12 -translate-x-full pointer-events-none'}`}>
                <div className="bg-gray-900 rounded-[2.5rem] p-4 shadow-2xl border border-gray-800 relative max-w-sm w-full overflow-hidden">
                  <div className="bg-gray-800 rounded-[2rem] overflow-hidden aspect-[9/16] relative flex flex-col">
                    {/* Chat Header */}
                    <div className="bg-gray-900/80 backdrop-blur-md p-4 flex items-center gap-3 border-b border-gray-700/50">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Bot className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h5 className="text-white font-bold text-sm">SparkBot Asistente</h5>
                        <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                          En línea ahora
                        </span>
                      </div>
                    </div>
                    
                    {/* Chat Body */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar bg-[url('https://i.pinimg.com/originals/97/c0/07/97c00754fd7d65451a4f0b2f34f6696d.jpg')] bg-cover bg-center bg-blend-overlay bg-gray-800/90">
                      {chatMessages.slice(0, visibleMessages).map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.type === 'bot' ? 'items-start' : 'items-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                          <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${msg.type === 'bot' ? 'text-emerald-400 ml-1' : 'text-indigo-300 mr-1'}`}>
                            {msg.sender}
                          </span>
                          <div className={`p-3 rounded-2xl text-xs max-w-[85%] shadow-lg border ${
                            msg.type === 'bot' 
                              ? 'bg-gray-900 text-white rounded-tl-none border-gray-700' 
                              : 'bg-emerald-500 text-black font-medium rounded-tr-none border-emerald-400'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {visibleMessages < chatMessages.length && (
                        <div className="flex gap-1 ml-1">
                          <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-gray-900/80 border-t border-gray-700/50 flex gap-2">
                      <div className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-[10px] text-gray-500 border border-gray-700">
                        Escribe un mensaje...
                      </div>
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-black" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide 2: Flow Builder (Logic Hub) */}
              <div className={`transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) absolute inset-0 flex items-center justify-center ${currentSlide === 1 ? 'opacity-100 scale-100 rotate-0 translate-x-0' : 'opacity-0 scale-125 rotate-12 translate-x-full pointer-events-none'}`}>
                <div className="w-full h-full relative flex items-center justify-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 overflow-hidden p-12">
                  {/* Central Node: Bot (Improved) */}
                  <div className="relative z-20">
                    <div className="w-40 h-40 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center border-2 border-gray-100 relative animate-bounce-subtle">
                      <div className="w-32 h-32 bg-gray-900 rounded-[2rem] flex items-center justify-center border-4 border-indigo-500">
                        <Bot className="w-16 h-16 text-emerald-400" />
                      </div>
                      <div className="absolute -bottom-4 bg-emerald-500 text-white text-[10px] font-black px-4 py-1 rounded-full shadow-lg uppercase tracking-tighter">
                        Active Node
                      </div>
                    </div>
                    
                    {/* Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-dashed border-indigo-200 rounded-full animate-[spin_20s_linear_infinite] opacity-50"></div>
                  </div>

                  {/* Dotted Connection Lines (Improved with animate-dash) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 50 50 Q 30 30 20 25" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2,2" fill="none" className="animate-dash" />
                    <path d="M 50 50 Q 70 30 80 25" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2,2" fill="none" className="animate-dash" />
                    <path d="M 50 50 Q 30 70 20 75" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2,2" fill="none" className="animate-dash" />
                    <path d="M 50 50 Q 70 70 80 75" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2,2" fill="none" className="animate-dash" />
                  </svg>

                  {/* Outer Nodes: Users (Matching the image style) */}
                  {/* User 1: Question */}
                  <div className="absolute top-[15%] left-[10%] animate-in fade-in slide-in-from-left duration-1000">
                    <div className="bg-white p-2 rounded-[2rem] shadow-2xl border-2 border-gray-50 flex flex-col items-center">
                      <div className="w-24 h-24 bg-gray-100 rounded-3xl overflow-hidden mb-3">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Usuario consultando sobre servicios" />
                      </div>
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center -mt-6 border-4 border-white">
                        <span className="text-white text-xs font-bold">?</span>
                      </div>
                      <div className="mt-2 bg-gray-100 px-3 py-1 rounded-lg text-[8px] font-bold text-gray-500 uppercase">Consulta</div>
                    </div>
                  </div>

                  {/* User 2: Success */}
                  <div className="absolute top-[15%] right-[10%] animate-in fade-in slide-in-from-right duration-1000 delay-200">
                    <div className="bg-white p-2 rounded-[2rem] shadow-2xl border-2 border-gray-50 flex flex-col items-center">
                      <div className="w-24 h-24 bg-emerald-100 rounded-3xl overflow-hidden mb-3">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="Cliente satisfecho con SparkBots" />
                      </div>
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center -mt-6 border-4 border-white">
                        <CheckCircle2 size={14} className="text-white" />
                      </div>
                      <div className="mt-2 bg-emerald-50 px-3 py-1 rounded-lg text-[8px] font-bold text-emerald-600 uppercase">Agendado</div>
                    </div>
                  </div>

                  {/* User 3: Success */}
                  <div className="absolute bottom-[15%] left-[10%] animate-in fade-in slide-in-from-left duration-1000 delay-400">
                    <div className="bg-white p-2 rounded-[2rem] shadow-2xl border-2 border-gray-50 flex flex-col items-center">
                      <div className="w-24 h-24 bg-indigo-50 rounded-3xl overflow-hidden mb-3">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bo" alt="Usuario calificado por IA" />
                      </div>
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center -mt-6 border-4 border-white">
                        <CheckCircle2 size={14} className="text-white" />
                      </div>
                      <div className="mt-2 bg-indigo-50 px-3 py-1 rounded-lg text-[8px] font-bold text-indigo-600 uppercase">Calificado</div>
                    </div>
                  </div>

                  {/* User 4: Processing */}
                  <div className="absolute bottom-[15%] right-[10%] animate-in fade-in slide-in-from-right duration-1000 delay-600">
                    <div className="bg-white p-2 rounded-[2rem] shadow-2xl border-2 border-gray-50 flex flex-col items-center">
                      <div className="w-24 h-24 bg-gray-50 rounded-3xl overflow-hidden mb-3 opacity-50 grayscale">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb" alt="Cliente en proceso de atención" />
                      </div>
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center -mt-6 border-4 border-white">
                        <span className="text-white text-xs font-bold">...</span>
                      </div>
                      <div className="mt-2 bg-gray-50 px-3 py-1 rounded-lg text-[8px] font-bold text-gray-400 uppercase">Pendiente</div>
                    </div>
                  </div>

                  {/* Background Accents */}
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent"></div>
                  <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Poder ilimitado para tu negocio.</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              SparkBots no es solo un chat automático, es un motor de crecimiento que trabaja mientras tú descansas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:bg-gray-900 hover:border-gray-800 transition-all duration-500 hover:-translate-y-2">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-emerald-500 group-hover:rotate-6 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 bg-gray-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 blur-[120px]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                El camino hacia la <br />automatización total.
              </h2>
              <div className="space-y-12">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-6 relative">
                    {index !== steps.length - 1 && (
                      <div className="absolute left-[27px] top-[70px] bottom-[-50px] w-[2px] bg-emerald-500/20"></div>
                    )}
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xl shrink-0">
                      {step.number}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                      <p className="text-gray-400 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop" 
                  alt="Tecnología de IA y automatización - SparkTree" 
                  className="rounded-[3rem] shadow-2xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute -bottom-10 -left-10 bg-emerald-500 p-8 rounded-[2rem] shadow-2xl max-w-[240px] hidden md:block animate-bounce-subtle">
                  <p className="text-black font-black text-2xl mb-1">98%</p>
                  <p className="text-black/70 text-xs font-bold uppercase tracking-widest">Satisfacción del usuario final</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Rental CTA */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-gray-900 rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_70%)]"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                ¿Listo para transformar <br />tu atención al cliente?
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Ofrecemos planes de alquiler mensual o implementación perpetua para empresas en Perú. Contáctanos hoy para recibir una consultoría gratuita sobre automatización con IA.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  Soporte 24/7
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  Cero Mantenimiento
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  ROI Garantizado
                </div>
              </div>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => {
                    if (!isSelected) handleToggleSelection();
                    onNavigate?.('contact');
                  }}
                  className="px-10 py-5 bg-emerald-500 text-black font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 text-base sm:text-lg"
                >
                  Solicitar Propuesta Comercial
                </button>
                <button 
                  onClick={handleToggleSelection}
                  className={`px-10 py-5 font-black rounded-2xl border transition-all flex items-center gap-2 hover:scale-105 active:scale-95 text-base sm:text-lg ${
                    isSelected 
                      ? 'bg-gradient-to-r from-[#3750f0] to-[#41f0a5] text-white border-transparent shadow-[0_15px_30px_rgba(55,80,240,0.25)] animate-pulse'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      Agregado a Cotización
                    </>
                  ) : (
                    'Añadir a mi Cotización'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SparkBots;
