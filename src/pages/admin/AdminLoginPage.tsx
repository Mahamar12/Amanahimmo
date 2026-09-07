import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      onNavigate('/admin');
    } else {
      setErrorMsg(result.error || 'Identifiants invalides.');
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

          <h1 className="text-2xl font-extrabold text-[#12372A]">Espace Administrateur</h1>
          <p className="text-gray-500 text-xs">Connectez-vous pour gérer les annonces d'AmanahImmo</p>
        </div>

        {/* Demo credentials hint banner */}
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs space-y-1">
          <p className="font-bold flex items-center gap-1">
            <span>💡 Mode Démonstration :</span>
          </p>
          <p>Email: <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">admin@amanahimmo.sn</code></p>
          <p>Mot de passe: <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">admin123</code></p>
        </div>

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
            ) : (
              <span>Se connecter</span>
            )}
          </button>

        </form>

      </div>

    </div>
  );
};
