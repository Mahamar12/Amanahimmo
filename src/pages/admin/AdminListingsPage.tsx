import React, { useState, useEffect } from 'react';
import type { Property } from '../../types/property';
import { PROPERTY_TYPE_LABELS, STATUS_LABELS } from '../../types/property';
import { propertyService } from '../../services/propertyService';
import { 
  Building2, Plus, Edit, Trash2, Eye, Star, Search, Filter, AlertTriangle, X 
} from 'lucide-react';

interface AdminListingsPageProps {
  onNavigate: (path: string) => void;
  onSelectProperty: (slug: string) => void;
}

export const AdminListingsPage: React.FC<AdminListingsPageProps> = ({ onNavigate, onSelectProperty }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    const data = await propertyService.getProperties();
    setProperties(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleToggleFeatured = async (property: Property) => {
    const updated = await propertyService.updateProperty(property.id, {
      featured: !property.featured
    });
    if (updated) {
      setProperties(prev => prev.map(p => p.id === property.id ? updated : p));
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    setDeleting(true);
    await propertyService.deleteProperty(deleteCandidate.id);
    setDeleting(false);
    setDeleteCandidate(null);
    fetchProperties();
  };

  const filteredProperties = properties.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || 
             p.reference.toLowerCase().includes(q) || 
             p.location.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[#D4AF37] font-bold text-xs uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Gestion du catalogue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#12372A]">Gestion des biens</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Modifiez, mettez à jour le statut, attribuez le statut "À la une" ou supprimez des annonces.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/@dmin-amanahimmo/biens/nouveau')}
          className="bg-[#12372A] hover:bg-[#0d281e] text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl shadow transition-all flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Nouveau bien</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Rechercher par titre, réf, zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#12372A] outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#12372A] outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="rented">Loué</option>
            <option value="sold">Vendu</option>
            <option value="unavailable">Indisponible</option>
          </select>
        </div>

      </div>

      {/* Listings Table strictly as required by #21 */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">Chargement de la liste...</div>
        ) : filteredProperties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-4">Photo</th>
                  <th className="py-4 px-4">Réf</th>
                  <th className="py-4 px-4">Titre</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Transaction</th>
                  <th className="py-4 px-4">Prix</th>
                  <th className="py-4 px-4">Localisation</th>
                  <th className="py-4 px-4">Statut</th>
                  <th className="py-4 px-4 text-center">À la une</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {filteredProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Photo */}
                    <td className="py-3 px-4">
                      <img src={p.main_image} alt="" className="w-14 h-10 object-cover rounded-lg shadow-xs" />
                    </td>

                    {/* Reference */}
                    <td className="py-3 px-4 font-mono font-bold text-gray-800">{p.reference}</td>

                    {/* Title */}
                    <td className="py-3 px-4 font-bold text-gray-900 line-clamp-2 max-w-xs">{p.title}</td>

                    {/* Property Type */}
                    <td className="py-3 px-4 text-gray-600 font-medium">{PROPERTY_TYPE_LABELS[p.property_type]}</td>

                    {/* Transaction */}
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                        p.transaction_type === 'rent' ? 'bg-[#12372A] text-white' : 'bg-[#D4AF37] text-white'
                      }`}>
                        {p.transaction_type === 'rent' ? 'Location' : 'Vente'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-extrabold text-[#12372A] whitespace-nowrap">
                      {new Intl.NumberFormat('fr-FR').format(p.price)} FCFA
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-gray-600 truncate max-w-[140px]">{p.location}</td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        STATUS_LABELS[p.status].color
                      }`}>
                        {STATUS_LABELS[p.status].label}
                      </span>
                    </td>

                    {/* Featured Star Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`p-1.5 rounded-full transition-colors ${
                          p.featured ? 'text-[#D4AF37] hover:bg-amber-50' : 'text-gray-300 hover:text-amber-400'
                        }`}
                        title={p.featured ? "Retirer de la une" : "Mettre à la une"}
                      >
                        <Star className={`w-5 h-5 ${p.featured ? 'fill-[#D4AF37]' : ''}`} />
                      </button>
                    </td>

                    {/* Actions: Voir, Modifier, Supprimer */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onSelectProperty(p.slug)}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-[#12372A] text-gray-700 hover:text-white transition-colors"
                          title="Voir l'annonce publique"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onNavigate(`/@dmin-amanahimmo/biens/${p.id}/modifier`)}
                          className="p-2 rounded-lg bg-amber-50 hover:bg-[#D4AF37] text-amber-800 hover:text-white transition-colors"
                          title="Modifier le bien"
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
        ) : (
          <div className="py-16 text-center text-gray-500 space-y-2">
            <p className="font-semibold">Aucun bien ne correspond aux filtres actuels.</p>
          </div>
        )}
      </div>

      {/* CONFIRMATION DE SUPPRESSION MODAL STRICTLY REQUIRED BY #24 */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-scale-up border border-gray-100">
            
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                onClick={() => setDeleteCandidate(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-gray-900">
                Êtes-vous sûr de vouloir supprimer ce bien ?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Vous êtes sur le point de supprimer l'annonce <strong className="text-gray-900">"{deleteCandidate.title}"</strong> (Réf: {deleteCandidate.reference}). Cette action est irréversible.
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
                  <span>Supprimer</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
