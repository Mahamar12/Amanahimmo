import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = `https://wa.me/221781571313?text=${encodeURIComponent(
    "Bonjour AmanahImmo, je souhaite obtenir des informations sur vos biens immobiliers."
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter AmanahImmo sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95 group"
    >
      <MessageCircle className="w-6 h-6 fill-white shrink-0" />
      <span className="hidden sm:inline-block font-semibold text-sm pr-1">
        WhatsApp
      </span>
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300"></span>
      </span>
    </a>
  );
};
