import React, { useState, useEffect } from 'react';
import { MediaItem, Language } from '../../types/party';
import { partyConfig } from '../../data/partyData';

interface BeamerViewProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItems: MediaItem[];
  lang: Language;
}

export const BeamerView: React.FC<BeamerViewProps> = ({
  isOpen,
  onClose,
  mediaItems,
  lang,
}) => {
  const isNl = lang === 'nl';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [countdownSec, setCountdownSec] = useState(5);

  const safeItems = mediaItems.filter((i) => i.status === 'geaccepteerd');
  const currentPhoto = safeItems[currentIndex] || safeItems[0];

  // Auto cycling
  useEffect(() => {
    if (!isOpen || !isPlaying || safeItems.length === 0) return;

    const timer = setInterval(() => {
      setCountdownSec((c) => {
        if (c <= 1) {
          setCurrentIndex((idx) => (idx + 1) % safeItems.length);
          return 5;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, safeItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setCurrentIndex((idx) => (idx + 1) % safeItems.length);
        setCountdownSec(5);
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((idx) => (idx - 1 + safeItems.length) % safeItems.length);
        setCountdownSec(5);
      }
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, safeItems.length]);

  if (!isOpen || !currentPhoto) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#0e0c0a] text-white flex flex-col justify-between p-4 sm:p-8 select-none animate-in fade-in duration-300"
    >
      {/* Top Ambient Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-white font-display font-extrabold flex items-center justify-center text-sm">
            FF
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white tracking-tight">
              {partyConfig.name}
            </h2>
            <p className="text-[11px] font-mono-code text-[var(--accent-soft)]">
              {partyConfig.subdomain}
            </p>
          </div>
        </div>

        {/* Right Info: QR Chip & Close button */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-mono-code">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
            <span>{isNl ? 'Live Beamer Modus' : 'Live Projector Mode'}</span>
            <span className="text-white/40">·</span>
            <span>{isNl ? `Volgende over ${countdownSec}s` : `Next in ${countdownSec}s`}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
          >
            {isNl ? 'Sluit beamer (ESC)' : 'Exit projector (ESC)'} ✕
          </button>
        </div>
      </div>

      {/* Main Cinema View */}
      <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
        <div className="relative max-h-[72vh] max-w-5xl w-full flex flex-col items-center justify-center">
          {/* Active Photo Container with soft glow */}
          <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black max-h-[66vh] max-w-full">
            <img
              src={currentPhoto.type === 'video' ? (currentPhoto.poster || currentPhoto.url) : currentPhoto.url}
              alt={currentPhoto.caption}
              className="max-h-[64vh] w-auto object-contain transition-opacity duration-700"
              referrerPolicy="no-referrer"
            />
            {currentPhoto.type === 'video' && (
              <span className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-black/80 text-white font-mono-code text-xs">
                ▶ {currentPhoto.videoDuration}
              </span>
            )}
          </div>

          {/* Caption & Author Callout */}
          <div className="mt-4 text-center max-w-2xl px-4">
            <p className="font-display font-medium text-lg sm:text-2xl text-white/95 leading-snug">
              "{currentPhoto.caption}"
            </p>
            <div className="mt-1 text-xs font-mono-code text-white/60">
              {isNl ? 'Geüpload door' : 'Uploaded by'} {currentPhoto.author} · {currentPhoto.timestamp}
            </div>
          </div>
        </div>

        {/* Ambient Corner QR Floating Stamp for Guests in Venue */}
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 hidden md:flex items-center gap-3 shadow-lg">
          <div className="p-1 bg-white rounded-lg">
            <svg viewBox="0 0 40 40" width="48" height="48" className="shape-rendering-crispEdges">
              <rect width="40" height="40" fill="#ffffff" />
              <rect x="4" y="4" width="12" height="12" fill="#1c1917" />
              <rect x="6" y="6" width="8" height="8" fill="#ffffff" />
              <rect x="8" y="8" width="4" height="4" fill="#c2410c" />
              <rect x="24" y="4" width="12" height="12" fill="#1c1917" />
              <rect x="26" y="6" width="8" height="8" fill="#ffffff" />
              <rect x="28" y="8" width="4" height="4" fill="#c2410c" />
              <rect x="4" y="24" width="12" height="12" fill="#1c1917" />
              <rect x="6" y="26" width="8" height="8" fill="#ffffff" />
              <rect x="8" y="28" width="4" height="4" fill="#c2410c" />
              <rect x="18" y="6" width="4" height="8" fill="#1c1917" />
              <rect x="18" y="18" width="8" height="8" fill="#1c1917" />
              <rect x="28" y="18" width="8" height="4" fill="#1c1917" />
              <rect x="18" y="28" width="4" height="8" fill="#1c1917" />
              <rect x="26" y="26" width="10" height="10" fill="#1c1917" />
            </svg>
          </div>
          <div className="text-[11px] leading-tight text-white/90">
            <div className="font-bold text-[var(--accent-soft)]">
              {isNl ? 'Scan en verschijn live!' : 'Scan and appear live!'}
            </div>
            <div className="font-mono-code text-[10px] text-white/70">
              {partyConfig.subdomain}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Timeline & Controls */}
      <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs font-mono-code text-white/60">
        <div>
          {isNl ? 'Foto' : 'Photo'} <span className="text-white font-bold">{currentIndex + 1}</span>{' '}
          {isNl ? 'van' : 'of'} {safeItems.length}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setCurrentIndex((idx) => (idx - 1 + safeItems.length) % safeItems.length);
              setCountdownSec(5);
            }}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-white"
          >
            ← {isNl ? 'Vorige' : 'Prev'}
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="px-3 py-1 bg-white/15 hover:bg-white/25 text-white font-bold rounded"
          >
            {isPlaying ? (isNl ? 'Pauze ⏸' : 'Pause ⏸') : (isNl ? 'Afspelen ▶' : 'Play ▶')}
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentIndex((idx) => (idx + 1) % safeItems.length);
              setCountdownSec(5);
            }}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-white"
          >
            {isNl ? 'Volgende' : 'Next'} →
          </button>
        </div>

        <div className="hidden sm:block text-white/40">
          Spatiebalk = pauze
        </div>
      </div>
    </div>
  );
};
