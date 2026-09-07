import React, { useState, useEffect } from 'react';
import type { Property } from '../types/property';
import { PROPERTY_TYPE_LABELS, STATUS_LABELS } from '../types/property';
import { propertyService } from '../services/propertyService';
import { ImageGalleryModal } from '../components/properties/ImageGalleryModal';
import { 
  MapPin, Bed, Bath, Maximize2, Phone, MessageCircle, ArrowLeft, 
  CheckCircle2, Share2, ShieldCheck, Building2, Eye 
} from 'lucide-react';

interface PropertyDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ slug, onNavigate }) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      const data = await propertyService.getPropertyBySlug(slug);
      setProperty(data);
      setLoading(false);
    };
    fetchProperty();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#12372A] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 font-medium text-sm">Chargement des détails du bien...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Bien introuvable</h2>
        <p className="text-gray-500">Le bien immobilier demandé n'existe pas ou a été retiré.</p>
        <button
          onClick={() => onNavigate('/biens')}
          className="bg-[#12372A] text-white px-6 py-3 rounded-xl font-bold text-sm"
        >
          Retourner au catalogue
        </button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const isRent = property.transaction_type === 'rent';

  // WhatsApp automatic pre-filled message format required by #11:
  // "Bonjour AmanahImmo, je suis intéressé(e) par le bien AM-0001 : Appartement moderne à Mermoz."
  const whatsappMessage = `Bonjour AmanahImmo, je suis intéressé(e) par le bien ${property.reference} : ${property.title}.`;
  const whatsappUrl = `https://wa.me/221781571313?text=${encodeURIComponent(whatsappMessage)}`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const allImages = property.images && property.images.length > 0 
    ? property.images 
    : [property.main_image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <button
        onClick={() => onNavigate('/biens')}
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-[#12372A] font-semibold text-sm transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Retour aux biens</span>
      </button>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Transaction Type Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white ${
                isRent ? 'bg-[#12372A]' : 'bg-[#D4AF37]'
              }`}
            >
              {isRent ? 'À louer' : 'À vendre'}
            </span>

            {/* Property Type Badge */}
            <span className="bg-gray-100 text-[#12372A] px-3 py-1 rounded-full text-xs font-bold">
              {PROPERTY_TYPE_LABELS[property.property_type]}
            </span>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                STATUS_LABELS[property.status].color
              }`}
            >
              {STATUS_LABELS[property.status].label}
            </span>

            {/* Reference */}
            <span className="bg-gray-900 text-white font-mono px-3 py-1 rounded-full text-xs font-bold">
              Référence : {property.reference}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            {property.title}
          </h1>

          <div className="flex items-center text-gray-600 text-sm font-medium">
            <MapPin className="w-4 h-4 text-[#D4AF37] mr-1 shrink-0" />
            <span>{property.location}</span>
          </div>
        </div>

        {/* Price & Share */}
        <div className="flex flex-col md:items-end space-y-2">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#12372A]">
            {formatPrice(property.price)} <span className="text-lg font-bold text-[#D4AF37]">FCFA</span>
            {isRent && property.price_period && (
              <span className="text-sm font-normal text-gray-500"> / {property.price_period === 'month' ? 'mois' : property.price_period}</span>
            )}
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-2 text-xs text-gray-500 hover:text-[#12372A] font-semibold transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Lien copié !' : 'Partager ce bien'}</span>
          </button>
        </div>
      </div>

      {/* GALLERY SECTION */}
      <div className="space-y-4">
        {/* Main image container */}
        <div 
          onClick={() => setIsGalleryOpen(true)}
          className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-gray-100 cursor-pointer group shadow-lg"
        >
          <img
            src={allImages[activeImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-gray-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 shadow">
            <Eye className="w-4 h-4 text-[#12372A]" />
            <span>Agrandir la galerie ({allImages.length} photos)</span>
          </div>
        </div>

        {/* Thumbnails list */}
        {allImages.length > 1 && (
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-thin">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden shrink-0 transition-all ${
                  activeImageIndex === idx 
                    ? 'ring-4 ring-[#D4AF37] scale-105' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <ImageGalleryModal
        images={allImages}
        initialIndex={activeImageIndex}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        title={property.title}
      />

      {/* CONTENT GRID: Details & Contact Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left 2 cols: Main details */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Key characteristics icons row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
            {property.bedrooms !== undefined && property.bedrooms > 0 && (
              <div className="space-y-1 border-r border-gray-100 last:border-0">
                <Bed className="w-6 h-6 text-[#12372A] mx-auto" />
                <span className="block text-xs text-gray-500 font-medium">Chambres</span>
                <span className="block text-lg font-bold text-gray-900">{property.bedrooms}</span>
              </div>
            )}

            {property.bathrooms !== undefined && property.bathrooms > 0 && (
              <div className="space-y-1 border-r border-gray-100 last:border-0">
                <Bath className="w-6 h-6 text-[#12372A] mx-auto" />
                <span className="block text-xs text-gray-500 font-medium">Salles de bain</span>
                <span className="block text-lg font-bold text-gray-900">{property.bathrooms}</span>
              </div>
            )}

            {property.area !== undefined && property.area > 0 && (
              <div className="space-y-1 border-r border-gray-100 last:border-0">
                <Maximize2 className="w-6 h-6 text-[#12372A] mx-auto" />
                <span className="block text-xs text-gray-500 font-medium">Superficie</span>
                <span className="block text-lg font-bold text-gray-900">{property.area} m²</span>
              </div>
            )}

            {property.rooms !== undefined && property.rooms > 0 && (
              <div className="space-y-1">
                <Building2 className="w-6 h-6 text-[#12372A] mx-auto" />
                <span className="block text-xs text-gray-500 font-medium">Pièces</span>
                <span className="block text-lg font-bold text-gray-900">{property.rooms}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xl font-extrabold text-[#12372A]">Description du bien</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {property.description}
            </p>
          </div>

          {/* Features / Équipements */}
          {property.features && property.features.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xl font-extrabold text-[#12372A]">Équipements et caractéristiques</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Map View */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xl font-extrabold text-[#12372A] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
              <span>Localisation</span>
            </h3>
            <p className="text-sm text-gray-600">
              Quartier : <strong className="text-gray-900">{property.neighborhood || property.location}</strong> ({property.city})
            </p>
            <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-200 relative bg-gray-100">
              <iframe
                title="Google Maps Location"
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location + ' Dakar Senegal')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                loading="lazy"
              />
            </div>
          </div>

        </div>

        {/* Right 1 col: Sticky Contact Card */}
        <div className="space-y-6">
          <div className="sticky top-28 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
            
            <div className="pb-4 border-b border-gray-100 space-y-2">
              <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-wider">AmanahImmo Direct</span>
              <h3 className="text-xl font-extrabold text-[#12372A]">Intéressé par ce bien ?</h3>
              <p className="text-gray-500 text-xs">
                Ref: <span className="font-mono font-bold text-gray-800">{property.reference}</span>
              </p>
            </div>

            {/* TWO VERY VISIBLE ACTION BUTTONS STRICTLY REQUIRED BY #11 */}
            <div className="space-y-3">
              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-green-500/30 transition-all duration-200 flex items-center justify-center space-x-3 text-base"
              >
                <MessageCircle className="w-6 h-6 fill-white" />
                <span>Contacter sur WhatsApp</span>
              </a>

              {/* Call Button */}
              <a
                href="tel:+221781571313"
                className="w-full bg-[#12372A] hover:bg-[#0d281e] text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-emerald-900/30 transition-all duration-200 flex items-center justify-center space-x-3 text-base"
              >
                <Phone className="w-6 h-6 text-[#D4AF37]" />
                <span>Appeler le 78 157 13 13</span>
              </a>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 text-xs text-[#12372A] space-y-2">
              <div className="flex items-center space-x-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Garantie de service AmanahImmo</span>
              </div>
              <p className="text-gray-600 font-light">
                Aucun frais caché. Visites organisées 7j/7 avec un agent immobilier dédié.
              </p>
            </div>

            <div className="pt-2 text-center">
              <p className="text-xs text-gray-400">
                Agence située au 644 Niarry Tally, Dakar
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
