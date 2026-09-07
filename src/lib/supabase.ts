import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  const defaultUrl = 'https://lvbuyaaubauibwlutlzc.supabase.co';
  const defaultKey = 'sb_publishable_30sFyBhngpdrqJPEufU-MA_z10OxTTo';

  const envUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultKey;

  const localUrl = localStorage.getItem('amanah_supabase_url') || '';
  const localKey = localStorage.getItem('amanah_supabase_key') || '';

  const url = localUrl || envUrl;
  const key = localKey || envKey;

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
