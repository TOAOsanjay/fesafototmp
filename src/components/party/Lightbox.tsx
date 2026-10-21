import React, { useEffect } from 'react';
import { MediaItem, Language } from '../../types/party';

interface LightboxProps {
  item: MediaItem | null;
  items: MediaItem[];
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onLike: (id: string) => void;
  onDelete?: (id: string) => void;
  lang: Language;
}

export const Lightbox: React.FC<LightboxProps> = ({
  item,
  items,
  isOpen,
  onClose,
  onNext,
  onPrev,
  onLike,
  onDelete,
  lang,
}) => {
  const isNl = lang === 'nl';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `sanjay_dewie_${item.id}.${item.type === 'video' ? 'mp4' : 'jpg'}`;
    link.target = '_blank';
    link.click();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 text-white select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Chrome Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-between border-b border-white/10 pb-3"
      >
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-sm tracking-tight">
            fesafotos<span className="text-[var(--accent)]">.</span>
          </span>
          <span className="text-white/30">/</span>
          <span className="text-xs font-mono-code text-white/70">
            {currentIndex + 1} {isNl ? 'van' : 'of'} {items.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Reaction Button */}
          <button
            type="button"
            onClick={() => onLike(item.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors"
          >
            <span className="text-[var(--accent)]">♥</span>
            <span className="tabular-nums font-mono-code">{item.likes}</span>
          </button>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors flex items-center gap-1"
            title="Download origineel"
          >
            <span>↓</span>
            <span className="hidden sm:inline">{isNl ? 'Download' : 'Download'}</span>
          </button>

          {/* Delete Button (if guest owner) */}
          {item.isGuestOwner && onDelete && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(isNl ? 'Weet je zeker dat je deze foto wilt verwijderen?' : 'Are you sure you want to delete this photo?')) {
                  onDelete(item.id);
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-200 text-xs font-medium transition-colors"
              title="Verwijder dit bestand"
            >
              🗑️
            </button>
          )}

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-sm font-semibold transition-colors ml-1"
            aria-label="Sluit lightbox"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main View Area with Prev / Next Buttons */}
      <div className="flex-1 flex items-center justify-center relative my-2 overflow-hidden">
        {/* Previous Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-2 sm:left-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-lg transition-transform active:scale-95"
          aria-label="Vorige foto"
        >
          ‹
        </button>

        {/* Media Canvas */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="max-w-4xl max-h-[70vh] flex items-center justify-center"
        >
          {item.type === 'video' ? (
            <video
              src={item.url}
              poster={item.poster}
              controls
              autoPlay
              playsInline
              className="max-h-[68vh] max-w-full rounded-xl object-contain bg-black shadow-2xl"
            />
          ) : (
            <img
              src={item.url}
              alt={item.caption}
              className="max-h-[68vh] max-w-full rounded-xl object-contain shadow-2xl"
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-2 sm:right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-lg transition-transform active:scale-95"
          aria-label="Volgende foto"
        >
          ›
        </button>
      </div>

      {/* Bottom Caption Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="border-t border-white/10 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 max-w-4xl mx-auto w-full text-xs"
      >
        <div className="flex-1 min-w-0">
          <p className="text-white/95 font-medium line-clamp-2 text-sm">
            {item.caption}
          </p>
          <div className="flex items-center gap-2 text-white/60 text-[11px] font-mono-code mt-0.5">
            <span>Geüpload door {item.author}</span>
            <span>·</span>
            <span>{item.timestamp}</span>
            {item.status === 'in_beoordeling' && (
              <span className="text-amber-400 font-semibold">
                [In moderatie]
              </span>
            )}
          </div>
        </div>

        <div className="text-[11px] font-mono-code text-white/40 hidden sm:block shrink-0">
          Pijltjestoetsen = navigeren, ESC = sluiten
        </div>
      </div>
    </div>
  );
};
