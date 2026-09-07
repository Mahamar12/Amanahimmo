import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#12372A] text-white pt-16 pb-8 border-t border-[#12372A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="AmanahImmo Logo" 
                className="h-10 w-auto object-contain rounded-lg bg-white/90 p-1 shadow" 
              />
              <span className="font-extrabold text-2xl tracking-tight">
                Amanah<span className="text-[#D4AF37]">Immo</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Votre partenaire immobilier de confiance à Dakar. Nous vous accompagnons dans vos projets d'achat, de vente, de location et de gestion immobilière au Sénégal.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/221781571313?text=Bonjour%20AmanahImmo,%20je%20souhaite%20des%20renseignements."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Discussion WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="text-[#D4AF37] font-semibold text-base mb-4 tracking-wider uppercase">Navigation</h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors">
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/biens')} className="hover:text-white transition-colors">
                  Nos biens immobiliers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/a-propos')} className="hover:text-white transition-colors">
                  À propos d'AmanahImmo
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors">
                  Nos services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                  Nous contacter
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Summary */}
          <div>
            <h3 className="text-[#D4AF37] font-semibold text-base mb-4 tracking-wider uppercase">Nos expertises</h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>Location d'appartements et villas</li>
              <li>Vente immobilière & terrains</li>
              <li>Gestion locative & syndic</li>
              <li>Recherche personnalisée de biens</li>
              <li>Conseil en investissement immobilier</li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h3 className="text-[#D4AF37] font-semibold text-base mb-4 tracking-wider uppercase">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>644 Niarry Tally, Dakar, Sénégal</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <a href="tel:+221781571313" className="hover:text-white font-medium">
                  78 157 13 13
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <a href="mailto:amanahimmo13@gmail.com" className="hover:text-white">
                  amanahimmo13@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400">
          <p>© 2026 AmanahImmo — Tous droits réservés.</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-6">
            <button onClick={() => onNavigate('/@dmin-amanahimmo/login')} className="hover:text-[#D4AF37]">
              Espace Administrateur
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
