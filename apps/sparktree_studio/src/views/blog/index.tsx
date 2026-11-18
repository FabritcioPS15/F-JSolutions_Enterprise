'use client';

import { useEffect, useRef, useState } from 'react';
import PageBanner from '@/components/ui/PageBanner';
import { usePageMeta } from '@/hooks/usePageMeta';

interface BlogProps {
  onViewPost: (slug: string) => void;
}

export default function Blog({ onViewPost }: BlogProps) {
  const blogRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState('');

  usePageMeta({
    title: 'Blog de Marketing Digital | SparkTree - Estrategias y Tendencias',
    description: 'Artículos sobre marketing digital, SEO, redes sociales, branding y estrategias de crecimiento para empresas en Perú. Contenido actualizado por expertos.',
    url: 'https://sparktree.pe/blog',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Blog de SparkTree",
      "description": "Artículos sobre marketing digital, SEO y estrategias de crecimiento",
      "url": "https://sparktree.pe/blog"
    }
  });

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Blog' }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const timeoutId = setTimeout(() => {
      if (blogRef.current) {
        const elements = blogRef.current.querySelectorAll('.reveal');
        elements.forEach(el => observer.observe(el));
      }

      const scrollElements = document.querySelectorAll('.scroll-entrance');
      scrollElements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Read query parameter ?q on mount and when history changes
  useEffect(() => {
    const readQuery = () => {
      const qp = new URLSearchParams(window.location.search);
      setQuery((qp.get('q') || '').trim());
    };
    readQuery();
    const onPop = () => readQuery();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const posts = [
    {
      id: 1,
      title: "Tendencias de Marketing Digital 2025",
      published_date: "2025-10-15",
      slug: "tendencias-marketing-digital-2025",
      category: "Marketing",
      read_time: "5 min"
    },
    {
      id: 2,
      title: "¿Cuales son las redes que más utilizan los E-commerce?",
      published_date: "2025-10-11",
      slug: "redes-sociales-ecommerce",
      category: "E-commerce",
      read_time: "4 min"
    },
    {
      id: 3,
      title: "El posicionamiento SEO como herramienta de crecimiento",
      published_date: "2025-10-11",
      slug: "posicionamiento-seo-crecimiento",
      category: "SEO",
      read_time: "6 min"
    },
    {
      id: 4,
      title: "Estrategias de contenido para redes sociales",
      published_date: "2025-10-11",
      slug: "estrategias-contenido-redes-sociales",
      category: "Redes Sociales",
      read_time: "3 min"
    },
    {
      id: 5,
      title: "Inteligencia Artificial en el Marketing Digital",
      published_date: "2025-10-08",
      slug: "ia-marketing-digital",
      category: "Tecnología",
      read_time: "7 min"
    },
    {
      id: 6,
      title: "Cómo aumentar la tasa de conversión de tu sitio web",
      published_date: "2025-10-05",
      slug: "aumentar-tasa-conversion",
      category: "Conversión",
      read_time: "5 min"
    }
  ];

  const queryTokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const filteredPosts = queryTokens.length === 0
    ? posts
    : posts.filter(p => {
      const haystack = `${p.title} ${p.category}`.toLowerCase();
      return queryTokens.every(t => haystack.includes(t));
    });

  return (
    <div className="pt-[72px]">
      <PageBanner 
        title="Blog" 
        subtitle="Entérate de las últimas novedades digitales que pueden ayudar a tu negocio a conseguir el alcance que necesitas."
        breadcrumbs={breadcrumbs}
      />
      <section ref={blogRef} data-blog-cursor className="py-12 md:py-20 cursor-none md:cursor-none">
        <div className="max-w-7xl mx-auto px-6">

          {/* Results when filtering by ?q */}
          {queryTokens.length > 0 ? (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Resultados para "{query}"
                </h2>
                <button
                  onClick={() => {
                    const qp = new URLSearchParams(window.location.search);
                    qp.delete('q');
                    const next = qp.toString() ? `?${qp.toString()}` : window.location.pathname;
                    window.history.replaceState(null, '', next);
                    setQuery('');
                  }}
                  className="text-sm text-gray-700 hover:text-gray-900 underline"
                >
                  Limpiar
                </button>
              </div>

              {filteredPosts.length === 0 ? (
                <p className="text-gray-600">No se encontraron artículos que coincidan.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="group cursor-pointer hover:scale-105 transition-all duration-500 smooth-exit"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-2xl hover:border-gray-300 transition-all duration-500 h-full flex flex-col">
                        <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 aspect-[16/9] flex items-center justify-center group-hover:from-gray-300 group-hover:to-gray-400 transition-all duration-500 overflow-hidden">
                          <span className="text-gray-500 group-hover:text-gray-700 transition-colors duration-500 text-sm">imagen</span>
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-gray-900 text-white text-xs rounded-full">{post.category}</span>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs text-gray-500">{formatDate(post.published_date)}</span>
                            <span className="text-xs text-gray-500">{post.read_time}</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-500 line-clamp-2">{post.title}</h3>
                          <button
                            onClick={() => onViewPost(post.slug)}
                            className="mt-auto w-full py-3 bg-gray-900 text-white text-sm rounded-none transition-all duration-300 ease-out hover:bg-black hover:shadow-lg group-hover:scale-105"
                          >
                            Leer artículo
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Posts Grid - Cards al principio */
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center scroll-entrance initial-visible hover:text-gray-700 hover:scale-105 transition-all duration-500 cursor-default">
                Artículos Recientes
              </h2>

              {/* Grid de 3 columnas para desktop, 1 para mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.slice(0, 3).map((post, index) => (
                  <div
                    key={post.id}
                    className="group cursor-pointer scroll-entrance initial-visible hover:scale-105 transition-all duration-500 smooth-exit"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-2xl hover:border-gray-300 transition-all duration-500 h-full flex flex-col">
                      {/* Imagen */}
                      <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 aspect-[16/9] flex items-center justify-center group-hover:from-gray-300 group-hover:to-gray-400 transition-all duration-500 overflow-hidden">
                        <span className="text-gray-500 group-hover:text-gray-700 transition-colors duration-500 text-sm">
                          imagen
                        </span>

                        {/* Badge de categoría */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-gray-900 text-white text-xs rounded-full">
                            {post.category}
                          </span>
                        </div>

                        {/* Overlay de hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                      </div>

                      {/* Contenido */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-gray-500">{formatDate(post.published_date)}</span>
                          <span className="text-xs text-gray-500">{post.read_time}</span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-500 line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                          Descubre las estrategias más efectivas para mejorar tu presencia digital y aumentar el engagement con tu audiencia.
                        </p>

                        <button
                          onClick={() => onViewPost(post.slug)}
                          className="w-full py-3 bg-gray-900 text-white text-sm rounded-none opacity-100 translate-y-0 transition-all duration-300 ease-out hover:bg-black hover:shadow-lg group-hover:scale-105"
                        >
                          Leer artículo
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured Post - Post destacado */}
          <div className="mb-16 scroll-entrance initial-visible">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center hover:text-gray-700 hover:scale-105 transition-all duration-500 cursor-default">
              Artículo Destacado
            </h2>

            <div className="group cursor-pointer hover:scale-105 transition-all duration-500 smooth-exit">
              <div
                className="bg-cover bg-center bg-no-repeat p-8 hover:shadow-2xl transition-all duration-500 relative overflow-visible rounded-2xl"
                style={{ backgroundImage: "url('/assets/fondo.webp')" }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Contenido de texto */}
                  <div className="space-y-6">
                    <div>
                      <span className="px-4 py-2 border border-white/30 bg-black/30 backdrop-blur-md text-white text-sm rounded-full mb-4 inline-block">
                        Destacado
                      </span>
                      <h3 className="text-3xl font-bold text-white mb-4 transition-colors duration-500 leading-tight">
                        {posts[0].title}
                      </h3>
                      <p className="text-gray-200 text-lg mb-4">
                        Una guía completa sobre las tendencias que están marcando el rumbo del marketing digital para el próximo año y cómo puedes prepararte.
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-300">
                      <span>{formatDate(posts[0].published_date)}</span>
                      <span>•</span>
                      <span>{posts[0].read_time} de lectura</span>
                      <span>•</span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full">{posts[0].category}</span>
                    </div>

                    <button
                      onClick={() => onViewPost(posts[0].slug)}
                      className="px-8 py-4 border border-white/60 bg-black/30 backdrop-blur-md text-white text-base rounded-lg transition-all duration-300 ease-out hover:bg-white/20 hover:shadow-xl hover:scale-105"
                    >
                      Leer artículo completo
                    </button>
                  </div>

                  {/* Imagen destacada */}
                  <div className="relative">
                    <div className="bg-gradient-to-br from-gray-700 to-gray-800 aspect-[4/3] flex items-center justify-center group-hover:from-gray-600 group-hover:to-gray-700 transition-colors duration-500 rounded-xl overflow-hidden transform group-hover:scale-105 transition-transform duration-500 border border-white/10 shadow-lg">
                      <span className="text-gray-400 group-hover:text-gray-200 transition-colors duration-500 text-lg">
                        Imagen destacada
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Todos los Artículos */}
          <div className="scroll-entrance initial-visible">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center hover:text-gray-700 hover:scale-105 transition-all duration-500 cursor-default">
              Más Artículos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.slice(3).map((post) => (
                <div key={post.id} className="group cursor-pointer scroll-entrance initial-visible hover:scale-105 transition-all duration-500 smooth-exit">
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-500 h-full">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-gray-500">{formatDate(post.published_date)}</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {post.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-500">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        Explora técnicas avanzadas y mejores prácticas para optimizar tu estrategia digital y obtener mejores resultados.
                      </p>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{post.read_time}</span>
                        <button
                          onClick={() => onViewPost(post.slug)}
                          className="px-6 py-2 bg-gray-900 text-white text-sm rounded-none transition-all duration-300 ease-out hover:bg-black hover:scale-105"
                        >
                          Leer más
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-20 scroll-entrance initial-visible">
            <div
              className="bg-cover bg-center bg-no-repeat text-white rounded-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl"
              style={{ backgroundImage: "url('/assets/fondo.webp')" }}
            >
              <h3 className="text-3xl font-bold mb-4 relative z-10">No te pierdas ningún artículo</h3>
              <p className="text-gray-200 mb-6 max-w-2xl mx-auto relative z-10">
                Suscríbete a nuestro newsletter y recibe las últimas tendencias y estrategias de marketing digital directamente en tu email.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative z-10">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 px-4 py-3 bg-white backdrop-blur-md border border-white/30 text-white placeholder:text-gray-400 rounded-lg focus:outline-none focus:border-white transition-colors"
                />
                <button className="px-8 py-3  text-white font-medium rounded-lg border border-white/60 bg-black/50 backdrop-blur-md hover:bg-black/30 hover:scale-105 hover:shadow-xl transition-all duration-300">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}