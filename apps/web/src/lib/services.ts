export type ServiceCategory = 'Soporte TI' | 'Infraestructura TI' | 'Desarrollo de software'

export type ServiceInclude = {
  title: string
  copy: string
}

export type ServiceFAQ = {
  question: string
  answer: string
}

export type ServiceDefinition = {
  slug: string
  title: string
  category: ServiceCategory
  summary: string
  intro: string
  heroImage?: { src: string; alt: string }
  includes: ServiceInclude[]
  faq: ServiceFAQ[]
  related: string[]
}

export const serviceCategories: ServiceCategory[] = [
  'Soporte TI',
  'Infraestructura TI',
  'Desarrollo de software',
]

export const serviceDefinitions: ServiceDefinition[] = [
  // ─── Soporte TI ─────────────────────────────────────────────────────────────
  {
    slug: 'soporte-tecnico',
    title: 'Soporte técnico',
    category: 'Soporte TI',
    summary:
      'Soporte técnico remoto y en sitio para empresas: diagnóstico, resolución de incidencias y seguimiento de cada caso.',
    intro:
      'Atendemos incidencias de hardware, software y conectividad con un equipo que conoce tu operación. Cada caso queda registrado para que el mismo problema no se repita y tu equipo no pierda horas productivas.',
    includes: [
      { title: 'Diagnóstico de incidencias', copy: 'Identificamos la causa raíz antes de aplicar una solución definitiva.' },
      { title: 'Soporte remoto y en sitio', copy: 'Resolvemos la mayoría de casos a distancia y coordinamos visitas cuando hace falta.' },
      { title: 'Hardware y software', copy: 'Equipos, sistemas operativos, aplicaciones y periféricos de tu operación.' },
      { title: 'Mesa de ayuda con tickets', copy: 'Cada solicitud queda registrada con responsable, estado e historial.' },
      { title: 'Reporte de atenciones', copy: 'Visibilidad de lo atendido y recomendaciones para reducir futuras fallas.' },
    ],
    faq: [
      {
        question: '¿Atienden urgencias fuera del horario de oficina?',
        answer:
          'Sí. Coordinamos cobertura extendida según el plan contratado y la criticidad del caso. Las urgencias se priorizan por impacto en la operación y se atienden por el canal acordado.',
      },
      {
        question: '¿Pueden dar soporte a equipos comprados en otro proveedor?',
        answer:
          'Sí. Gestionamos los equipos que ya tienes, incluso si fueron adquiridos en otro proveedor. En el diagnóstico identificamos el estado y las limitaciones de garantía.',
      },
      {
        question: '¿El soporte incluye visitas presenciales?',
        answer:
          'Sí. La mayoría de incidencias se resuelven de forma remota, pero cuando el problema requiere intervención física coordinamos una visita en sitio según el acuerdo de servicio.',
      },
    ],
    related: ['mantenimiento-de-equipos', 'soporte-remoto-y-presencial', 'soporte-empresarial'],
  },
  {
    slug: 'mantenimiento-de-equipos',
    title: 'Mantenimiento de computadoras y laptops',
    category: 'Soporte TI',
    summary:
      'Mantenimiento preventivo y correctivo de PCs, laptops y servidores para reducir fallas y extender la vida útil.',
    intro:
      'Planes de mantenimiento programado que revisan el estado real de tus equipos antes de que fallen. Un equipo mantenido rinde más, dura más y genera menos interrupciones en tu operación.',
    includes: [
      { title: 'Revisión de hardware', copy: 'Estado de discos, memoria, batería, ventilación y componentes críticos.' },
      { title: 'Limpieza interna', copy: 'Eliminamos polvo y residuos que provocan sobrecalentamiento y fallas.' },
      { title: 'Actualización de software', copy: 'Sistema operativo, controladores y aplicaciones con criterio de compatibilidad.' },
      { title: 'Optimización de almacenamiento', copy: 'Revisión de espacio, discos saludables y archivos temporales.' },
      { title: 'Reporte técnico por equipo', copy: 'Estado, hallazgos y recomendaciones para la siguiente revisión.' },
    ],
    faq: [
      {
        question: '¿Cada cuánto se recomienda el mantenimiento preventivo?',
        answer:
          'Para equipos de oficina recomendamos una revisión cada 6 meses. Equipos en ambientes exigentes, con alto uso o en campo pueden requerir una frecuencia mayor.',
      },
      {
        question: '¿El mantenimiento se realiza en nuestras oficinas?',
        answer:
          'Sí. Programamos el servicio en sitio para no interrumpir tu operación. Si un equipo requiere revisión especializada, coordinamos su traslado y retorno.',
      },
      {
        question: '¿Incluye repuestos y cambios de componentes?',
        answer:
          'El mantenimiento incluye la revisión y limpieza. Los repuestos se cotizan por separado según el diagnóstico, siempre con tu aprobación antes de cualquier cambio.',
      },
    ],
    related: ['soporte-tecnico', 'equipamiento-tecnologico-empresarial', 'soporte-empresarial'],
  },
  {
    slug: 'instalacion-de-software',
    title: 'Instalación y configuración de software',
    category: 'Soporte TI',
    summary:
      'Instalación de sistemas operativos, aplicaciones y licencias con configuración segura y respaldo previo.',
    intro:
      'Dejamos cada equipo listo para trabajar con el software correcto, usuarios configurados y respaldos previos cuando corresponde. Sin instalaciones improvisadas que después generan problemas de licencias o compatibilidad.',
    includes: [
      { title: 'Sistemas operativos', copy: 'Instalación limpia, actualizaciones y configuración inicial.' },
      { title: 'Aplicaciones y licencias', copy: 'Software de oficina, herramientas de gestión y utilidades de trabajo.' },
      { title: 'Usuarios y perfiles', copy: 'Cuentas, permisos y preferencias según el rol de cada colaborador.' },
      { title: 'Migración de datos', copy: 'Traslado de archivos y configuración desde el equipo anterior.' },
      { title: 'Pruebas de funcionamiento', copy: 'Verificación de aplicaciones, impresoras y accesos antes de entregar.' },
    ],
    faq: [
      {
        question: '¿Se encargan de la compra de licencias?',
        answer:
          'Podemos asesorarte y suministrar licencias originales de las principales marcas. También instalamos licencias que tu empresa ya tenga adquiridas.',
      },
      {
        question: '¿Cuánto demora una instalación?',
        answer:
          'Una instalación estándar toma entre 2 y 4 horas. Migraciones con muchos datos o software especializado se planifican para evitar tiempos muertos.',
      },
      {
        question: '¿Hacen respaldo antes de reinstalar?',
        answer:
          'Sí. Antes de cualquier instalación o reinstalación verificamos y respaldamos la información importante cuando las condiciones del equipo lo permiten.',
      },
    ],
    related: ['soporte-tecnico', 'configuracion-de-impresoras', 'soporte-empresarial'],
  },
  {
    slug: 'configuracion-de-impresoras',
    title: 'Configuración de impresoras',
    category: 'Soporte TI',
    summary:
      'Configuración de impresoras locales y en red, drivers, escaneo y control de impresión para tu oficina.',
    intro:
      'Instalamos y configuramos impresoras para que funcionen de forma estable en toda la oficina, con las opciones de escaneo y control que tu equipo realmente usa. Menos llamadas de “no imprime” y más trabajo resuelto.',
    includes: [
      { title: 'Impresoras en red', copy: 'Asignación de IP, cola compartida y acceso desde todos los equipos.' },
      { title: 'Drivers y aplicaciones', copy: 'Controladores correctos según modelo y sistema operativo.' },
      { title: 'Escaneo a red o correo', copy: 'Configuración de escaneo a carpeta, correo o nube.' },
      { title: 'Perfiles por equipo', copy: 'Impresora predeterminada y opciones según el área de trabajo.' },
      { title: 'Diagnóstico de errores', copy: 'Atascos, tóner, conexión y problemas recurrentes de impresión.' },
    ],
    faq: [
      {
        question: '¿Trabajan con cualquier marca de impresora?',
        answer:
          'Configuramos las marcas más comunes en oficina, como HP, Epson, Brother y Canon. Si el modelo requiere un controlador específico, lo gestionamos antes de la instalación.',
      },
      {
        question: '¿Se puede imprimir desde laptops y celulares?',
        answer:
          'Sí, según el modelo. Configuramos impresión por red corporativa y, cuando el equipo lo permite, impresión inalámbrica para dispositivos móviles.',
      },
      {
        question: '¿Pueden resolver impresoras que dejan de funcionar de un día para otro?',
        answer:
          'Sí. Revisamos conexión, cola de impresión, controladores y configuración del equipo. Si el problema es de hardware, lo informamos con el diagnóstico correspondiente.',
      },
    ],
    related: ['soporte-tecnico', 'redes-y-conectividad', 'equipamiento-tecnologico-empresarial'],
  },
  {
    slug: 'soporte-remoto-y-presencial',
    title: 'Soporte remoto y presencial',
    category: 'Soporte TI',
    summary:
      'Atención técnica remota inmediata y visitas programadas en sitio, según la urgencia de cada caso.',
    intro:
      'Combinamos la rapidez del soporte remoto con la precisión de una visita en sitio cuando el caso lo exige. Así tu equipo resuelve lo simple en minutos y lo complejo con un técnico presente.',
    includes: [
      { title: 'Conexión remota segura', copy: 'Acceso autorizado, con registro y control de cada sesión.' },
      { title: 'Atención por teléfono y chat', copy: 'Guía directa para incidencias que se resuelven en el momento.' },
      { title: 'Visitas programadas', copy: 'Intervención en sitio con agenda coordinada contigo.' },
      { title: 'Escalamiento inmediato', copy: 'Si el caso requiere presencia física, se deriva sin vueltas.' },
      { title: 'Registro de cada atención', copy: 'Historial de lo resuelto, pendientes y recomendaciones.' },
    ],
    faq: [
      {
        question: '¿El acceso remoto es seguro?',
        answer:
          'Sí. Usamos herramientas con autorización expresa y registro de sesión. Tú controlas cuándo se inicia y cuándo finaliza cada conexión.',
      },
      {
        question: '¿Cubren visitas fuera de Lima?',
        answer:
          'El soporte remoto cubre todo el Perú. Las visitas en sitio se coordinan según ubicación, criticidad y alcance del plan contratado.',
      },
      {
        question: '¿Qué pasa si el problema no se puede resolver de forma remota?',
        answer:
          'Se escala a una visita presencial con el diagnóstico previo, para que el técnico llegue con la información y los repuestos necesarios.',
      },
    ],
    related: ['soporte-tecnico', 'soporte-empresarial', 'mantenimiento-de-equipos'],
  },
  {
    slug: 'soporte-empresarial',
    title: 'Soluciones de soporte para empresas',
    category: 'Soporte TI',
    summary:
      'Planes de soporte TI gestionado por niveles, con SLA, monitoreo y un interlocutor técnico para tu empresa.',
    intro:
      'Un plan de soporte que se adapta al tamaño de tu operación, con tiempos de respuesta definidos y un responsable técnico que conoce tu empresa. Dejas de apagar incendios y trabajas con una estrategia clara.',
    includes: [
      { title: 'Planes por niveles', copy: 'Cobertura según cantidad de equipos, sedes y criticidad.' },
      { title: 'Acuerdos de servicio (SLA)', copy: 'Tiempos de respuesta y atención comprometidos por escrito.' },
      { title: 'Monitoreo de equipos', copy: 'Detección temprana de fallas, espacio y disponibilidad.' },
      { title: 'Gestor técnico asignado', copy: 'Un interlocutor que conoce tu infraestructura y prioridades.' },
      { title: 'Reporte mensual', copy: 'Indicadores de atención y recomendaciones de mejora.' },
    ],
    faq: [
      {
        question: '¿Cómo se define el plan adecuado para mi empresa?',
        answer:
          'Partimos de un diagnóstico sin costo: revisamos equipos, red y procesos para proponer el nivel de cobertura que realmente necesitas, sin sobredimensionar.',
      },
      {
        question: '¿El plan cubre los equipos que ya tenemos?',
        answer:
          'Sí. Gestionamos el parque existente, incluso si fue adquirido en otro proveedor. El inventario se documenta al inicio del servicio.',
      },
      {
        question: '¿Hay un contrato mínimo?',
        answer:
          'Los planes se contratan por periodos mensuales con condiciones claras de alcance y permanencia. Las condiciones se detallan en la propuesta.',
      },
    ],
    related: ['soporte-tecnico', 'soporte-remoto-y-presencial', 'implementacion-de-infraestructura'],
  },

  // ─── Infraestructura TI ─────────────────────────────────────────────────────
  {
    slug: 'redes-y-conectividad',
    title: 'Redes y conectividad',
    category: 'Infraestructura TI',
    summary:
      'Diseño e implementación de redes empresariales estables: Wi-Fi, switches, routers y cobertura por sede.',
    intro:
      'Diseñamos redes pensadas para la carga real de tu operación, con cobertura estable y equipo gestionable. Una red bien implementada evita caídas, lentitud y problemas que frenan el trabajo diario.',
    includes: [
      { title: 'Diseño de red', copy: 'Levantamiento de sedes, usuarios y necesidades de ancho de banda.' },
      { title: 'Wi-Fi empresarial', copy: 'Access points con cobertura uniforme y roaming entre áreas.' },
      { title: 'Switches y routers gestionados', copy: 'Equipos configurados, segmentados y actualizados.' },
      { title: 'Segmentación y VLANs', copy: 'Separación de tráfico por área o tipo de dispositivo.' },
      { title: 'Monitoreo de red', copy: 'Visibilidad de disponibilidad y detección temprana de fallas.' },
    ],
    faq: [
      {
        question: '¿Pueden unificar la red de varias sedes?',
        answer:
          'Sí. Diseñamos la interconexión entre sedes con criterios de seguridad y disponibilidad, según la conectividad disponible en cada ubicación.',
      },
      {
        question: '¿Reutilizan los equipos de red que ya tenemos?',
        answer:
          'Cuando el equipamiento es compatible y está en buen estado, lo reutilizamos. Si limita el rendimiento o la seguridad, lo indicamos en la propuesta con alternativas.',
      },
      {
        question: '¿Cuánto demora implementar una red de oficina?',
        answer:
          'Una oficina pequeña puede implementarse entre 2 y 5 días. Proyectos multisitio se planifican por etapas con fechas y alcance definidos.',
      },
    ],
    related: ['cableado-estructurado', 'configuracion-de-equipos-de-red', 'implementacion-de-infraestructura'],
  },
  {
    slug: 'cableado-estructurado',
    title: 'Cableado estructurado',
    category: 'Infraestructura TI',
    summary:
      'Instalación profesional de cableado de datos para oficinas, con orden, etiquetado y pruebas de certificación.',
    intro:
      'Instalamos cableado de red ordenado, identificado y probado, para que la infraestructura física no sea el punto débil de tu conectividad. Un trabajo limpio también simplifica el mantenimiento futuro.',
    includes: [
      { title: 'Diseño y trazado', copy: 'Recorridos, canaletas y puntos de red según el plano de tu oficina.' },
      { title: 'Puntos de red', copy: 'Instalación de tomas, patch panels y conectores certificados.' },
      { title: 'Peinado y etiquetado', copy: 'Orden en el rack y rotulado de cada punto para su identificación.' },
      { title: 'Pruebas de certificación', copy: 'Verificación de continuidad y rendimiento de cada punto.' },
      { title: 'Documentación técnica', copy: 'Plano de puntos, numeración y registro del trabajo realizado.' },
    ],
    faq: [
      {
        question: '¿Pueden instalar cableado en una oficina en funcionamiento?',
        answer:
          'Sí. Planificamos el trabajo por etapas y horarios para minimizar interrupciones en la operación diaria.',
      },
      {
        question: '¿El servicio incluye materiales?',
        answer:
          'Podemos suministrar cable, canaletas, tomas y accesorios, o trabajar con los materiales que tu empresa ya tenga. Se define en la propuesta.',
      },
      {
        question: '¿Entregan algún documento del trabajo?',
        answer:
          'Sí. Entregamos el registro de puntos instalados, numeración, pruebas realizadas y recomendaciones de mantenimiento.',
      },
    ],
    related: ['redes-y-conectividad', 'configuracion-de-equipos-de-red', 'implementacion-de-infraestructura'],
  },
  {
    slug: 'configuracion-de-equipos-de-red',
    title: 'Configuración de equipos de red',
    category: 'Infraestructura TI',
    summary:
      'Configuración de routers, switches y access points con seguridad, respaldo de configuraciones y red ordenada.',
    intro:
      'Configuramos los equipos de red con criterios de seguridad y orden, de modo que la red sea estable y fácil de administrar. Incluye respaldo de configuraciones para recuperar el servicio rápido ante cualquier eventualidad.',
    includes: [
      { title: 'Routers', copy: 'Configuración de WAN, LAN, DHCP y reglas de acceso.' },
      { title: 'Switches', copy: 'Puertos, VLANs y priorización de tráfico según el uso.' },
      { title: 'Access points', copy: 'Redes Wi-Fi separadas para colaboradores e invitados.' },
      { title: 'Políticas de seguridad', copy: 'Contraseñas robustas, actualizaciones y accesos controlados.' },
      { title: 'Respaldo de configuraciones', copy: 'Copias de seguridad para restaurar la red en minutos.' },
    ],
    faq: [
      {
        question: '¿Trabajan con equipos TP-Link, Ubiquiti y marcas similares?',
        answer:
          'Sí. Configuramos equipos de las marcas más usadas en oficinas y empresas. Si el modelo no admite alguna función requerida, lo informamos antes de intervenir.',
      },
      {
        question: '¿Qué pasa con la configuración que ya tenemos?',
        answer:
          'La revisamos y respaldamos antes de cualquier cambio. Los ajustes se hacen de forma controlada para no interrumpir el servicio.',
      },
      {
        question: '¿Pueden ajustar la red de forma remota?',
        answer:
          'Sí, siempre que exista conectividad y accesos autorizados. Los cambios críticos se coordinan para evitar cortes en horario de trabajo.',
      },
    ],
    related: ['redes-y-conectividad', 'cableado-estructurado', 'soporte-remoto-y-presencial'],
  },
  {
    slug: 'implementacion-de-infraestructura',
    title: 'Implementación de infraestructura tecnológica',
    category: 'Infraestructura TI',
    summary:
      'Proyectos de infraestructura TI llave en mano: servidores, redes, respaldo y puesta en marcha documentada.',
    intro:
      'Ejecutamos proyectos de infraestructura con un alcance claro, etapas definidas y documentación de cada entregable. Tu empresa recibe una base tecnológica que soporta el crecimiento sin improvisaciones.',
    includes: [
      { title: 'Dimensionamiento', copy: 'Análisis de carga, usuarios y proyección de crecimiento.' },
      { title: 'Servidores y almacenamiento', copy: 'Equipos físicos o virtuales dimensionados según el uso real.' },
      { title: 'Red y conectividad', copy: 'Implementación de la base de red que sostiene los sistemas.' },
      { title: 'Respaldos y continuidad', copy: 'Planes de copia y recuperación para la información crítica.' },
      { title: 'Puesta en marcha', copy: 'Pruebas, documentación y capacitación básica de uso.' },
    ],
    faq: [
      {
        question: '¿Cómo se organiza un proyecto de infraestructura?',
        answer:
          'Trabajamos por etapas: diagnóstico, propuesta, implementación y validación. Cada etapa tiene entregables y fechas acordadas contigo.',
      },
      {
        question: '¿Migran los sistemas que ya tenemos funcionando?',
        answer:
          'Sí. Planificamos la migración para minimizar tiempos de inactividad, con respaldos previos y pruebas antes de la puesta en producción.',
      },
      {
        question: '¿Incluye soporte después de la implementación?',
        answer:
          'Sí. Todo proyecto incluye un periodo de acompañamiento y la opción de continuar con un plan de soporte gestionado.',
      },
    ],
    related: ['redes-y-conectividad', 'equipamiento-tecnologico-empresarial', 'soporte-empresarial'],
  },
  {
    slug: 'equipamiento-tecnologico-empresarial',
    title: 'Equipamiento tecnológico empresarial',
    category: 'Infraestructura TI',
    summary:
      'Selección y suministro de equipos corporativos con asesoría técnica, configuración inicial y garantía de marca.',
    intro:
      'Te ayudamos a elegir los equipos correctos según el uso real de tu equipo de trabajo, con configuración inicial incluida. Comprar con asesoría técnica evita sobrecostos y equipos que no rinden lo esperado.',
    includes: [
      { title: 'Asesoría de compra', copy: 'Recomendación según rol, software y presupuesto disponible.' },
      { title: 'Laptops y desktops', copy: 'Equipos corporativos de marcas con soporte y garantía.' },
      { title: 'Servidores y almacenamiento', copy: 'Hardware para cargas de trabajo y respaldo de información.' },
      { title: 'Configuración inicial', copy: 'Sistema, usuarios y software listo para usar al entregar.' },
      { title: 'Garantía y reposición', copy: 'Acompañamiento en garantías y alternativas de reposición.' },
    ],
    faq: [
      {
        question: '¿Ofrecen precios por volumen?',
        answer:
          'Sí. Las compras corporativas se cotizan según cantidad y configuración, con condiciones especiales para proyectos de equipamiento completo.',
      },
      {
        question: '¿Trabajan con marcas reconocidas?',
        answer:
          'Sí. Suministramos equipos de marcas como Lenovo, Dell, HP, ASUS y otras, con garantía respaldada por fabricante o distribuidor autorizado.',
      },
      {
        question: '¿Emiten factura y ofrecen crédito corporativo?',
        answer:
          'Sí. Emitimos factura electrónica y evaluamos condiciones de pago para empresas con historial comercial. Las condiciones se detallan en la propuesta.',
      },
    ],
    related: ['mantenimiento-de-equipos', 'implementacion-de-infraestructura', 'soporte-empresarial'],
  },

  // ─── Desarrollo de software ──────────────────────────────────────────────────
  {
    slug: 'sistemas-web-a-medida',
    title: 'Sistemas web a medida',
    category: 'Desarrollo de software',
    summary:
      'Desarrollo de sistemas web a medida para gestionar ventas, inventario y procesos internos desde cualquier dispositivo.',
    intro:
      'Diseñamos y desarrollamos plataformas web pensadas para tu forma de trabajar, con los módulos que realmente usas, accesos por rol y una interfaz simple para tu equipo. Sin licencias innecesarias ni funciones que nadie aprovecha.',
    heroImage: {
      src: '/images/heroes/sistemas-web-a-medida.webp',
      alt: 'Desarrollo de software: interfaz de sistema web sobre una laptop con módulos de código, imágenes y base de datos',
    },
    includes: [
      { title: 'Análisis de procesos', copy: 'Levantamos cómo trabajas hoy y qué debe resolver el sistema.' },
      { title: 'Diseño de módulos', copy: 'Ventas, inventario, clientes, reportes o lo que tu operación necesite.' },
      { title: 'Accesos por rol', copy: 'Permisos y vistas según el cargo de cada colaborador.' },
      { title: 'Panel de reportes', copy: 'Indicadores y reportes exportables para tomar decisiones.' },
      { title: 'Despliegue y capacitación', copy: 'Puesta en producción, documentación y entrenamiento básico.' },
    ],
    faq: [
      {
        question: '¿Cuánto demora un sistema a medida?',
        answer:
          'Depende del alcance. Un primer módulo puede estar operativo en 4 a 8 semanas, y trabajamos por etapas para que valides cada avance antes de continuar.',
      },
      {
        question: '¿El sistema funciona en celulares y tablets?',
        answer:
          'Sí. Las interfaces se desarrollan de forma adaptable para que tu equipo consulte información y registre operaciones desde computadora, tablet o celular.',
      },
      {
        question: '¿El código y la información quedan a nombre de mi empresa?',
        answer:
          'Sí. El proyecto, su base de datos y la documentación se entregan a tu empresa. Después puedes contratar mantenimiento o evolución con nosotros.',
      },
    ],
    related: ['creacion-de-paginas-web', 'sistemas-de-gestion-empresarial', 'integraciones-y-api'],
  },
  {
    slug: 'creacion-de-paginas-web',
    title: 'Creación de páginas web',
    category: 'Desarrollo de software',
    summary:
      'Diseño y desarrollo de páginas web para empresas: sitios corporativos, landing pages y tiendas online rápidas, con SEO y panel de administración.',
    intro:
      'Creamos páginas web pensadas para que tus clientes te encuentren, entiendan lo que ofreces y te contacten. Diseño adaptado a celulares, carga rápida y un panel simple para que actualices el contenido sin depender de un programador.',
    heroImage: {
      src: '/images/heroes/Desarrollodesoftware.png',
      alt: 'Creación de páginas web: laptop con interfaz de sitio web, módulos de código y base de datos',
    },
    includes: [
      { title: 'Sitios web corporativos', copy: 'Presenta tu empresa, servicios y equipo con una estructura clara.' },
      { title: 'Landing pages', copy: 'Páginas enfocadas en una campaña, producto o conversión específica.' },
      { title: 'Diseño adaptable', copy: 'Interfaz cuidada en celular, tablet y computadora.' },
      { title: 'SEO técnico y velocidad', copy: 'Estructura, metadatos y optimización para cargar rápido y aparecer en Google.' },
      { title: 'Formularios conectados', copy: 'Las consultas llegan a tu correo y al panel de mesa de ayuda.' },
      { title: 'Panel de contenido', copy: 'Actualiza textos, imágenes y servicios sin tocar el código.' },
    ],
    faq: [
      {
        question: '¿Cuánto demora crear una página web?',
        answer:
          'Una landing page puede estar lista en 1 o 2 semanas. Un sitio corporativo completo suele tomar entre 3 y 5 semanas, según la cantidad de secciones y la entrega de contenidos, imágenes y logotipo.',
      },
      {
        question: '¿Incluye dominio y hosting?',
        answer:
          'Te asesoramos para elegir dominio y hosting adecuados a tu tráfico, y realizamos la publicación. El costo anual del dominio y el hosting se cotiza según el proveedor y el plan que elijas.',
      },
      {
        question: '¿Puedo actualizar la página yo mismo?',
        answer:
          'Sí. Entregamos la página con un panel de administración y una capacitación básica para que puedas publicar textos, imágenes y servicios sin depender de un programador.',
      },
      {
        question: '¿La página aparecerá en Google?',
        answer:
          'Entregamos el sitio con SEO técnico: estructura, metadatos, sitemap y velocidad de carga. El posicionamiento también depende del contenido, la competencia y el tiempo; si lo necesitas, podemos acompañarte con una estrategia continua.',
      },
    ],
    related: ['sistemas-web-a-medida', 'integraciones-y-api', 'consultoria-y-proyectos-personalizados'],
  },
  {
    slug: 'sistemas-de-gestion-empresarial',
    title: 'Sistemas de gestión empresarial',
    category: 'Desarrollo de software',
    summary:
      'Sistemas de gestión y ERP a medida para centralizar ventas, compras, inventario y facturación en una sola plataforma.',
    intro:
      'Unificamos la información que hoy vive en hojas de cálculo y sistemas separados. Tu equipo consulta stock, ventas y clientes desde un solo lugar, con datos consistentes y trazabilidad de cada operación.',
    includes: [
      { title: 'Ventas y compras', copy: 'Cotizaciones, órdenes, comprobantes y seguimiento comercial.' },
      { title: 'Inventario y almacenes', copy: 'Stock por sede, movimientos y alertas de reposición.' },
      { title: 'Clientes y proveedores', copy: 'Historial, contactos y condiciones comerciales centralizadas.' },
      { title: 'Facturación y documentos', copy: 'Comprobantes y documentos vinculados a cada operación.' },
      { title: 'Reportes gerenciales', copy: 'Indicadores de ventas, márgenes y rotación para decidir.' },
    ],
    faq: [
      {
        question: '¿Reemplaza a un ERP tradicional?',
        answer:
          'Según el alcance. Implementamos los módulos que tu operación necesita y crecemos por etapas, sin pagar por funciones que tu empresa no utiliza.',
      },
      {
        question: '¿Pueden migrar nuestros datos actuales?',
        answer:
          'Sí. Migramos clientes, productos e historial desde hojas de cálculo u otros sistemas, con validación previa para evitar duplicados.',
      },
      {
        question: '¿Se integra con la facturación electrónica?',
        answer:
          'Sí. Integramos el sistema con los servicios de facturación electrónica vigentes en Perú, según lo que tu empresa ya utilice.',
      },
    ],
    related: ['sistemas-web-a-medida', 'integraciones-y-api', 'automatizacion-de-procesos'],
  },
  {
    slug: 'automatizacion-de-procesos',
    title: 'Automatización de procesos',
    category: 'Desarrollo de software',
    summary:
      'Automatización de tareas y flujos de trabajo para reducir trabajo manual, errores y tiempos de respuesta.',
    intro:
      'Identificamos las tareas repetitivas que consumen tiempo de tu equipo y las convertimos en flujos automáticos. Menos copiar y pegar, menos errores y más tiempo para lo que realmente importa.',
    includes: [
      { title: 'Mapeo de tareas', copy: 'Identificamos qué se repite y cuánto tiempo consume hoy.' },
      { title: 'Flujos automáticos', copy: 'Aprobaciones, derivaciones y tareas que avanzan sin intervención.' },
      { title: 'Notificaciones', copy: 'Alertas por correo o mensajería cuando algo requiere atención.' },
      { title: 'Validaciones', copy: 'Controles que evitan datos incompletos o duplicados.' },
      { title: 'Panel de seguimiento', copy: 'Visibilidad del estado de cada proceso y sus responsables.' },
    ],
    faq: [
      {
        question: '¿Qué procesos se pueden automatizar?',
        answer:
          'Tareas repetitivas con reglas claras, como registros, aprobaciones, reportes periódicos, envío de documentos y sincronización entre sistemas.',
      },
      {
        question: '¿Necesitamos cambiar todas nuestras herramientas?',
        answer:
          'No. En la mayoría de casos trabajamos con lo que ya usas y automatizamos la conexión entre esas herramientas.',
      },
      {
        question: '¿Cómo se mide el resultado?',
        answer:
          'Antes de implementar registramos tiempos y volumen del proceso, y luego comparamos para mostrar el ahorro real en horas y errores.',
      },
    ],
    related: ['integraciones-y-api', 'sistemas-web-a-medida', 'consultoria-y-proyectos-personalizados'],
  },
  {
    slug: 'integraciones-y-api',
    title: 'Integraciones y API',
    category: 'Desarrollo de software',
    summary:
      'Integramos sistemas, pasarelas de pago y servicios externos mediante APIs seguras y documentadas.',
    intro:
      'Conectamos las herramientas que ya usas para que la información fluya sin cargas manuales. Integramos facturación, pagos, almacenes, correo o cualquier servicio que cuente con API disponible.',
    includes: [
      { title: 'Análisis de integración', copy: 'Revisamos qué sistemas deben conectarse y qué datos intercambiar.' },
      { title: 'APIs documentadas', copy: 'Endpoints claros y seguros para que otros sistemas se conecten.' },
      { title: 'Sincronización de datos', copy: 'Productos, clientes y pedidos actualizados entre plataformas.' },
      { title: 'Control de errores', copy: 'Reintentos y alertas cuando una operación falla.' },
      { title: 'Pruebas y monitoreo', copy: 'Validación en ambiente de prueba y seguimiento en producción.' },
    ],
    faq: [
      {
        question: '¿Con qué sistemas se pueden integrar?',
        answer:
          'Con cualquier plataforma que exponga una API o un mecanismo de intercambio de datos: facturación electrónica, pasarelas de pago, e-commerce, almacenes y correo corporativo.',
      },
      {
        question: '¿La integración es segura?',
        answer:
          'Sí. Trabajamos con autenticación por tokens, permisos mínimos, cifrado en tránsito y registro de operaciones para auditar cada intercambio.',
      },
      {
        question: '¿Qué pasa si una integración falla?',
        answer:
          'Los procesos cuentan con reintentos y alertas. Si una operación no se completa, queda registrada para revisarla y regularizarla sin perder información.',
      },
    ],
    related: ['sistemas-de-gestion-empresarial', 'automatizacion-de-procesos', 'sistemas-web-a-medida'],
  },
  {
    slug: 'consultoria-y-proyectos-personalizados',
    title: 'Consultoría y proyectos personalizados',
    category: 'Desarrollo de software',
    summary:
      'Consultoría tecnológica para definir, priorizar y ejecutar proyectos de software con alcance y presupuesto claros.',
    intro:
      'Acompañamos a tu empresa en la definición del proyecto correcto: revisamos procesos, priorizamos lo que genera valor y armamos una hoja de ruta realista antes de invertir en desarrollo.',
    includes: [
      { title: 'Diagnóstico de procesos', copy: 'Entendemos cómo opera tu empresa y dónde están los cuellos de botella.' },
      { title: 'Hoja de ruta', copy: 'Priorizamos etapas según impacto y esfuerzo.' },
      { title: 'Estimación de alcance', copy: 'Entregables, plazos y presupuesto antes de empezar.' },
      { title: 'Selección tecnológica', copy: 'Herramientas adecuadas al tamaño y equipo de tu empresa.' },
      { title: 'Acompañamiento de proyecto', copy: 'Seguimiento de avances, riesgos y decisiones durante la ejecución.' },
    ],
    faq: [
      {
        question: '¿La consultoría incluye desarrollo?',
        answer:
          'Puede incluirse o no. Algunas empresas solo necesitan claridad y una hoja de ruta; otras continúan con nosotros en la implementación.',
      },
      {
        question: '¿Cuánto dura una consultoría?',
        answer:
          'Un diagnóstico inicial suele tomar entre 1 y 3 semanas, según el tamaño de la operación y la cantidad de procesos a revisar.',
      },
      {
        question: '¿Sirve si ya tengo un sistema implementado?',
        answer:
          'Sí. Evaluamos el sistema actual, su adopción y limitaciones para recomendar mejoras, integraciones o un reemplazo por etapas.',
      },
    ],
    related: ['sistemas-web-a-medida', 'sistemas-de-gestion-empresarial', 'automatizacion-de-procesos'],
  },
]

export function getService(slug: string) {
  return serviceDefinitions.find((service) => service.slug === slug)
}

export function getServiceSlugs() {
  return serviceDefinitions.map((service) => service.slug)
}

export function getServicesByCategory(category: ServiceCategory) {
  return serviceDefinitions.filter((service) => service.category === category)
}

export function getServicePath(slug: string) {
  const service = getService(slug)
  return service?.category === 'Desarrollo de software' ? `/sistemas/${slug}` : `/servicios/${slug}`
}
