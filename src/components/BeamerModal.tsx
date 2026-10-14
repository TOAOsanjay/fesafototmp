import React, { useState, useEffect } from 'react';
import { PhotoItem } from '../types';

interface BeamerModalProps {
  photos: PhotoItem[];
  isOpen: boolean;
  onClose: () => void;
  albumSlug?: string;
}

export const BeamerModal: React.FC<BeamerModalProps> = ({
  photos,
  isOpen,
  onClose,
  albumSlug = 'daanensophie',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isOpen || !isPlaying || photos.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, photos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex((p) => (p + 1) % photos.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((p) => (p - 1 + photos.length) % photos.length);
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, photos.length, onClose]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#0d0c0b] text-white flex flex-col justify-between p-6 sm:p-10 select-none"
    >
      {/* Top Bar for Venue Screens */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold font-sans-clean tracking-tight">
            fesafotos<span className="text-[#c2410c]">.</span>
          </span>
          <span className="text-white/40">/</span>
          <span className="font-mono-code text-sm text-[#fbd38d]">
            {albumSlug}.fesafotos.nl
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono-code">
          <span className="text-white/70 hidden sm:inline">
            Scan de QR op tafel & verschijn direct op het scherm
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-xs transition-colors"
          >
            Sluit beamer (ESC) ✕
          </button>
        </div>
      </div>

      {/* Main Slideshow Frame */}
      <div className="flex-1 flex items-center justify-center py-6 relative">
        <div className="relative max-h-full max-w-5xl w-full flex flex-col items-center">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black max-h-[70vh]">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.caption}
              className="max-h-[70vh] w-auto object-contain transition-opacity duration-700"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="mt-5 text-center max-w-xl">
            <p className="font-editorial italic text-lg sm:text-2xl text-white/95 leading-snug">
              "{currentPhoto.caption}"
            </p>
            <div className="mt-2 text-xs font-mono-code text-white/60">
              Door {currentPhoto.author} · {currentPhoto.timestamp}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar Controls */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono-code text-white/60">
        <div>
          Foto <span className="text-white font-bold">{currentIndex + 1}</span> van{' '}
          {photos.length}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentIndex((p) => (p - 1 + photos.length) % photos.length)}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-white"
          >
            ← Vorige
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="px-3 py-1 bg-white/15 hover:bg-white/25 text-white font-bold rounded"
          >
            {isPlaying ? 'Pauze ⏸' : 'Afspelen ▶'}
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex((p) => (p + 1) % photos.length)}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-white"
          >
            Volgende →
          </button>
        </div>

        <div className="hidden sm:block">
          Spatiebalk = pauze / play
        </div>
      </div>
    </div>
  );
};
