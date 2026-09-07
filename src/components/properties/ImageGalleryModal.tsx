import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';

interface ImageGalleryModalProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen || images.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between animate-fade-in p-4 sm:p-6">
      {/* Header bar */}
      <div className="flex justify-between items-center text-white z-10 pb-4 border-b border-white/10">
        <div>
          <h4 className="font-semibold text-base sm:text-lg line-clamp-1">{title || 'Galerie photos'}</h4>
          <p className="text-xs text-gray-400">
            Photo {currentIndex + 1} sur {images.length}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Display Area */}
      <div className="relative flex-1 flex items-center justify-center py-4 my-auto overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          className={`max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300 ${
            isFullscreen ? 'max-h-[90vh]' : ''
          }`}
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="flex justify-center items-center space-x-3 overflow-x-auto py-3 max-w-4xl mx-auto scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative rounded-lg overflow-hidden shrink-0 transition-all duration-200 ${
                currentIndex === idx
                  ? 'ring-2 ring-[#D4AF37] scale-105 opacity-100'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-16 h-12 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
