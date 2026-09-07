import React from 'react';
import { Search, MapPin, Home, Tag, RefreshCw } from 'lucide-react';
import type { PropertyFilters, PropertyType, TransactionType } from '../../types/property';
import { PROPERTY_TYPE_LABELS } from '../../types/property';

interface PropertyFilterBarProps {
  filters: PropertyFilters;
  onFilterChange: (filters: PropertyFilters) => void;
  onReset?: () => void;
  compact?: boolean;
}

export const PropertyFilterBar: React.FC<PropertyFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  compact = false,
}) => {
  const handleChange = (field: keyof PropertyFilters, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 ${compact ? 'max-w-5xl mx-auto' : 'w-full'}`}>
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-100">
        <Search className="w-5 h-5 text-[#D4AF37]" />
        <h2 className="text-lg font-bold text-gray-900">Trouvez votre prochain bien</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        
        {/* Transaction Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#12372A]" /> Transaction
          </label>
          <select
            value={filters.transactionType}
            onChange={(e) => handleChange('transactionType', e.target.value as 'all' | TransactionType)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#12372A] focus:border-transparent outline-none transition-all"
          >
            <option value="all">Toutes (Location & Vente)</option>
            <option value="rent">Location</option>
            <option value="sale">Vente</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-[#12372A]" /> Type de bien
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => handleChange('propertyType', e.target.value as 'all' | PropertyType)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#12372A] focus:border-transparent outline-none transition-all"
          >
            <option value="all">Tous les types</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Location Search */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#12372A]" /> Localisation
          </label>
          <input
            type="text"
            placeholder="Ex: Mermoz, Almadies, Dakar..."
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#12372A] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Prix maximum (FCFA)
          </label>
          <input
            type="number"
            placeholder="Ex: 500000 ou 100000000"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#12372A] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Search & Reset Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 bg-[#12372A] hover:bg-[#0d281e] text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4 text-[#D4AF37]" />
            <span>Rechercher</span>
          </button>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              title="Réinitialiser les filtres"
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2.5 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
