import { usePageMeta } from '@/hooks/usePageMeta';
import { Target, Eye, Shield } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import { GrTechnology } from "react-icons/gr";
import { FaPaintbrush, FaChartSimple, FaArrowsToDot } from "react-icons/fa6";
import { TbTargetArrow } from "react-icons/tb";
import { GoPeople } from "react-icons/go";

interface NosotrosProps {
  onNavigate?: (page: string) => void;
}

export default function Nosotros({ onNavigate }: NosotrosProps) {
  usePageMeta({
    title: 'Nosotros | SparkTree - Hub Empresarial de Innovación Digital',
    description: 'Conoce la historia, misión y el equipo detrás de SparkTree. Somos el aliado que hace crecer tu negocio — en diseño, marketing y tecnología.',
  });

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Nosotros' }
  ];

  return (
    <div className="pt-[72px]">
      <PageBanner
        title="No somos una agencia."
        subtitle="Somos el aliado que hace crecer tu negocio — en diseño, marketing y tecnología."
        breadcrumbs={breadcrumbs}
      />

      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
            La mayoría de empresas contratan 4 o 5 proveedores distintos para resolver lo que SparkTree resuelve junto contigo. Menos fricción, más resultados, un solo equipo comprometido con tu crecimiento.
          </p>
        </div>
      </section>

      {/* Por qué existimos & Visión */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white p-10 md:p-12 rounded-3xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6"><Target className="w-10 h-10 text-emerald-500" /></div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Por qué existimos</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Creemos que cada empresa merece acceso a estrategia de alto nivel sin importar su tamaño. Democratizamos las herramientas, el talento y las metodologías que antes solo tenían las grandes corporaciones.
              </p>
            </div>

            <div className="bg-white p-10 md:p-12 rounded-3xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6"><Eye className="w-10 h-10 text-blue-500" /></div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Visión</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Ser el hub de crecimiento empresarial de referencia en Latinoamérica — reconocido por conectar marcas con oportunidades reales y medibles, no solo con presencia digital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestra Filosofía */}
      <section className="py-20 md:py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Nuestra filosofía</h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 border border-transparent hover:border-emerald-100">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                <TbTargetArrow className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resultados por encima de entregables</h3>
              <p className="text-gray-600 leading-relaxed">
                No te entregamos un sitio web ni una campaña. Te entregamos más clientes, mejor posicionamiento y procesos que escalan. Los entregables son el medio, nunca el fin.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 border border-transparent hover:border-blue-100">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                <GoPeople className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tu equipo externo, no un proveedor más</h3>
              <p className="text-gray-600 leading-relaxed">
                Nos integramos a tu operación, aprendemos tu industria y tomamos decisiones contigo. La diferencia entre un proveedor y un aliado se siente desde la primera reunión.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 border border-transparent hover:border-purple-100">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                <FaArrowsToDot className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Un ecosistema, no servicios sueltos</h3>
              <p className="text-gray-600 leading-relaxed">
                Tu marca, tu web, tu SEO y tu marketing deben hablar el mismo idioma. En SparkTree todo está conectado porque todo lo construimos juntos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#41f0a5]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3750f0]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Shield className="w-12 h-12 text-emerald-500 mx-auto mb-8 opacity-50" />
          <blockquote className="text-2xl md:text-4xl font-bold italic leading-tight mb-8">
            "Nuestros clientes no nos contratan para tener un sitio web o una campaña. Nos contratan para dejar de preocuparse por crecer y empezar a hacerlo."
          </blockquote>
          <cite className="text-emerald-400 font-bold uppercase tracking-widest text-sm not-italic">
            — Dirección SparkTree
          </cite>
        </div>
      </section>

      {/* Nuestras Áreas de Trabajo */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Nuestras áreas de trabajo</h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 border border-gray-100 rounded-3xl hover:border-emerald-200 transition-colors duration-300 hover:bg-emerald-50/30 group">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FaPaintbrush className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Diseño</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <button onClick={() => onNavigate?.('service-branding')} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:text-emerald-600 hover:border-emerald-300 hover:shadow-sm transition-all">Branding</button>
                <button onClick={() => onNavigate?.('service-web')} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:text-emerald-600 hover:border-emerald-300 hover:shadow-sm transition-all">Diseño Web</button>
              </div>
            </div>

            <div className="text-center p-8 border border-gray-100 rounded-3xl hover:border-blue-200 transition-colors duration-300 hover:bg-blue-50/30 group">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FaChartSimple className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Marketing</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <button onClick={() => onNavigate?.('service-seo')} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm transition-all">SEO</button>
                <button onClick={() => onNavigate?.('service-content')} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm transition-all">Contenido</button>
              </div>
            </div>

            <div className="text-center p-8 border border-gray-100 rounded-3xl hover:border-purple-200 transition-colors duration-300 hover:bg-purple-50/30 group">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <GrTechnology className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tecnología</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <button onClick={() => onNavigate?.('service-ti')} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:text-purple-600 hover:border-purple-300 hover:shadow-sm transition-all">TI</button>
                <button onClick={() => onNavigate?.('service-automation')} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:text-purple-600 hover:border-purple-300 hover:shadow-sm transition-all">Automatización</button>
                <button onClick={() => onNavigate?.('service-bots')} className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:text-purple-600 hover:border-purple-300 hover:shadow-sm transition-all">SparkBots</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
