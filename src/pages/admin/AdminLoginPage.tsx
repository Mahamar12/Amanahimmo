import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Lock, Mail, AlertCircle, ArrowLeft, Database, UserPlus, LogIn, CheckCircle2 } from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, signUpAdmin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    if (isRegisterMode) {
      const result = await signUpAdmin(email, password);
      setSubmitting(false);

      if (result.success) {
        setSuccessMsg('Compte administrateur créé sur Supabase ! Vous pouvez vous connecter.');
        setIsRegisterMode(false);
      } else {
        setErrorMsg(result.error || 'Échec de la création du compte sur Supabase.');
      }
    } else {
      const result = await login(email, password);
      setSubmitting(false);

      if (result.success) {
        onNavigate('/admin');
      } else {
        setErrorMsg(result.error || 'Identifiants invalides.');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-2xl">
        
        {/* Top Header */}
        <div className="text-center space-y-3">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-500 hover:text-[#12372A] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour au site public</span>
          </button>

          <img 
            src="/logo.png" 
            alt="AmanahImmo Logo" 
            className="h-16 w-auto object-contain mx-auto mix-blend-multiply" 
          />

          <h1 className="text-2xl font-extrabold text-[#12372A]">
            {isRegisterMode ? 'Créer un Admin Supabase' : 'Espace Administrateur'}
          </h1>
          <p className="text-gray-500 text-xs">
            {isRegisterMode 
              ? 'Inscrivez un nouveau compte administrateur dans Supabase Auth' 
              : 'Connectez-vous pour gérer les annonces d\'AmanahImmo'}
          </p>
        </div>

        {/* Supabase Auth Connection Status Badge */}
        <div className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
          isSupabaseConfigured
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 shrink-0" />
            <span className="font-semibold">
              {isSupabaseConfigured ? 'Connecté à Supabase Auth' : 'Mode Démonstration (admin / admin123)'}
            </span>
          </div>

          {isSupabaseConfigured && (
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-[11px] font-bold text-[#12372A] hover:underline"
            >
              {isRegisterMode ? 'Se connecter' : '+ Créer Admin'}
            </button>
          )}
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Administrateur
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="admin@amanahimmo.sn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#12372A] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#12372A] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#12372A] hover:bg-[#0d281e] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm uppercase tracking-wider"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isRegisterMode ? (
              <>
                <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                <span>Créer le compte Supabase</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-[#D4AF37]" />
                <span>Se connecter</span>
              </>
            )}
          </button>

        </form>

      </div>

    </div>
  );
};
