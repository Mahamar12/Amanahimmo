import React, { useState, useEffect, useMemo } from 'react';
import { PropertyCard } from '../components/properties/PropertyCard';
import { PropertyFilterBar } from '../components/properties/PropertyFilterBar';
import type { Property, PropertyFilters } from '../types/property';
import { propertyService } from '../services/propertyService';
import { Building2, SearchX } from 'lucide-react';

interface ListingsPageProps {
  onSelectProperty: (slug: string) => void;
}

export const ListingsPage: React.FC<ListingsPageProps> = ({ onSelectProperty }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<PropertyFilters>({
    transactionType: 'all',
    propertyType: 'all',
    location: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const data = await propertyService.getProperties();
      setProperties(data);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  const handleResetFilters = () => {
    setFilters({
      transactionType: 'all',
      propertyType: 'all',
      location: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  // Filter properties logic
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Transaction Filter
      if (filters.transactionType !== 'all' && p.transaction_type !== filters.transactionType) {
        return false;
      }
      // Property Type Filter
      if (filters.propertyType !== 'all' && p.property_type !== filters.propertyType) {
        return false;
      }
      // Location Search
      if (filters.location.trim() !== '') {
        const query = filters.location.toLowerCase();
        const matchesLoc = p.location.toLowerCase().includes(query) || 
                           p.city.toLowerCase().includes(query) ||
                           (p.neighborhood && p.neighborhood.toLowerCase().includes(query)) ||
                           p.title.toLowerCase().includes(query);
        if (!matchesLoc) return false;
      }
      // Price Range Filter
      if (filters.minPrice !== '' && p.price < parseFloat(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice !== '' && p.price > parseFloat(filters.maxPrice)) {
        return false;
      }

      return true;
    });
  }, [properties, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-6">
        <div className="flex items-center space-x-2 text-[#D4AF37] font-bold text-xs uppercase tracking-wider mb-1">
          <Building2 className="w-4 h-4" />
          <span>Catalogue AmanahImmo</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12372A]">
          Nos biens immobiliers
        </h1>
        <p className="text-gray-600 text-sm mt-2">
          Découvrez notre sélection complète de maisons, appartements, villas, bureaux et terrains à louer et à vendre au Sénégal.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <PropertyFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Results Header */}
      <div className="flex justify-between items-center text-sm font-semibold text-gray-700 pt-2">
        <span>
          {filteredProperties.length} {filteredProperties.length > 1 ? 'biens trouvés' : 'bien trouvé'}
        </span>
        {(filters.transactionType !== 'all' || filters.propertyType !== 'all' || filters.location || filters.minPrice || filters.maxPrice) && (
          <button
            onClick={handleResetFilters}
            className="text-xs text-[#D4AF37] hover:underline font-bold"
          >
            Réinitialiser tous les filtres
          </button>
        )}
      </div>

      {/* Properties Grid: 3 cols desktop, 2 cols tablet, 1 col mobile */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
          ))}
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-xl mx-auto my-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-[#D4AF37] flex items-center justify-center mx-auto">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Aucun bien ne correspond à votre recherche.
          </h3>
          <p className="text-gray-500 text-sm">
            Essayez de modifier ou d'élargir vos critères de recherche pour afficher plus de résultats.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 inline-flex items-center space-x-2 bg-[#12372A] hover:bg-[#0d281e] text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow"
          >
            <span>Afficher tous les biens</span>
          </button>
        </div>
      )}

    </div>
  );
};
