export type CourseLevel = 'Principiante' | 'Intermedio' | 'Avanzado'
export type CourseCategory = 'software' | 'cloud' | 'security' | 'infra' | 'ai'

export type Course = {
  id: string
  slug: string
  title: string
  shortDescription: string
  category: CourseCategory
  categoryLabel: string
  level: CourseLevel
  duration: string
  hours: number
  modality: 'En vivo Online' | 'Híbrido' | 'Presencial' | 'Presencial / Laboratorio'
  featured?: boolean
  badge?: string
  certification: string
  syllabus: string[]
  technologies: string[]
  nextStartDate: string
  pricePEN: number
  discountPercent?: number
  instructor: {
    name: string
    role: string
    company: string
  }
}

export const CATEGORIES: { id: CourseCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Todos los programas' },
  { id: 'software', label: 'Desarrollo de Software' },
  { id: 'cloud', label: 'Cloud & DevOps' },
  { id: 'security', label: 'Ciberseguridad' },
  { id: 'infra', label: 'Infraestructura & Redes' },
  { id: 'ai', label: 'Inteligencia Artificial' },
]

export const COURSES: Course[] = [
  {
    id: 'fullstack-pro',
    slug: 'desarrollo-web-fullstack-profesional',
    title: 'Desarrollo Web Full Stack Profesional con Next.js & Node.js',
    shortDescription: 'Domina React 19, Next.js, TypeScript, PostgreSQL, Prisma y arquitecturas modernas de microservicios con despliegues reales.',
    category: 'software',
    categoryLabel: 'Desarrollo de Software',
    level: 'Intermedio',
    duration: '16 Semanas',
    hours: 120,
    modality: 'En vivo Online',
    featured: true,
    badge: 'Más Solicitado',
    certification: 'Certificación F&J Enterprise Certified Full Stack Developer',
    syllabus: [
      'Arquitectura Web Moderna y TypeScript Avanzado',
      'React 19 Server Components y Next.js App Router',
      'Modelado de Bases de Datos con PostgreSQL y Prisma ORM',
      'APIs RESTful y GraphQL de Alto Rendimiento',
      'Autenticación JWT, RBAC y Seguridad Web',
      'Testing automatizado y Despliegues en Vercel/AWS',
    ],
    technologies: ['TypeScript', 'Next.js', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
    nextStartDate: '15 de Diciembre, 2026',
    pricePEN: 850,
    discountPercent: 25,
    instructor: {
      name: 'Ing. Fabritcio Peña',
      role: 'Lead Software Architect',
      company: 'F&J Solutions Enterprise',
    },
  },
  {
    id: 'devops-cloud',
    slug: 'cloud-computing-devops-aws-docker-kubernetes',
    title: 'Cloud Computing & DevOps: AWS, Docker & Kubernetes',
    shortDescription: 'Aprende a diseñar infraestructura escalable, contenedores, orquestación y pipelines CI/CD automatizados.',
    category: 'cloud',
    categoryLabel: 'Cloud & DevOps',
    level: 'Intermedio',
    duration: '12 Semanas',
    hours: 90,
    modality: 'En vivo Online',
    featured: true,
    badge: 'Alta Demanda',
    certification: 'Certificación F&J Cloud & Infrastructure Specialist',
    syllabus: [
      'Fundamentos de Arquitectura Cloud en AWS',
      'Contenedores avanzados con Docker & Docker Compose',
      'Orquestación de Clusters con Kubernetes (K8s)',
      'Infraestructura como Código (IaC) con Terraform',
      'Pipelines CI/CD con GitHub Actions',
      'Monitoreo, Logs y Alta Disponibilidad',
    ],
    technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Linux'],
    nextStartDate: '18 de Diciembre, 2026',
    pricePEN: 920,
    discountPercent: 20,
    instructor: {
      name: 'Ing. Carlos Mendoza',
      role: 'DevOps & Cloud Engineer',
      company: 'F&J Solutions',
    },
  },
  {
    id: 'ciberseguridad-defensiva',
    slug: 'ciberseguridad-analista-soc-ethical-hacking',
    title: 'Ciberseguridad Ofensiva & Defensiva (Ethical Hacking y SOC)',
    shortDescription: 'Formación integral en análisis de vulnerabilidades, pentesting, respuesta a incidentes y fortificación de sistemas empresariales.',
    category: 'security',
    categoryLabel: 'Ciberseguridad',
    level: 'Avanzado',
    duration: '14 Semanas',
    hours: 105,
    modality: 'Híbrido',
    featured: false,
    badge: 'Especialización',
    certification: 'Certificado Profesional de Seguridad Ofensiva F&J',
    syllabus: [
      'Fundamentos de Ethical Hacking y Metodología OWASP',
      'Escaneo y Análisis de Vulnerabilidades de Red',
      'Pentesting Web y explotación de fallos de inyección',
      'Hardening de Servidores Linux y Windows Server',
      'Monitoreo SIEM y Gestión de Incidentes de Seguridad',
      'Forense Digital y Normativas ISO 27001',
    ],
    technologies: ['Kali Linux', 'Wireshark', 'Metasploit', 'Burp Suite', 'Wazuh', 'Python'],
    nextStartDate: '08 de Enero, 2027',
    pricePEN: 990,
    discountPercent: 15,
    instructor: {
      name: 'MSc. Rodrigo Salazar',
      role: 'Cybersecurity Consultant',
      company: 'F&J Solutions Enterprise',
    },
  },
  {
    id: 'infra-redes-servidores',
    slug: 'administracion-servidores-redes-cisco-mikrotik',
    title: 'Infraestructura de Servidores & Redes Empresariales (Cisco & MikroTik)',
    shortDescription: 'Diseña, implementa y administra redes de datos empresariales, switches gestionables, routers MikroTik y servidores en rack.',
    category: 'infra',
    categoryLabel: 'Infraestructura & Redes',
    level: 'Principiante',
    duration: '10 Semanas',
    hours: 75,
    modality: 'Presencial / Laboratorio',
    featured: false,
    certification: 'Certificado de Especialista en Redes & Infraestructura F&J',
    syllabus: [
      'Cableado estructurado y topologías de red',
      'Configuración de VLANs y Routing con Cisco & MikroTik',
      'Windows Server: Active Directory, DNS, DHCP y GPOs',
      'Virtualización de Servidores con Proxmox y VMware ESXi',
      'Sistemas de Almacenamiento NAS y Políticas de Respaldo',
      'Mantenimiento preventivo de centros de datos',
    ],
    technologies: ['Cisco', 'MikroTik', 'Windows Server', 'Proxmox', 'Linux', 'VLANs'],
    nextStartDate: '12 de Enero, 2027',
    pricePEN: 780,
    discountPercent: 15,
    instructor: {
      name: 'Ing. David Paredes',
      role: 'Infrastructure Lead',
      company: 'F&J Solutions Enterprise',
    },
  },
  {
    id: 'ia-empresarial',
    slug: 'inteligencia-artificial-aplicada-agentes-ia-empresas',
    title: 'Inteligencia Artificial & Automatización con Agentes Autónomos',
    shortDescription: 'Crea agentes de IA, automatizaciones complejas, integración con APIs de LLMs (Gemini, OpenAI) y flujos empresariales inteligentes.',
    category: 'ai',
    categoryLabel: 'Inteligencia Artificial',
    level: 'Intermedio',
    duration: '8 Semanas',
    hours: 60,
    modality: 'En vivo Online',
    featured: true,
    badge: 'Tecnología 2027',
    certification: 'Certificación en Ingeniería de IA y Automatización F&J',
    syllabus: [
      'Fundamentos de LLMs y Prompt Engineering Avanzado',
      'Construcción de Agentes con Function Calling y RAG',
      'Integración de APIs de IA en aplicaciones web',
      'Automatización de procesos comerciales y soporte con n8n/Python',
      'Modelos locales, Embeddings y Bases de Datos Vectoriales',
      'Buenas prácticas de gobernanza y despliegue de IA',
    ],
    technologies: ['Python', 'Gemini API', 'LangChain', 'ChromaDB', 'Next.js', 'n8n'],
    nextStartDate: '20 de Enero, 2027',
    pricePEN: 890,
    discountPercent: 30,
    instructor: {
      name: 'Ing. Fabritcio Peña',
      role: 'AI & Software Director',
      company: 'F&J Solutions Enterprise',
    },
  },
]

export const STATS = [
  { value: '+1,500', label: 'Estudiantes capacitados' },
  { value: '96%', label: 'Tasa de inserción laboral' },
  { value: '100%', label: 'Enfoque práctico con proyectos' },
  { value: '4.9/5', label: 'Calificación promedio de egresados' },
]

export const PILLARS = [
  {
    title: 'Proyectos Reales de F&J Enterprise',
    description: 'No te quedas en simples ejercicios de juguete: programas y configuras con retos basados en clientes reales y arquitecturas reales de F&J Solutions.',
    icon: 'Briefcase',
  },
  {
    title: 'Mentores Ingenieros en Activo',
    description: 'Aprende directamente de los profesionales que lideran proyectos corporativos de tecnología a diario, no de instructores que solo leen diapositivas.',
    icon: 'Users',
  },
  {
    title: 'Bolsa de Trabajo y Pasantías',
    description: 'Los alumnos destacados de la academia tienen acceso prioritario a convocatorias y vacantes laborales dentro del ecosistema F&J Solutions y empresas aliadas.',
    icon: 'Award',
  },
  {
    title: 'Laboratorios en la Nube y Físicos',
    description: 'Acceso a infraestructura real: servidores dedicados, entornos cloud de pruebas y laboratorios de redes con hardware empresarial de última generación.',
    icon: 'Server',
  },
]

export const TESTIMONIALS = [
  {
    name: 'Álvaro Gutiérrez',
    role: 'Desarrollador Full Stack',
    company: 'Fintech Solutions',
    comment: 'Llegué con conocimientos básicos y en 4 meses ya estaba construyendo aplicaciones completas con Next.js y PostgreSQL. La mentoría personalizada de los ingenieros de F&J marcó la diferencia total.',
    rating: 5,
  },
  {
    name: 'Melissa Castillo',
    role: 'Administradora de Sistemas Cloud',
    company: 'Logística Perú',
    comment: 'El programa de Cloud & DevOps fue el impulso que necesitaba mi carrera. Poder levantar clusters de Kubernetes y configurar CI/CD con casos prácticos me permitió triplicar mi nivel profesional.',
    rating: 5,
  },
  {
    name: 'Jorge Luis Huamán',
    role: 'Especialista en Redes & Soporte',
    company: 'Corporación Minera',
    comment: 'Los laboratorios con equipos físicos Cisco y MikroTik te enseñan lo que realmente vas a ver en campo cuando entres a un rack de servidores. 100% recomendado.',
    rating: 5,
  },
]
