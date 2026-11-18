// Store helper to manage selected services in localStorage
const STORAGE_KEY = 'sparktree_selected_services';
const EVENT_NAME = 'sparktree_services_changed';

// Map of standard service names to make sure they match across pages and contact form
export const SERVICE_MAPPING: Record<string, string> = {
  'web': 'Diseño de paginas web',
  'seo': 'Posicionamiento SEO',
  'branding': 'Branding',
  'bots': 'SparkBots ( IA + Flujos )',
  'ti': 'Servicio TI',
  'social': 'Marketing de contenido',
  'automation': 'Automatización ( N8N + Flujos)',
  'diseño de páginas web': 'Diseño de paginas web',
  'posicionamiento seo': 'Posicionamiento SEO',
  'sparkbots (chatbots de ia)': 'SparkBots ( IA + Flujos )',
  'sparkbots ( ia + flujos )': 'SparkBots ( IA + Flujos )',
  'servicios ti': 'Servicio TI',
  'servicio ti': 'Servicio TI',
  'marketing digital': 'Marketing de contenido',
  'desarrollo de aplicaciones': 'Automatización ( N8N + Flujos)',
  'automatización ( n8n + flujos)': 'Automatización ( N8N + Flujos)',
  'marketing de contenido': 'Marketing de contenido'
};

// Standard list of services for the contact dropdown
export const CONTACT_SERVICES = [
  'Diseño de paginas web',
  'Posicionamiento SEO',
  'Branding',
  'Servicio TI',
  'Automatización ( N8N + Flujos)',
  'SparkBots ( IA + Flujos )',
  'Marketing de contenido',
  'Otro'
];

export const getSelectedServices = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error reading selected services:', e);
    return [];
  }
};

export const saveSelectedServices = (services: string[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (e) {
    console.error('Error saving selected services:', e);
  }
};

export const normalizeServiceName = (name: string): string => {
  const clean = name.trim().toLowerCase();
  return SERVICE_MAPPING[clean] || name;
};

export const toggleServiceSelection = (serviceName: string): string[] => {
  const normalized = normalizeServiceName(serviceName);
  const current = getSelectedServices();
  const isSelected = current.includes(normalized);
  
  const updated = isSelected
    ? current.filter(s => s !== normalized)
    : [...current, normalized];
    
  saveSelectedServices(updated);
  return updated;
};

export const addServiceSelection = (serviceName: string): string[] => {
  const normalized = normalizeServiceName(serviceName);
  const current = getSelectedServices();
  if (!current.includes(normalized)) {
    const updated = [...current, normalized];
    saveSelectedServices(updated);
    return updated;
  }
  return current;
};

export const removeServiceSelection = (serviceName: string): string[] => {
  const normalized = normalizeServiceName(serviceName);
  const current = getSelectedServices();
  const updated = current.filter(s => s !== normalized);
  saveSelectedServices(updated);
  return updated;
};

export const isServiceSelected = (serviceName: string): boolean => {
  const normalized = normalizeServiceName(serviceName);
  return getSelectedServices().includes(normalized);
};

export const clearSelectedServices = (): void => {
  saveSelectedServices([]);
};
