import React, { useState, useEffect } from 'react';
import type { Property } from '../../types/property';
import { propertyService } from '../../services/propertyService';
import { isSupabaseConfigured, setRuntimeSupabaseConfig, clearRuntimeSupabaseConfig, currentSupabaseUrl } from '../../lib/supabase';
import { 
  Building2, PlusCircle, CheckCircle, Key, Tag, ShoppingBag, 
  RotateCcw, Database, Eye, ArrowRight, RefreshCw, X, Check, Copy, KeyRound,
  Trash2, Edit, AlertTriangle
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
  onSelectProperty?: (slug: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate, onSelectProperty }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; msg: string } | null>(null);

  // Supabase Config Modal State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [inputUrl, setInputUrl] = useState(currentSupabaseUrl || '');
  const [inputKey, setInputKey] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  // Delete State
  const [deleteCandidate, setDeleteCandidate] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    setDeleting(true);
    await propertyService.deleteProperty(deleteCandidate.id);
    setDeleting(false);
    setDeleteCandidate(null);
    loadProperties();
  };

  const loadProperties = async () => {
    setLoading(true);
    const data = await propertyService.getProperties();
    setProperties(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const totalProperties = properties.length;
  const availableCount = properties.filter(p => p.status === 'available').length;
  const rentCount = properties.filter(p => p.transaction_type === 'rent').length;
  const saleCount = properties.filter(p => p.transaction_type === 'sale').length;
  const rentedCount = properties.filter(p => p.status === 'rented').length;
  const soldCount = properties.filter(p => p.status === 'sold').length;

  const handleResetDemo = () => {
    if (window.confirm("Voulez-vous réinitialiser les annonces avec les données de démonstration d'origine ?")) {
      const reset = propertyService.resetDemoData();
      setProperties(reset);
    }
  };

  const handleSyncSupabase = async () => {
    setSyncing(true);
    setSyncResult(null);
    const res = await propertyService.syncToSupabase();
    setSyncing(false);
    
    if (res.success) {
      setSyncResult({ success: true, msg: `${res.count} annonces synchronisées avec succès sur Supabase !` });
      loadProperties();
    } else {
      setSyncResult({ success: false, msg: res.error || 'Échec de la synchronisation Supabase.' });
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || !inputKey.trim()) {
      alert("Veuillez saisir votre URL Supabase et la clé Anon Key.");
      return;
    }
    setRuntimeSupabaseConfig(inputUrl, inputKey);
  };

  const handleDisconnectSupabase = () => {
    if (window.confirm("Voulez-vous déconnecter les clés Supabase enregistrées ?")) {
      clearRuntimeSupabaseConfig();
    }
  };

  const sqlCodeToCopy = `-- Exécutez ce script dans Supabase -> SQL Editor pour créer la table et RLS:
create table if not exists public.properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  reference text not null unique,
  description text,
  transaction_type text check (transaction_type in ('sale', 'rent')) not null,
  property_type text check (property_type in ('apartment', 'house', 'villa', 'land', 'office', 'commercial', 'building', 'other')) not null,
  price numeric not null,
  price_period text check (price_period in ('month', 'year', 'total')) default 'month',
  location text not null,
  city text default 'Dakar',
  neighborhood text,
  area numeric,
  bedrooms integer default 0,
  bathrooms integer default 0,
  rooms integer default 0,
  features text[] default '{}',
  main_image text not null,
  images text[] default '{}',
  featured boolean default false,
  status text check (status in ('available', 'rented', 'sold', 'unavailable')) default 'available',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.properties enable row level security;
create policy "Public view" on public.properties for select using (true);
create policy "Admin insert" on public.properties for insert with check (true);
create policy "Admin update" on public.properties for update using (true);
create policy "Admin delete" on public.properties for delete using (true);`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlCodeToCopy);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[#D4AF37] font-bold text-xs uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Panneau d'administration AmanahImmo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#12372A]">Tableau de bord</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Gérez vos annonces immobilières, surveillez la disponibilité et publiez de nouveaux biens.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('/admin/biens/nouveau')}
            className="bg-[#12372A] hover:bg-[#0d281e] text-white font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl shadow transition-all flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
            <span>+ Ajouter un bien</span>
          </button>

          <button
            onClick={() => onNavigate('/admin/biens')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all"
          >
            Gérer les biens
          </button>
        </div>
      </div>

      {/* Supabase Connection Status Bar */}
      <div className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isSupabaseConfigured 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 shrink-0 text-[#12372A]" />
          <div>
            <p className="font-bold text-sm">
              {isSupabaseConfigured 
                ? '⚡ Supabase Fullstack actif' 
                : ' Mode démonstration local (Supabase non connecté)'}
            </p>
            <p className="text-[11px] opacity-80 mt-0.5">
              {isSupabaseConfigured 
                ? `Connecté à ${currentSupabaseUrl || 'votre projet Supabase'}. Base de données & Storage synchronisés.` 
                : 'Configurez vos clés API Supabase pour synchroniser la base de données en direct.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isSupabaseConfigured ? (
            <>
              <button
                onClick={handleSyncSupabase}
                disabled={syncing}
                className="bg-[#12372A] hover:bg-[#0d281e] text-white font-bold px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 shadow"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Sync...' : 'Synchroniser les biens'}</span>
              </button>

              <button
                onClick={handleDisconnectSupabase}
                className="bg-red-100 hover:bg-red-200 text-red-800 font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                Déconnecter
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowConfigModal(true)}
              className="bg-[#12372A] hover:bg-[#0d281e] text-white font-bold px-4 py-2 rounded-xl transition-all shadow flex items-center space-x-1.5"
            >
              <KeyRound className="w-4 h-4 text-[#D4AF37]" />
              <span>Connecter Supabase</span>
            </button>
          )}

          <button
            onClick={handleResetDemo}
            className="text-gray-600 hover:text-gray-900 underline text-[11px] flex items-center space-x-1 px-1"
            title="Réinitialiser les données de démo"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Réinitialiser démo</span>
          </button>
        </div>
      </div>

      {syncResult && (
        <div className={`p-4 rounded-xl border text-xs ${
          syncResult.success ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-red-100 border-red-300 text-red-900'
        }`}>
          <p className="font-bold">{syncResult.msg}</p>
        </div>
      )}

      {/* STATISTICAL CARDS STRICTLY REQUIRED BY #20 */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
        
        {/* Total */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <p className="text-gray-500 text-xs font-semibold">Total des biens</p>
          <p className="text-2xl font-extrabold text-gray-900">{totalProperties}</p>
        </div>

        {/* Disponibles */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <p className="text-gray-500 text-xs font-semibold">Disponibles</p>
          <p className="text-2xl font-extrabold text-emerald-700">{availableCount}</p>
        </div>

        {/* En Location */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#12372A]/10 text-[#12372A] flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <p className="text-gray-500 text-xs font-semibold">En location</p>
          <p className="text-2xl font-extrabold text-[#12372A]">{rentCount}</p>
        </div>

        {/* En Vente */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <p className="text-gray-500 text-xs font-semibold">En vente</p>
          <p className="text-2xl font-extrabold text-[#D4AF37]">{saleCount}</p>
        </div>

        {/* Loués */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <p className="text-gray-500 text-xs font-semibold">Biens loués</p>
          <p className="text-2xl font-extrabold text-blue-700">{rentedCount}</p>
        </div>

        {/* Vendus */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <p className="text-gray-500 text-xs font-semibold">Biens vendus</p>
          <p className="text-2xl font-extrabold text-purple-700">{soldCount}</p>
        </div>

      </div>

      {/* Recent Properties Quick Table Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-extrabold text-[#12372A]">Biens immobiliers récents</h3>
            <p className="text-gray-500 text-xs">Liste des 5 dernières annonces enregistrées</p>
          </div>
          <button
            onClick={() => onNavigate('/admin/biens')}
            className="text-xs font-bold text-[#12372A] hover:text-[#D4AF37] flex items-center space-x-1"
          >
            <span>Voir toute la liste</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-gray-400">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Réf</th>
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">Titre</th>
                  <th className="py-3 px-4">Transaction</th>
                  <th className="py-3 px-4">Prix</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {properties.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-bold text-gray-700">{p.reference}</td>
                    <td className="py-3 px-4">
                      <img src={p.main_image} alt="" className="w-12 h-9 object-cover rounded-lg" />
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900 line-clamp-1 max-w-xs">{p.title}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        p.transaction_type === 'rent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.transaction_type === 'rent' ? 'Location' : 'Vente'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-extrabold text-[#12372A]">
                      {new Intl.NumberFormat('fr-FR').format(p.price)} FCFA
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onSelectProperty && onSelectProperty(p.slug)}
                          className="p-1.5 rounded bg-gray-100 text-gray-700 hover:bg-[#12372A] hover:text-white transition-colors"
                          title="Voir l'annonce"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onNavigate(`/admin/biens/${p.id}/modifier`)}
                          className="p-1.5 rounded bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(p)}
                          className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs transition-colors flex items-center space-x-1"
                          title="Supprimer cette publication"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Supprimer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SUPABASE CONFIG MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#12372A] text-[#D4AF37] flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900">Configuration Supabase Fullstack</h3>
                  <p className="text-xs text-gray-500">Connectez vos identifiants Supabase en 1 clic</p>
                </div>
              </div>

              <button
                onClick={() => setShowConfigModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  URL du Projet Supabase *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://xxxx.supabase.co"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-xs font-mono focus:ring-2 focus:ring-[#12372A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Clé Anon Public *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2 text-xs font-mono focus:ring-2 focus:ring-[#12372A] outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={copySqlToClipboard}
                  className="text-xs font-bold text-[#12372A] hover:underline flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSql ? 'Code SQL copié !' : 'Copier le script SQL'}</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 rounded-xl border text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="bg-[#12372A] hover:bg-[#0d281e] text-white font-bold px-5 py-2 rounded-xl text-xs shadow flex items-center space-x-1"
                  >
                    <Check className="w-4 h-4 text-[#D4AF37]" />
                    <span>Activer Supabase</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DE SUPPRESSION MODAL */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-scale-up border border-gray-100">
            
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-gray-900">
                Supprimer cette publication ?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Vous êtes sur le point de supprimer la publication <strong className="text-gray-900">"{deleteCandidate.title}"</strong> (Réf: {deleteCandidate.reference}). Elle ne sera plus affichée sur le site public.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow transition-colors flex items-center space-x-2"
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Confirmer la suppression</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
