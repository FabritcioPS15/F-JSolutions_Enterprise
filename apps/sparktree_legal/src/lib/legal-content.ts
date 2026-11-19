export type PracticeArea = {
  slug:
    | 'corporativo'
    | 'contratos'
    | 'laboral'
    | 'tributario'
    | 'propiedad-intelectual'
    | 'litigios'
  title: string
  description: string
}

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    slug: 'corporativo',
    title: 'Corporativo y societario',
    description:
      'Constitución de empresas, gobierno corporativo, acuerdos entre socios y reorganizaciones.',
  },
  {
    slug: 'contratos',
    title: 'Contratos y negociaciones',
    description:
      'Redacción, revisión y negociación de contratos comerciales, de servicios y de alianzas.',
  },
  {
    slug: 'laboral',
    title: 'Laboral',
    description:
      'Contratación, políticas internas, desvinculaciones y prevención de contingencias laborales.',
  },
  {
    slug: 'tributario',
    title: 'Tributario',
    description:
      'Cumplimiento, fiscalizaciones y planificación tributaria alineada a la operación del negocio.',
  },
  {
    slug: 'propiedad-intelectual',
    title: 'Propiedad intelectual y tecnología',
    description:
      'Marcas, software, datos, licencias y protección de los activos digitales de tu empresa.',
  },
  {
    slug: 'litigios',
    title: 'Litigios y arbitraje',
    description:
      'Estrategia, representación y resolución de controversias sin descuidar la continuidad del negocio.',
  },
]

export const PROCESS_STEPS = [
  {
    title: 'Cuéntanos el caso',
    text: 'Escríbenos por WhatsApp o correo con el contexto y los documentos relevantes. Toda la información se trata de forma confidencial.',
  },
  {
    title: 'Evaluación inicial',
    text: 'Revisamos antecedentes, plazos y riesgos. Te confirmamos la vía y el especialista que debe acompañarte.',
  },
  {
    title: 'Un solo interlocutor',
    text: 'Coordinamos la reunión y centralizamos el seguimiento de tu caso para que no tengas que repetir tu historia.',
  },
]
