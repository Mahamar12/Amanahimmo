import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = localStorage.getItem('amanah_supabase_url') || '';
  const localKey = localStorage.getItem('amanah_supabase_key') || '';

  const url = envUrl || localUrl;
  const key = envKey || localKey;

  const isConfigured = Boolean(
    url && url.startsWith('https://') && key && key.length > 20
  );

  return { url, key, isConfigured };
};

const config = getSupabaseConfig();

export const isSupabaseConfigured = config.isConfigured;

export const currentSupabaseUrl = config.url;

export const supabase: SupabaseClient | null = config.isConfigured
  ? createClient(config.url, config.key)
  : null;

export const setRuntimeSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem('amanah_supabase_url', url.trim());
  localStorage.setItem('amanah_supabase_key', key.trim());
  window.location.reload();
};

export const clearRuntimeSupabaseConfig = () => {
  localStorage.removeItem('amanah_supabase_url');
  localStorage.removeItem('amanah_supabase_key');
  window.location.reload();
};
