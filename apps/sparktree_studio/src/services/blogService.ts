import { getFeaturedPost as getFeaturedPostFromLib, getRecentPosts as getRecentPostsFromLib, getAllPosts as getAllPostsFromLib, getPostBySlug as getPostBySlugFromLib } from '../lib/supabase';

export const getFeaturedPost = getFeaturedPostFromLib;
export const getRecentPosts = getRecentPostsFromLib;
export const getAllPosts = getAllPostsFromLib;
export const getPostBySlug = getPostBySlugFromLib;
