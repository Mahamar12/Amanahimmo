import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpAdmin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  isSupabaseAuthActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'amanahimmo_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSupabaseAuthActive, setIsSupabaseAuthActive] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsAuthenticated(true);
            setUserEmail(session.user.email || 'admin@amanahimmo.sn');
            setIsSupabaseAuthActive(true);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Supabase Auth session check error', e);
        }

        // Listen for Supabase auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setIsAuthenticated(true);
            setUserEmail(session.user.email || 'admin@amanahimmo.sn');
            setIsSupabaseAuthActive(true);
          } else {
            const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
            if (!savedSession) {
              setIsAuthenticated(false);
              setUserEmail(null);
              setIsSupabaseAuthActive(false);
            }
          }
        });

        // Cleanup listener on unmount
        return () => {
          authListener?.subscription.unsubscribe();
        };
      }

      // Check local session
      const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          if (parsed.authenticated) {
            setIsAuthenticated(true);
            setUserEmail(parsed.email);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pass
        });

        if (!error && data.session) {
          setIsAuthenticated(true);
          setUserEmail(data.session.user.email || email);
          setIsSupabaseAuthActive(true);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ authenticated: true, email: data.session.user.email || email }));
          return { success: true };
        } else if (error) {
          console.warn('Supabase auth sign in failed, testing local fallback:', error.message);
        }
      } catch (err: any) {
        console.warn('Supabase auth exception:', err);
      }
    }

    // Default admin credentials check for instant preview/demo mode
    if ((email.trim() === 'admin@amanahimmo.sn' || email.trim() === 'admin') && (pass === 'admin123' || pass === 'admin')) {
      setIsAuthenticated(true);
      setUserEmail('admin@amanahimmo.sn');
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ authenticated: true, email: 'admin@amanahimmo.sn' }));
      return { success: true };
    }

    return { 
      success: false, 
      error: 'Identifiants incorrects. En mode démo, utilisez: admin / admin123. Sur Supabase, vérifiez vos identifiants ou inscrivez votre compte admin.' 
    };
  };

  const signUpAdmin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase n\'est pas configuré. Connectez Supabase dans le panneau d\'admin.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: pass
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        if (data.session) {
          setIsAuthenticated(true);
          setUserEmail(data.user.email || email);
          setIsSupabaseAuthActive(true);
        }
        return { success: true };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erreur lors de la création du compte Supabase.' };
    }

    return { success: false, error: 'Création de compte échouée.' };
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setUserEmail(null);
    setIsSupabaseAuthActive(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, signUpAdmin, logout, loading, isSupabaseAuthActive }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
