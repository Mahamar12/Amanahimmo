import React, { useState } from 'react';
import { MapPin, Bed, Bath, Maximize2, Heart, ArrowRight } from 'lucide-react';
import type { Property } from '../../types/property';
import { PROPERTY_TYPE_LABELS, STATUS_LABELS } from '../../types/property';

interface PropertyCardProps {
  property: Property;
  onSelect: (slug: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const isRent = property.transaction_type === 'rent';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Photo Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={property.main_image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <div className="flex flex-wrap gap-1.5">
            {/* Transaction Type Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm text-white ${
                isRent ? 'bg-[#12372A]' : 'bg-[#D4AF37]'
              }`}
            >
              {isRent ? 'Location' : 'Vente'}
            </span>

            {/* Status Badge if not available */}
            {property.status !== 'available' && (
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  STATUS_LABELS[property.status].color
                }`}
              >
                {STATUS_LABELS[property.status].label}
              </span>
            )}
          </div>

          {/* Heart favorite button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            aria-label="Ajouter aux favoris"
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-red-500 shadow transition-colors"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        {/* Property Type Floating Tag */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-white/95 backdrop-blur-md text-[#12372A] px-2.5 py-0.5 rounded-md text-xs font-semibold shadow-xs">
            {PROPERTY_TYPE_LABELS[property.property_type]}
          </span>
        </div>

        {/* Reference badge */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded text-[11px] font-mono">
            {property.reference}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Price */}
          <div className="flex items-baseline space-x-1">
            <span className="text-xl sm:text-2xl font-extrabold text-[#12372A]">
              {formatPrice(property.price)} <span className="text-sm font-bold text-[#D4AF37]">FCFA</span>
            </span>
            {isRent && property.price_period && (
              <span className="text-xs text-gray-500 font-medium">/ {property.price_period === 'month' ? 'mois' : property.price_period}</span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(property.slug)}
            className="text-lg font-bold text-gray-900 group-hover:text-[#12372A] cursor-pointer line-clamp-1 transition-colors"
          >
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-500 text-xs sm:text-sm">
            <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mr-1" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {/* Features row */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 font-medium">
          {property.bedrooms !== undefined && property.bedrooms > 0 ? (
            <div className="flex items-center space-x-1" title="Chambres">
              <Bed className="w-4 h-4 text-gray-400" />
              <span>{property.bedrooms} ch.</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1" title="Type">
              <span>{PROPERTY_TYPE_LABELS[property.property_type]}</span>
            </div>
          )}

          {property.bathrooms !== undefined && property.bathrooms > 0 && (
            <div className="flex items-center space-x-1" title="Salles de bain">
              <Bath className="w-4 h-4 text-gray-400" />
              <span>{property.bathrooms} sdb.</span>
            </div>
          )}

          {property.area !== undefined && property.area > 0 && (
            <div className="flex items-center space-x-1" title="Superficie">
              <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
              <span>{property.area} m²</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onSelect(property.slug)}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-[#12372A] text-[#12372A] hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all duration-200 group-hover:shadow-md"
        >
          <span>Voir le bien</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
