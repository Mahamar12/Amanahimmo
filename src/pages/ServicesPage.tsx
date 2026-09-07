import React from 'react';
import { Key, Home, Building, Search, HelpCircle, ArrowRight, MessageCircle, Phone } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const servicesList = [
    {
      icon: Key,
      title: 'Location',
      desc: 'Nous vous aidons à trouver un logement adapté à vos besoins.',
      details: ['Appartements, villas et studios meublés ou nus', 'Gestion des dossiers de candidature', 'Rédaction et signature sécurisée des baux']
    },
    {
      icon: Home,
      title: 'Vente',
      desc: 'Nous vous accompagnons dans vos projets d\'achat et de vente immobilière.',
      details: ['Estimation juste de votre bien sur le marché dakarois', 'Valorisation et publication d’annonces premium', 'Négociation et suivi notarié jusqu\'à la remise des clés']
    },
    {
      icon: Building,
      title: 'Gestion immobilière',
      desc: 'Nous proposons des solutions pour faciliter la gestion de vos biens immobiliers.',
      details: ['Quittance & recouvrement rigoureux des loyers', 'Suivi de l’entretien et des réparations', 'Compte-rendu de gestion mensuel pour propriétaires']
    },
    {
      icon: Search,
      title: 'Recherche de biens',
      desc: 'Nous vous aidons à rechercher un bien correspondant à vos critères.',
      details: ['Chasseur immobilier sur mesure à Dakar', 'Accès prioritaire aux nouvelles offres avant publication', 'Visites guidées et vérification des titres fonciers']
    },
    {
      icon: HelpCircle,
      title: 'Conseil immobilier',
      desc: 'Nous vous accompagnons dans vos décisions immobilières.',
      details: ['Conseils juridiques & fiscaux au Sénégal', 'Étude de rentabilité locative', 'Assistance investissement foncier']
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-[#12372A] text-white py-16 px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest">Solutions sur mesure</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Nos services</h1>
        <p className="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto font-light">
          AmanahImmo met son savoir-faire et son réseau au service de la réussite de vos projets immobiliers à Dakar.
        </p>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#12372A]/10 text-[#12372A] flex items-center justify-center group-hover:bg-[#12372A] group-hover:text-[#D4AF37] transition-colors duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-[#12372A]">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.desc}
                  </p>
                  
                  <ul className="space-y-2 pt-2 border-t border-gray-100">
                    {service.details.map((detail, dIdx) => (
                      <li key={dIdx} className="text-xs text-gray-500 flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onNavigate('/contact')}
                  className="w-full py-3 bg-gray-50 hover:bg-[#12372A] text-[#12372A] hover:text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                >
                  <span>En savoir plus</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-[#12372A] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Besoin d'un service spécifique ?</h3>
            <p className="text-gray-300 text-sm">Discutez directement avec un expert AmanahImmo à Dakar.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/221781571313?text=Bonjour%20AmanahImmo,%20je%20souhaite%20des%20informations%20sur%20vos%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </a>

            <a
              href="tel:+221781571313"
              className="bg-[#D4AF37] hover:bg-[#b89628] text-[#12372A] font-bold py-3 px-6 rounded-xl text-sm flex items-center justify-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>78 157 13 13</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
