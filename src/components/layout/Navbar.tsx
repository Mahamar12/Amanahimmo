import React, { useState } from 'react';
import { Phone, MessageCircle, Menu, X, UserCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Nos biens', path: '/biens' },
    { label: 'À propos', path: '/a-propos' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Top micro bar for quick contacts */}
      <div className="bg-[#12372A] text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span>📍 644 Niarry Tally, Dakar, Sénégal</span>
            <a href="mailto:amanahimmo13@gmail.com" className="hover:text-[#D4AF37] transition-colors">
              ✉️ amanahimmo13@gmail.com
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => handleLinkClick('/@dmin-amanahimmo')} 
                  className="flex items-center space-x-1 text-[#D4AF37] hover:underline font-medium"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Espace Admin</span>
                </button>
                <span>|</span>
                <button 
                  onClick={() => { logout(); handleLinkClick('/'); }}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleLinkClick('/@dmin-amanahimmo/login')} 
                className="text-gray-300 hover:text-[#D4AF37] transition-colors"
              >
                Accès Admin
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <button 
            onClick={() => handleLinkClick('/')} 
            className="flex items-center space-x-3 text-left focus:outline-none group"
          >
            <img 
              src="/logo.png" 
              alt="AmanahImmo Logo" 
              className="h-16 sm:h-14 w-auto object-contain rounded-xl mix-blend-multiply group-hover:scale-105 transition-transform duration-200" 
            />
            <div className="hidden sm:block">
              <span className="font-extrabold text-2xl tracking-tight text-[#12372A]">
                Amanah<span className="text-[#D4AF37]">Immo</span>
              </span>
              <p className="text-[10px] text-gray-500 tracking-wider uppercase font-medium">L'immobilier en confiance</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`text-sm font-semibold transition-colors duration-150 relative py-1 ${
                    isActive
                      ? 'text-[#12372A]'
                      : 'text-gray-600 hover:text-[#12372A]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37] rounded-full animate-fade-in" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Direct Contact CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:+221781571313"
              className="flex items-center space-x-2 text-[#12372A] hover:text-[#0d281e] font-bold text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4 text-[#12372A]" />
              <span>78 157 13 13</span>
            </a>

            <a
              href="https://wa.me/221781571313?text=Bonjour%20AmanahImmo,%20je%20souhaite%20obtenir%20des%20informations%20sur%20vos%20biens."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center space-x-3">
            <a
              href="tel:+221781571313"
              className="p-2.5 rounded-lg bg-gray-100 text-[#12372A]"
              title="Appeler"
            >
              <Phone className="w-5 h-5" />
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-lg bg-gray-100 text-gray-700 hover:text-[#12372A] focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#12372A]/10 text-[#12372A] font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {isAuthenticated ? (
              <button
                onClick={() => handleLinkClick('/@dmin-amanahimmo')}
                className="text-left px-4 py-3 rounded-lg text-base font-semibold text-[#D4AF37] bg-[#12372A]"
              >
                Tableau de bord Admin
              </button>
            ) : (
              <button
                onClick={() => handleLinkClick('/@dmin-amanahimmo/login')}
                className="text-left px-4 py-3 rounded-lg text-sm text-gray-500 hover:bg-gray-50"
              >
                Connexion administrateur
              </button>
            )}
          </div>

          {/* Mobile CTAs */}
          <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2.5">
            <a
              href="https://wa.me/221781571313?text=Bonjour%20AmanahImmo,%20je%20souhaite%20obtenir%20des%20informations%20sur%20vos%20biens."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-[#25D366] text-white font-semibold py-3 px-4 rounded-xl shadow-sm"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Contacter sur WhatsApp (+221 78 157 13 13)</span>
            </a>

            <a
              href="tel:+221781571313"
              className="flex items-center justify-center space-x-2 bg-[#12372A] text-white font-semibold py-3 px-4 rounded-xl shadow-sm"
            >
              <Phone className="w-5 h-5" />
              <span>Appeler le 78 157 13 13</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
