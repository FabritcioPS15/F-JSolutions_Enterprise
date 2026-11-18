export interface ProjectMedia {
  url: string;
  category?: string;
  type?: "image" | "video" | "web";
}

export interface ContentBlock {
  id: string;
  type: "heading" | "paragraph" | "image" | "video" | "quote" | "list";
  content: string;
  /** For images/videos: the URL of the media */
  mediaUrl?: string;
  /** For images: alt text / caption */
  caption?: string;
  /** For headings: level (h2, h3, h4) */
  level?: 2 | 3 | 4;
  /** For lists: individual items */
  items?: string[];
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  services?: string[];
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
  duration: string;
  team: string[];
  heroImage: string;
  heroImages?: string[];
  cardImage?: string;
  resultImages: (string | ProjectMedia)[];
  additionalImages: (string | ProjectMedia)[];
  isFeatured?: boolean;
  isVisible?: boolean;
  orderRank?: number;
  /** Bloques de contenido enriquecido (artículo/publicación) */
  contentBlocks?: ContentBlock[];
  /** SEO: Meta descripción personalizada para buscadores */
  seoDescription?: string;
  /** SEO: Palabras clave separadas por comas */
  seoKeywords?: string;
  /** SEO: Slug personalizado para URL amigable */
  slug?: string;
}

export const projects: Project[] = [];
