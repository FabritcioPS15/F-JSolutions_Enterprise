import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  !rawUrl.includes('placeholder') &&
  !rawUrl.includes('your_supabase')
);

const supabaseUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co';
const supabaseKey = isSupabaseConfigured ? rawKey : 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url?: string;
  category: string;
  published_date: string;
  read_time: string;
  is_featured: boolean;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('published_date', { ascending: false });

    if (error) {
      console.warn('Could not fetch posts:', error.message || error);
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

export async function getRecentPosts(limit: number = 3): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('published_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('Could not fetch recent posts:', error.message || error);
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

export async function getFeaturedPost(): Promise<BlogPost | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_featured', true)
      .single();

    if (error && error.code !== 'PGRST116') return null;
    return data || null;
  } catch {
    return null;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') return null;
    return data || null;
  } catch {
    return null;
  }
}
