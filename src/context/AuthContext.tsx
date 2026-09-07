import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'amanahimmo_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email || 'admin@amanahimmo.sn');
          setLoading(false);
          return;
        }
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
      });

      if (!error && data.session) {
        setIsAuthenticated(true);
        setUserEmail(email);
        return { success: true };
      }
    }

    // Default admin credentials check for instant preview/demo mode
    if ((email === 'admin@amanahimmo.sn' || email === 'admin') && (pass === 'admin123' || pass === 'admin')) {
      setIsAuthenticated(true);
      setUserEmail('admin@amanahimmo.sn');
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ authenticated: true, email: 'admin@amanahimmo.sn' }));
      return { success: true };
    }

    return { success: false, error: 'Identifiants incorrects. Pour la démonstration, utilisez: admin / admin123' };
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout, loading }}>
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
