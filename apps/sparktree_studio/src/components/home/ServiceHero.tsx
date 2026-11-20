'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface Service {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  path: string;
}

const services: Service[] = [
  {
    title: 'Tu Equipo de Marketing Externo',
    subtitle: 'Outsourcing',
    description: 'No necesitas contratar un equipo interno. Nosotros somos tu departamento de marketing dedicado a resultados.',
    image: '/assets/heroimages/marketing-externo.webp',
    cta: 'Empezar ahora',
    path: 'contact'
  },
  {
    title: 'Automatización con IA (SaaS)',
    subtitle: 'SparkBots',
    description: 'Alquila nuestros bots inteligentes para atención al cliente y ventas. Automatiza tu área de respuestas 24/7.',
    image: '/assets/heroimages/automatizacion-ia.webp',
    cta: 'Ver SparkBots',
    path: 'service-ti'
  },
  {
    title: 'Diseño Web de Alto Impacto',
    subtitle: 'Presencia',
    description: 'Convertimos tu marca en una experiencia digital única que atrae y fideliza clientes.',
    image: '/assets/heroimages/diseno-web.webp',
    cta: 'Crear mi Web',
    path: 'service-web'
  },
  {
    title: 'Hub de Soluciones Tecnológicas',
    subtitle: 'Ingeniería',
    description: 'Desarrollamos software a medida y soluciones de IT que escalan con tu negocio. El motor técnico que tu empresa necesita.',
    image: '/assets/heroimages/soluciones-tecnologicas.webp',
    cta: 'Ver Soluciones',
    path: 'service-ti'
  }
];


const logos = [
  { name: 'Empresa 1', src: '/assets/EmpresasSparktreekeadas/logo1.webp' },
  { name: 'RTP San Cristóbal', src: '/assets/EmpresasSparktreekeadas/logo-rtp.webp' },
];



interface ServiceHeroProps {
  onNavigate?: (path: string) => void;
}

export const ServiceHero: React.FC<ServiceHeroProps> = ({ onNavigate }) => {

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-[#0a0a0a] text-white">

      {/* Background Slides */}
      {services.map((service, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />

          <img
            src={service.image}
            alt={service.title}
            className="h-full w-full object-cover object-center md:object-contain md:object-right scale-105 animate-slow-zoom"
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 flex h-full items-center px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          {services.map((service, index) => (
            <div
              key={index}
              className={`${index === currentSlide ? 'block animate-fade-in-up' : 'hidden'
                }`}
            >
              <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase border border-emerald-400 text-emerald-400 rounded-full">
                {service.subtitle}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                {service.title.split(' ').map((word, i) => (
                  <span key={i} className={i >= 2 ? 'text-emerald-400' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg leading-relaxed">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate?.(service.path)}
                  className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {service.cta}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>

            </div>
          ))}

          {/* Indicators */}
          <div className="mt-12 flex gap-3">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 10000);
                }}
                className={`h-1 transition-all duration-500 rounded-full ${index === currentSlide ? 'w-12 bg-emerald-400' : 'w-6 bg-gray-600'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Marcas de logos con carrusel y fondo de glassmorfismo*/}
      <div className="absolute bottom-0 left-0 w-full z-30 bg-black/40 backdrop-blur-lg border-t border-white/10 py-6 overflow-hidden group/marquee">
        <div className="flex w-max animate-marquee items-center">
          {Array.from({ length: 8 }, () => logos).flat().map((logo, index) => (
            <div
              key={index}
              className="mx-12 md:mx-20 shrink-0 flex items-center justify-center transition-all duration-500 cursor-pointer scale-100 hover:scale-110 select-none group/logo"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="h-20 md:h-20 w-auto max-w-none object-contain brightness-0 invert opacity-60 hover:opacity-100 transition-all duration-500"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.nextElementSibling) {
                    (target.nextElementSibling as HTMLElement).style.display = 'block';
                  }
                }}
              />
              <span className="hidden text-white font-bold text-xl md:text-2xl opacity-60 hover:opacity-100 transition-all duration-500">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>



      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-12.5%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }


        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        @keyframes slow-zoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s linear infinite alternate;
        }
      `}</style>
    </section>
  );
};
