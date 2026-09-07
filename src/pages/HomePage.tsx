import React, { useState, useEffect } from 'react';
import { PropertyCard } from '../components/properties/PropertyCard';
import { PropertyFilterBar } from '../components/properties/PropertyFilterBar';
import type { Property, PropertyFilters } from '../types/property';
import { propertyService } from '../services/propertyService';
import { ShieldCheck, Award, Users, Handshake, ArrowRight, MessageCircle, Phone, Building2 } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectProperty: (slug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProperty }) => {
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

  const handleSearchSubmit = () => {
    // Navigate to /biens with state/query params or pass current filters
    onNavigate('/biens');
  };

  // Get featured properties (max 6)
  const featuredProperties = properties
    .filter(p => p.featured)
    .slice(0, 6);

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[600px] sm:min-h-[650px] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
            alt="Immobilier de prestige au Sénégal - AmanahImmo"
            className="w-full h-full object-cover scale-105 filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#12372A]/90 via-[#12372A]/75 to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8 pt-12 pb-24">
          
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#D4AF37] animate-fade-in">
            <Building2 className="w-4 h-4" />
            <span>Votre agence immobilière de référence à Dakar</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            Trouvez le bien qui vous <span className="text-[#D4AF37]">correspond</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-200 font-light max-w-3xl mx-auto leading-relaxed">
            AmanahImmo vous accompagne dans vos projets de location, de vente et de gestion immobilière au Sénégal avec professionnalisme et transparence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('/biens')}
              className="w-full sm:w-auto bg-[#12372A] hover:bg-[#0d281e] text-white border border-[#D4AF37]/50 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-3 text-base"
            >
              <span>Voir nos biens</span>
              <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
            </button>

            <button
              onClick={() => onNavigate('/contact')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base"
            >
              Nous contacter
            </button>

            <a
              href="https://wa.me/221781571313?text=Bonjour%20AmanahImmo,%20je%20souhaite%20des%20informations%20sur%20vos%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-6 py-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 text-base"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>WhatsApp Direct</span>
            </a>
          </div>

        </div>
      </section>

      {/* SEARCH BAR (Overlapping Hero) */}
      <section className="-mt-20 relative z-20 max-w-6xl mx-auto px-4 sm:px-6">
        <PropertyFilterBar
          filters={filters}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            handleSearchSubmit();
          }}
          compact={true}
        />
      </section>

      {/* NOS BIENS À LA UNE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-gray-100 gap-4">
          <div>
            <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest">Sélection exclusive</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12372A] mt-1">Nos biens à la une</h2>
          </div>
          <button
            onClick={() => onNavigate('/biens')}
            className="inline-flex items-center space-x-2 text-[#12372A] hover:text-[#D4AF37] font-bold text-sm transition-colors group"
          >
            <span>Voir tous les biens ({properties.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-12">Aucun bien à la une disponible pour le moment.</p>
        )}
      </section>

      {/* WHY CHOOSE AMANAHIMMO */}
      <section className="bg-[#12372A]/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest">Nos engagements</span>
            <h2 className="text-3xl font-extrabold text-[#12372A] mt-2">Pourquoi choisir AmanahImmo ?</h2>
            <p className="text-gray-600 mt-3 text-sm sm:text-base">
              AmanahImmo place l'éthique, la clarté et l'excellence au cœur de chaque transaction immobilière à Dakar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Card 1: Confiance */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#12372A]/10 text-[#12372A] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8 text-[#12372A]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confiance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nous plaçons la confiance au cœur de notre relation avec nos clients pour des démarches en toute sérénité.
              </p>
            </div>

            {/* Card 2: Professionnalisme */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Professionnalisme</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nous vous accompagnons avec sérieux, réactivité et compétence technique dans chaque étape de votre projet.
              </p>
            </div>

            {/* Card 3: Proximité */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#12372A]/10 text-[#12372A] flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-[#12372A]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Proximité</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Une équipe à votre écoute constante pour comprendre précisément vos attentes et vos contraintes budgétaires.
              </p>
            </div>

            {/* Card 4: Accompagnement */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center mx-auto">
                <Handshake className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Accompagnement</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nous vous guidons étape par étape dans tous vos projets de location, de vente et de gestion immobilière.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK CONTACT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#12372A] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Un projet immobilier au Sénégal ?
            </h2>
            <p className="text-gray-200 text-sm sm:text-base font-light">
              Contactez directement nos conseillers à Niarry Tally, Dakar. Réponse rapide garantie sous quelques minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10">
            <a
              href="https://wa.me/221781571313?text=Bonjour%20AmanahImmo,%20je%20souhaite%20discuter%20d%27un%20projet%20immobilier."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3.5 px-6 rounded-xl shadow transition-all flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>WhatsApp: 78 157 13 13</span>
            </a>

            <a
              href="tel:+221781571313"
              className="bg-[#D4AF37] hover:bg-[#b89628] text-[#12372A] font-bold py-3.5 px-6 rounded-xl shadow transition-all flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Appeler le 78 157 13 13</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
