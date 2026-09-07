import React from 'react';
import { Building2, ShieldCheck, Award, Users, Handshake, CheckCircle2, ArrowRight, MapPin } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Banner */}
      <section className="bg-[#12372A] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-[#D4AF37]">
            <Building2 className="w-4 h-4" />
            <span>À propos de notre agence</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            À propos d'AmanahImmo
          </h1>
          <p className="text-base sm:text-xl text-gray-200 font-light max-w-2xl mx-auto">
            AmanahImmo est une agence immobilière basée à Dakar, spécialisée dans l'accompagnement des particuliers et des professionnels dans leurs projets immobiliers au Sénégal.
          </p>
        </div>
      </section>

      {/* Main Presentation Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest">Notre vision</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12372A]">
              Votre partenaire de confiance dans le secteur immobilier sénégalais
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Fondée sur la rigueur, l'intégrité et une connaissance approfondie du marché dakarois, l'agence <strong>AmanahImmo</strong> s'est imposée comme un acteur clé de la transaction et de la gestion immobilière à Dakar.
            </p>

            {/* 5 pillars */}
            <div className="space-y-3 pt-2">
              {[
                { title: 'Notre mission', desc: 'Offrir un service immobilier sur mesure, transparent et sécurisé pour vendeurs, acheteurs et locataires.' },
                { title: 'Notre professionnalisme', desc: 'Une maîtrise rigoureuse des aspects juridiques, administratifs et fonciers au Sénégal.' },
                { title: 'Notre proximité', desc: 'Basés à Niarry Tally, nous sommes au plus proche de nos clients et du terrain.' },
                { title: 'Notre connaissance du marché', desc: 'Une expertise inégalée des quartiers de Dakar et des zones d’extension comme Diamniadio.' },
                { title: 'Notre engagement', desc: 'Garantir la clarté de chaque transaction sans mauvaise surprise ni frais dissimulés.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#12372A] text-sm">{item.title}</h4>
                    <p className="text-gray-600 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
                alt="Bureaux AmanahImmo à Dakar"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-[#12372A] text-white p-6 rounded-2xl shadow-xl hidden sm:block border-2 border-[#D4AF37]">
              <div className="flex items-center space-x-3">
                <MapPin className="w-8 h-8 text-[#D4AF37]" />
                <div>
                  <h4 className="font-bold text-base">Basé à Niarry Tally</h4>
                  <p className="text-xs text-gray-300">644 Niarry Tally, Dakar, Sénégal</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE AMANAHIMMO (Requirements #13) */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest">Nos 4 piliers</span>
            <h2 className="text-3xl font-extrabold text-[#12372A] mt-2">Pourquoi choisir AmanahImmo ?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* 1. Confiance */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#12372A]/10 text-[#12372A] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8 text-[#12372A]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confiance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nous plaçons la confiance au cœur de notre relation avec nos clients.
              </p>
            </div>

            {/* 2. Professionnalisme */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Professionnalisme</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nous vous accompagnons avec sérieux dans chaque étape de votre projet.
              </p>
            </div>

            {/* 3. Proximité */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#12372A]/10 text-[#12372A] flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-[#12372A]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Proximité</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Une équipe à votre écoute pour comprendre vos besoins.
              </p>
            </div>

            {/* 4. Accompagnement */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center mx-auto">
                <Handshake className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Accompagnement</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nous vous accompagnons dans vos projets de location, vente et gestion immobilière.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-4xl mx-auto text-center px-4">
        <button
          onClick={() => onNavigate('/biens')}
          className="inline-flex items-center space-x-3 bg-[#12372A] hover:bg-[#0d281e] text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all text-base"
        >
          <span>Découvrir nos annonces immobilières</span>
          <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
        </button>
      </section>

    </div>
  );
};
