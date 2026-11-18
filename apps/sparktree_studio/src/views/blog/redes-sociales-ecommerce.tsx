'use client';

import { ArrowLeft, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function RedesSocialesEcommerce() {
  const router = useRouter();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  const title = '¿Cuales son las redes que más utilizan los E-commerce?';
  const published_date = '2025-10-11';

  usePageMeta({
    title: `${title} | Sparktree`,
    description: 'Análisis de las redes sociales más efectivas para e-commerce y cómo aprovecharlas para vender más en 2025.',
    url: typeof window !== 'undefined' ? `${window.location.origin}/blog/redes-sociales-ecommerce` : undefined,
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
              Exploramos qué redes sociales aportan más tráfico y ventas a los comercios electrónicos en 2025, con recomendaciones prácticas.
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Redes clave para e-commerce</h2>
            <p className="text-gray-600 leading-relaxed mb-6">Instagram, TikTok y YouTube Shorts concentran gran atención y conversión en discovery commerce.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
