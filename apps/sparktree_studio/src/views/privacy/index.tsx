'use client';

import { useEffect, useRef } from 'react';
import PageBanner from '@/components/ui/PageBanner';

interface PrivacyProps {
  onNavigate?: (page: string) => void;
}

export default function Privacy(_props: PrivacyProps) {
  const rootRef = useRef<HTMLElement>(null);

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Políticas de Privacidad' }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.1 });

    const timeoutId = setTimeout(() => {
      if (rootRef.current) {
        const elements = rootRef.current.querySelectorAll('.reveal');
        elements.forEach((el) => observer.observe(el));
      }
    }, 100);

    return () => { clearTimeout(timeoutId); observer.disconnect(); };
  }, []);

  return (
    <div className="pt-[72px]">
      <PageBanner
        title="Políticas de Privacidad"
        subtitle="Conoce cómo protegemos y manejamos tu información personal."
        breadcrumbs={breadcrumbs}
      />

      <section ref={rootRef as any} className="relative py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-gray-700 space-y-12">

          <div className="reveal slide-up">
            <h2 className="text-2xl font-black text-gray-950 mb-4">Responsables del tratamiento de datos</h2>
            <p className="leading-relaxed">El responsable del tratamiento de los datos personales es:</p>
            <ul className="mt-2 text-gray-600 font-medium space-y-1">
              <li><strong>SparkTree Studio</strong></li>
              <li>Agencia de Marketing Digital</li>
              <li>Ubicación: Lima, Perú</li>
              <li>Correo electrónico: sparktree.rs@gmail.com</li>
            </ul>
          </div>


          <div className="reveal slide-up">
            <h2 className="text-2xl font-black text-gray-950 mb-4">Información que recopilamos</h2>
            <p className="leading-relaxed mb-4">Podemos recopilar los siguientes datos personales a través de nuestro sitio web:</p>

            <h3 className="font-bold text-gray-900 mb-2">Información proporcionada por el usuario</h3>
            <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-600">
              <li>Nombre y apellidos</li>
              <li>Correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Nombre de empresa</li>
              <li>Información relacionada con el proyecto o consulta</li>
            </ul>

            <h3 className="font-bold text-gray-900 mb-2">Estos datos se recopilan cuando el usuario:</h3>
            <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-600">
              <li>Completa formularios de contacto</li>
              <li>Solicita información o asesoría</li>
              <li>Se comunica con nosotros</li>
            </ul>

            <h3 className="font-bold text-gray-900 mb-2">Información recopilada automáticamente</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Dirección IP</li>
              <li>Tipo de navegador</li>
              <li>Dispositivo utilizado</li>
              <li>Páginas visitadas dentro del sitio</li>
              <li>Tiempo de navegación</li>
              <li>Esto se obtiene mediante cookies y herramientas de análisis</li>
            </ul>
          </div>

          <div className="reveal slide-up">
            <h2 className="text-2xl font-black text-gray-950 mb-4">Finalidad del uso de la información</h2>
            <p className="leading-relaxed mb-4">Los datos personales recopilados serán utilizados para:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Atender consultas y solicitudes de contacto</li>
              <li>Brindar información sobre nuestros servicios</li>
              <li>Elaborar propuestas comerciales</li>
              <li>Mejorar la experiencia del usuario en el sitio web</li>
              <li>Analizar el comportamiento de navegación</li>
              <li>Enviar comunicaciones informativas (si el usuario lo autoriza)</li>
            </ul>
          </div>

          <div className="reveal slide-up">
            <h2 className="text-2xl font-black text-gray-950 mb-4">Uso de cookies</h2>
            <p className="leading-relaxed mb-4">Nuestro sitio web utiliza cookies para mejorar la experiencia del usuario.</p>
            <p className="leading-relaxed mb-4">Las cookies permiten:</p>
            <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-600">
              <li>Recordar preferencias del usuario</li>
              <li>Analizar el tráfico web</li>
              <li>Personalizar el contenido</li>
            </ul>
            <p className="leading-relaxed text-sm text-gray-500 italic">El usuario puede desactivar las cookies desde la configuración de su navegador.</p>
          </div>

          <div className="reveal slide-up">
            <h2 className="text-2xl font-black text-gray-950 mb-4">Protección de la información</h2>
            <p className="leading-relaxed mb-4">
              En SparkTree Studio, implementamos medidas de seguridad técnicas y organizativas para proteger los datos personales contra:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-600">
              <li>Acceso no autorizado</li>
              <li>Pérdida o alteración de información</li>
              <li>Uso indebido</li>
            </ul>
            <p className="leading-relaxed text-sm text-gray-500 italic">
              Sin embargo, ningún sistema es completamente seguro, por lo que no podemos garantizar seguridad absoluta.
            </p>
          </div>

          <div className="reveal slide-up">
            <h2 className="text-2xl font-black text-gray-950 mb-4">Compartición de datos</h2>
            <p className="leading-relaxed mb-4">
              No vendemos, alquilamos ni compartimos datos personales con terceros, salvo en los siguientes casos:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Cuando sea necesario para prestar nuestros servicios</li>
              <li>Por obligación legal</li>
              <li>Con proveedores tecnológicos que apoyan la operación del sitio (ej. hosting, analítica)</li>
            </ul>
          </div>

          <div className="reveal slide-up">
            <h2 className="text-2xl font-black text-gray-950 mb-4">Derechos del usuario</h2>
            <p className="leading-relaxed mb-4">El usuario tiene derecho a:</p>
            <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-600">
              <li>Acceder a sus datos personales</li>
              <li>Solicitar la rectificación de datos incorrectos</li>
              <li>Solicitar la eliminación de sus datos</li>
              <li>Oponerse al tratamiento de sus datos</li>
              <li>Retirar su consentimiento en cualquier momento</li>
            </ul>
            <p className="leading-relaxed font-bold text-gray-900 mt-6">
              Para ejercer estos derechos, puede contactarnos al correo indicado.
            </p>
          </div>

          <div className="reveal slide-up">
            <h2 className="text-2xl font-black text-gray-950 mb-4">Conservación de los datos</h2>
            <p className="leading-relaxed">
              Los datos personales serán conservados únicamente durante el tiempo necesario para cumplir con las finalidades descritas en esta política o según lo requiera la ley.
            </p>
          </div>

          <div className="reveal slide-up">
            <h2 className="text-2xl font-black text-gray-950 mb-4">Enlaces a terceros</h2>
            <p className="leading-relaxed mb-2">
              Nuestro sitio web puede contener enlaces a sitios externos.
            </p>
            <p className="leading-relaxed mb-4">
              No somos responsables de las prácticas de privacidad de dichos sitios.
            </p>
            <p className="leading-relaxed font-bold text-gray-900 mt-2">
              Se recomienda revisar sus políticas de privacidad.
            </p>
          </div>

          <div className="reveal slide-up">
            <h2 className="text-2xl font-black text-gray-950 mb-4">Modificaciones de la política</h2>
            <p className="leading-relaxed mb-2">
              SparkTree Studio se reserva el derecho de modificar esta Política de Privacidad en cualquier momento.
            </p>
            <p className="leading-relaxed">
              Las modificaciones serán publicadas en esta misma página.
            </p>
          </div>

          <div className="reveal slide-up">
            <h2 className="text-2xl font-black text-gray-950 mb-4">Contacto</h2>
            <p className="leading-relaxed mb-4">
              Si tienes dudas sobre esta Política de Privacidad o el tratamiento de tus datos, puedes contactarnos:
            </p>
            <ul className="text-gray-600 font-medium space-y-1">
              <li>Correo: sparktree.rs@gmail.com</li>
              <li>Ubicación: Lima, Perú</li>
            </ul>
          </div>

        </div>
      </section>
    </div>
  );
}
