'use client';

import { ArrowLeft, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function TendenciasMarketingDigital2025() {
  const router = useRouter();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
    }).format(date);
  };

  const title = 'Tendencias de Marketing Digital 2025';
  const published_date = '2025-10-15';

  usePageMeta({
    title: `${title} | Sparktree`,
    description: 'Las tendencias clave de marketing digital para 2025 y cómo preparar tu estrategia para liderar en tu sector.',
    url: typeof window !== 'undefined' ? `${window.location.origin}/blog/tendencias-marketing-digital-2025` : undefined,
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      datePublished: published_date,
      author: { '@type': 'Organization', name: 'Sparktree' },
      publisher: { '@type': 'Organization', name: 'Sparktree' },
    },
  });

  return (
    <div className="pt-20">
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <button onClick={() => router.push('/blog')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8">
            <ArrowLeft size={20} />
            <span>Volver al blog</span>
          </button>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">{title}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={18} />
              <time dateTime={published_date}>{formatDate(published_date)}</time>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed mb-6">
              Un resumen de las principales tendencias que marcarán el marketing digital en 2025 y cómo prepararte para aplicarlas en tu negocio.
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">1. IA en creación de contenido</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              La personalización basada en IA será esencial para mejorar conversiones y eficiencia en campañas.
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">2. Búsqueda multimodal</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Optimiza para búsquedas por voz e imagen, cuidando datos estructurados y accesibilidad.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
