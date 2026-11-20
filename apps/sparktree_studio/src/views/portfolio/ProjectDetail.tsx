'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Project, ContentBlock } from '@/data/projects';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { usePageMeta } from '@/hooks/usePageMeta';
import {
  ArrowLeft, Clock, User, Tag, Sparkles, Check,
  Award, Calendar,
  Play
} from 'lucide-react';

interface ProjectDetailProps {
  projectId?: string;
  onNavigate?: (page: string) => void;
  initialData?: Project;
  isPreview?: boolean;
}

export default function ProjectDetail({ projectId, onNavigate, initialData, isPreview = false }: ProjectDetailProps) {
  const projectRef = useRef<HTMLElement>(null);
  const [project, setProject] = useState<Project | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Fetch project data
  useEffect(() => {
    if (initialData) {
      setProject(initialData);
      setLoading(false);
      return;
    }

    if (!projectId) {
      setLoading(false);
      return;
    }

    async function fetchProject() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        const currentId = projectId || '';
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', currentId)
          .single();

        if (error) {
          const { data: retryData } = await supabase
            .from('projects')
            .select('*')
            .eq('slug', currentId)
            .single();

          if (retryData) {
            setProject(retryData as Project);
          }
        } else if (data) {
          setProject(data as Project);
        }
      } catch (err) {
        console.warn('Network error fetching project detail:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId, initialData]);

  // Hero Slider Logic
  const heroMedia = useMemo(() => {
    if (!project) return [];
    const images = project.heroImages && project.heroImages.length > 0
      ? project.heroImages
      : [project.heroImage];
    return images.filter(Boolean);
  }, [project]);

  // Combined Media Gallery
  const galleryMedia = useMemo(() => {
    if (!project) return [];
    const images = (project.resultImages || []) as (string | { url: string; category?: string })[];
    const additional = (project.additionalImages || []) as (string | { url: string; category?: string })[];

    return [...images, ...additional]
      .filter(Boolean)
      .map(item => {
        if (typeof item === 'string') return { url: item, category: '', type: undefined };
        return item as { url: string; category?: string; type?: "image" | "video" | "web" };
      });
  }, [project]);

  useEffect(() => {
    if (heroMedia.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroMedia.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroMedia]);

  const renderMedia = (url: string, alt: string, className: string = "w-full h-full object-cover", isGallery = false, type?: string) => {
    if (!url) return null;

    // Normalización de enlaces de Google Drive
    let finalUrl = url;
    const isDrive = url.includes('drive.google.com');
    if (isDrive) {
      if (url.includes('/view')) {
        finalUrl = url.replace('/view', '/preview');
      } else if (url.includes('/edit')) {
        finalUrl = url.replace('/edit', '/preview');
      } else if (url.includes('id=')) {
        const id = url.split('id=')[1]?.split('&')[0];
        if (id) finalUrl = `https://drive.google.com/file/d/${id}/preview`;
      }
    }

    // Detección robusta de YouTube
    const ytRegex = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const ytMatch = url.match(ytRegex);
    const videoId = (ytMatch && ytMatch[1].length === 11) ? ytMatch[1] : null;

    const isYouTube = !!videoId;
    const isVimeo = url.includes('vimeo.com');
    const isDirectVideo = url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm') || url.toLowerCase().endsWith('.ogg');
    const isExplicitVideo = type === 'video';
    const isExplicitWeb = type === 'web';

    if (isExplicitWeb) {
      return (
        <div className={className + " bg-white overflow-hidden"}>
          <iframe
            src={url}
            className="w-full h-full border-none"
            title={alt}
            allow="fullscreen"
          />
        </div>
      );
    }

    if ((isYouTube && videoId) || isExplicitVideo) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&hl=es&controls=1&rel=0`}
          className={className}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          title={alt}
        />
      );
    }

    if (isVimeo) {
      const vimeoId = url.split('/').pop();
      return (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=0&controls=1`}
          className={className}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={alt}
          loading="lazy"
        />
      );
    }

    if (isDrive) {
      return (
        <iframe
          src={finalUrl}
          className={className}
          allow="autoplay; fullscreen"
          allowFullScreen
          title={alt}
          loading="lazy"
        />
      );
    }

    if (isDirectVideo) {
      return (
        <video
          src={url}
          className={className}
          controls
          playsInline
          muted={!isGallery}
        >
          Tu navegador no soporta el video tag.
        </video>
      );
    }

    return <img src={url} alt={alt} className={className} />;
  };

  usePageMeta({
    title: project ? `${project.title} | Empresa SparkTree` : 'Proyecto | Empresa SparkTree',
    description: (project as any)?.seoDescription || project?.description || 'Detalle del proyecto de Empresa SparkTree',
    url: `https://sparktree.pe/portfolio/${(project as any)?.slug || projectId}`,
    image: project?.heroImage,
    type: 'article',
    schemaId: `ld-project-${projectId}`,
    jsonLd: project ? {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": project.title,
      "description": (project as any)?.seoDescription || project.description,
      "url": `https://sparktree.pe/portfolio/${(project as any)?.slug || projectId}`,
      "image": project.heroImage,
      "creator": {
        "@type": "Organization",
        "name": "SparkTree",
        "url": "https://sparktree.pe"
      },
      "about": project.category,
      "keywords": (project as any)?.seoKeywords || project.category,
      "provider": {
        "@type": "Organization",
        "name": project.client
      }
    } : undefined
  });

  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible', 'visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const timeoutId = setTimeout(() => {
      if (isPreview) {
        document.querySelectorAll('.scroll-entrance, .reveal').forEach(el => {
          el.classList.add('reveal-visible', 'visible');
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.transform = 'none';
        });
        return;
      }
      if (projectRef.current) {
        projectRef.current.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      }
      document.querySelectorAll('.scroll-entrance').forEach(el => observer.observe(el));
    }, isPreview ? 0 : 200);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [project, isPreview]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#41F0A5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Proyecto no encontrado</h1>
          <button onClick={() => onNavigate?.('portfolio')} className="px-6 py-3 bg-gray-900 text-white rounded-lg">Volver al portafolio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        .hero-slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1.5s ease-in-out; }
        .hero-slide.active { opacity: 1; z-index: 10; }
      `}</style>

      <section ref={projectRef} className="pt-24 pb-20 md:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-4xl mx-auto mb-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-6 scroll-entrance fade-up">
              <button onClick={() => onNavigate?.('portfolio')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#41F0A5] transition-colors">Portafolio</button>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span className="text-[10px] font-black text-[#41F0A5] uppercase tracking-widest leading-none">{project.category}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight scroll-entrance slide-up scroll-stagger-1 leading-[1.1]">{project.title}</h1>
            <div className="w-20 h-1.5 bg-[#41F0A5] mx-auto rounded-full scroll-entrance scale-x scroll-stagger-2"></div>
          </div>

          {/* Hero Slider Section */}
          <div className="mb-12 md:mb-16 lg:mb-20 px-4 sm:px-0">
            <div className={`relative bg-gray-50 rounded-[2.5rem] aspect-[16/9] sm:aspect-[16/8] md:aspect-[16/7] overflow-hidden shadow-2xl border border-gray-100 ${isPreview ? '' : 'scroll-entrance slide-up scroll-stagger-3'}`}>
              {heroMedia.length > 0 ? (
                <>
                  {heroMedia.map((url, idx) => (
                    <div key={idx} className={`hero-slide ${idx === currentHeroIndex ? 'active' : ''}`}>
                      {renderMedia(url, `Hero visual ${idx + 1}`)}
                    </div>
                  ))}
                  {heroMedia.length > 1 && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
                      {heroMedia.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentHeroIndex(idx)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${idx === currentHeroIndex ? 'bg-[#41F0A5] w-10' : 'bg-white/40 shadow-sm'}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                  <Sparkles className="w-16 h-16 text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Sin Multimedia</p>
                </div>
              )}
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Specs Bar */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8 md:p-10 mb-16 md:mb-24 grid grid-cols-2 lg:grid-cols-4 gap-10 scroll-entrance fade-up scroll-stagger-4">
              {[
                { icon: <User className="w-6 h-6" />, label: "Cliente", value: project.client },
                { icon: <Clock className="w-6 h-6" />, label: "Duración", value: project.duration },
                { icon: <Tag className="w-6 h-6" />, label: "Tipo", value: project.category },
                { icon: <Calendar className="w-6 h-6" />, label: "Proyecto", value: "Finalizado" }
              ].map((spec, i) => (
                <div key={i} className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#41F0A5]">{spec.icon}</div>
                  <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{spec.label}</p><p className="text-sm font-black text-gray-900">{spec.value}</p></div>
                </div>
              ))}
            </div>

            {/* Narratives */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-24 md:mb-32">
              <div className="scroll-entrance slide-left scroll-stagger-5">
                <div className="flex items-center gap-3 mb-6"><div className="w-8 h-1 bg-gray-200 rounded-full"></div><h3 className="text-2xl font-black text-gray-900 tracking-tight">El Desafío</h3></div>
                <p className="text-gray-500 leading-[1.8] font-medium text-lg">{project.challenge}</p>
              </div>
              <div className="scroll-entrance slide-right scroll-stagger-5">
                <div className="flex items-center gap-3 mb-6"><div className="w-8 h-1 bg-[#41F0A5] rounded-full"></div><h3 className="text-2xl font-black text-gray-900 tracking-tight">Estrategia Sparktree</h3></div>
                <div className="bg-[#41F0A5]/5 border border-[#41F0A5]/10 p-8 rounded-[2rem]"><p className="text-gray-600 leading-[1.8] font-medium text-lg">{project.solution}</p></div>
              </div>
            </div>

            {/* Impact Quote */}
            <div className="max-w-3xl mx-auto mb-24 md:mb-32 text-center reveal">
              <p className="text-2xl md:text-4xl font-black text-gray-800 leading-tight tracking-tight italic">"{project.description}"</p>
            </div>

            {/* === Rich Content Blocks (Publicación) === */}
            {((project as any).contentBlocks as ContentBlock[] | undefined)?.length ? (
              <div className="mb-24 md:mb-32 max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-12">
                  <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Sobre el Proyecto</h2>
                  <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
                </div>
                <div className="space-y-8">
                  {((project as any).contentBlocks as ContentBlock[]).map((block, idx) => {
                    switch (block.type) {
                      case 'heading':
                        const HeadingTag = `h${block.level || 2}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                        return (
                          <HeadingTag key={block.id || idx} className={`font-black text-gray-900 tracking-tight reveal ${
                            block.level === 2 ? 'text-3xl' : block.level === 3 ? 'text-2xl' : 'text-xl'
                          }`}>
                            {block.content}
                          </HeadingTag>
                        );
                      case 'paragraph':
                        return (
                          <p key={block.id || idx} className="text-gray-600 leading-[1.9] font-medium text-lg reveal">
                            {block.content}
                          </p>
                        );
                      case 'image':
                        return (
                          <figure key={block.id || idx} className="reveal">
                            <div className="rounded-[2rem] overflow-hidden shadow-lg border border-gray-100">
                              <img src={block.mediaUrl} alt={block.caption || block.content || 'Imagen del proyecto'} className="w-full h-auto" loading="lazy" />
                            </div>
                            {block.caption && (
                              <figcaption className="text-center text-xs text-gray-400 mt-3 font-medium italic">{block.caption}</figcaption>
                            )}
                          </figure>
                        );
                      case 'video':
                        return (
                          <div key={block.id || idx} className="reveal">
                            <div className="rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 aspect-video bg-gray-900">
                              {renderMedia(block.mediaUrl || '', block.caption || 'Video del proyecto', 'w-full h-full object-cover', true, 'video')}
                            </div>
                            {block.caption && (
                              <p className="text-center text-xs text-gray-400 mt-3 font-medium italic">{block.caption}</p>
                            )}
                          </div>
                        );
                      case 'quote':
                        return (
                          <blockquote key={block.id || idx} className="reveal border-l-4 border-[#41F0A5] pl-8 py-4 my-8">
                            <p className="text-xl md:text-2xl font-bold text-gray-700 italic leading-relaxed">
                              "{block.content}"
                            </p>
                          </blockquote>
                        );
                      case 'list':
                        return (
                          <ul key={block.id || idx} className="reveal space-y-3 pl-2">
                            {(block.items || []).map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-[#41F0A5] rounded-full mt-2 shrink-0"></div>
                                <span className="text-gray-600 font-medium text-lg leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            ) : null}

            {/* Results */}
            <div className="mb-24 md:mb-32">
              <div className="flex items-center justify-center gap-4 mb-12">
                <Award className="w-8 h-8 text-[#41F0A5]" />
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Resultados de Valor</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {(project.results || []).map((result, i) => (
                  <div key={i} className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-500 group reveal">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#41F0A5] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"><Check className="w-5 h-5 text-gray-900" /></div>
                      <p className="text-gray-700 font-bold leading-relaxed">{result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Universal Media Gallery (Simple Static Grid) */}
            <div className="mb-24 md:mb-32">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4 text-center">Galería de Medios</h2>
                <div className="w-12 h-1 bg-[#41F0A5] mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 md:auto-rows-[300px]">
                {galleryMedia.map((item, idx) => {
                  const url = item.url;
                  const category = item.category;
                  const isVideo = item.type === 'video' || (!item.type && (url.toLowerCase().endsWith('.mp4') || url.includes('drive.google.com') || url.includes('youtube') || url.includes('vimeo')));
                  const isWeb = item.type === 'web';
                  const isLarge = idx % 6 === 0;
                  const isMedium = idx % 4 === 0 && !isLarge;
                  const spanClass = isLarge ? "md:col-span-2 lg:col-span-4 lg:row-span-2" : isMedium ? "md:col-span-2 lg:col-span-2 lg:row-span-2" : "md:col-span-1 lg:col-span-2";

                  return (
                    <div
                      key={idx}
                      className={`${spanClass} relative bg-gray-50 rounded-[2.5rem] overflow-hidden group shadow-md border border-gray-100/50 hover:shadow-2xl transition-all duration-700 reveal`}
                    >
                      {renderMedia(url, `Medio ${idx + 1}`, "w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105", true, item.type)}

                      {/* Visual indicator for static videos (always visible) */}
                      {isVideo && (
                        <div className="absolute top-6 left-6 z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 text-white">
                            <Play className="w-6 h-6 fill-white" />
                          </div>
                        </div>
                      )}

                      {/* Hover indicator for media type - Minimalist Redesign with Category */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-start p-10 pointer-events-none">
                        <div className="relative overflow-hidden w-full">
                          {category && (
                            <div className="text-[#41F0A5] text-[10px] font-black tracking-[0.2em] uppercase mb-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                              {category}
                            </div>
                          )}
                          <span className="text-[11px] font-black text-white uppercase tracking-[0.25em] whitespace-nowrap block mb-1">
                            {isWeb ? 'Ver Sitio Web' : isVideo ? 'Ver Video' : 'Ver Imagen'}
                          </span>
                          <div className="h-0.5 bg-[#41F0A5] w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mb-24 md:mb-32">
              <h4 className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10">Tecnologías Utilizadas</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {(project.technologies || []).map((tech, i) => (
                  <span key={i} className="px-6 py-2.5 bg-white border border-gray-100 rounded-full text-xs font-black text-gray-600 shadow-sm hover:border-[#41F0A5]/30 transition-all cursor-default">{tech}</span>
                ))}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="text-center pt-20 border-t border-gray-50">
              <button onClick={() => onNavigate?.('portfolio')} className="inline-flex items-center gap-3 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors mb-16"><ArrowLeft className="w-4 h-4" />Ver otros proyectos</button>
              <div className="bg-[#41F0A5] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl group">
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight uppercase">Elevamos tu marca <br /> al siguiente nivel</h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                    <button onClick={() => onNavigate?.('contact')} className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl">Iniciar Proyecto</button>
                    <button onClick={() => onNavigate?.('services')} className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-md">Nuestras Soluciones</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
