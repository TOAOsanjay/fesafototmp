import React, { useState } from 'react';
import { MediaItem, Language } from '../../types/party';

interface LiveWallSectionProps {
  lang: Language;
  mediaItems: MediaItem[];
  onOpenLightbox: (item: MediaItem) => void;
  onLikeItem: (id: string) => void;
  onOpenUpload: () => void;
}

export const LiveWallSection: React.FC<LiveWallSectionProps> = ({
  lang,
  mediaItems,
  onOpenLightbox,
  onLikeItem,
  onOpenUpload,
}) => {
  const isNl = lang === 'nl';
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [showEmptyStatePreview, setShowEmptyStatePreview] = useState(false);

  const filteredItems = mediaItems.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <section id="muur" className="py-12 sm:py-16 border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
              {isNl ? 'Live muur : Realtime feed' : 'Live Wall : Realtime feed'}
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--ink)] tracking-tight">
              {isNl ? 'Wat er vanavond gebeurt' : 'Moments from tonight'}
            </h2>
            <p className="text-sm text-[var(--ink-soft)] mt-1">
              {isNl
                ? 'Nieuwste momenten bovenaan, direct zichtbaar voor alle feestgangers.'
                : 'Newest moments first, instantly shared with everyone at the party.'}
            </p>
          </div>

          {/* Filter tabs & Empty state preview toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center p-1 bg-[var(--paper-2)] border border-[var(--border)] rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setShowEmptyStatePreview(false);
                  setFilter('all');
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  !showEmptyStatePreview && filter === 'all'
                    ? 'bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-2xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {isNl ? 'Alle' : 'All'} ({mediaItems.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEmptyStatePreview(false);
                  setFilter('photo');
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  !showEmptyStatePreview && filter === 'photo'
                    ? 'bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-2xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {isNl ? "Foto's" : 'Photos'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEmptyStatePreview(false);
                  setFilter('video');
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  !showEmptyStatePreview && filter === 'video'
                    ? 'bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-2xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {isNl ? "Video's" : 'Videos'}
              </button>
            </div>

            {/* Empty State tester button */}
            <button
              type="button"
              onClick={() => setShowEmptyStatePreview(!showEmptyStatePreview)}
              className="text-[11px] font-mono-code px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
              title="Test het lege scherm zoals voor aanvang van het feest"
            >
              {showEmptyStatePreview ? (isNl ? 'Toon foto\'s' : 'Show photos') : (isNl ? 'Lege staat' : 'Empty state')}
            </button>
          </div>
        </div>

        {/* Empty State Invitation View */}
        {showEmptyStatePreview ? (
          <div className="rounded-3xl border-2 border-dashed border-[var(--border)] p-12 text-center bg-[var(--surface)] max-w-xl mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-[var(--paper-2)] border border-[var(--border)] text-3xl flex items-center justify-center mx-auto mb-4 animate-float-gentle">
              ✨
            </div>
            <h3 className="font-display font-bold text-xl text-[var(--ink)] mb-2">
              {isNl ? 'De muur wacht op de eerste foto!' : 'The wall is waiting for the first photo!'}
            </h3>
            <p className="text-sm text-[var(--ink-soft)] mb-6 max-w-sm mx-auto">
              {isNl
                ? 'Wees de allereerste die een herinnering deelt. Scan de QR code op tafel of upload direct hier.'
                : 'Be the very first to share a memory. Scan the table card or upload directly here.'}
            </p>
            <button
              type="button"
              onClick={onOpenUpload}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[var(--accent)] hover:opacity-90 rounded-xl transition-all shadow-xs"
            >
              {isNl ? 'Plaats de eerste foto' : 'Post the first photo'}
            </button>
          </div>
        ) : (
          /* Living Mosaic Wall (Mobile Feed / Desktop Masonry Grid) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                onClick={() => onOpenLightbox(item)}
                className="group relative bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Media Container */}
                <div className="relative aspect-4/3 w-full bg-[var(--paper-2)] overflow-hidden">
                  <img
                    src={item.type === 'video' ? (item.poster || item.url) : item.url}
                    alt={item.caption}
                    loading="lazy"
                    width="600"
                    height="450"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* New Pulse Badge */}
                  {item.isNew && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent)] text-white text-[11px] font-mono-code font-bold uppercase tracking-wider shadow-sm animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>{isNl ? 'Nieuw' : 'New'}</span>
                    </div>
                  )}

                  {/* Video Badge with Duration */}
                  {item.type === 'video' && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/75 text-white text-xs font-mono-code font-medium backdrop-blur-xs">
                      <span>▶</span>
                      <span className="tabular-nums">{item.videoDuration || '0:30'}</span>
                    </div>
                  )}

                  {/* Bottom Image Overlay: Author & Timestamp */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-center justify-between text-xs">
                    <span className="font-semibold drop-shadow-xs flex items-center gap-1">
                      <span>👤</span>
                      <span>{item.author}</span>
                    </span>
                    <span className="font-mono-code opacity-85 text-[11px]">{item.timestamp}</span>
                  </div>
                </div>

                {/* Caption & Reactions bar */}
                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <p className="text-xs sm:text-sm text-[var(--ink)] font-normal line-clamp-2 mb-3 leading-snug">
                    {item.caption}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border)] text-xs text-[var(--ink-soft)]">
                    <span className="text-[11px] font-mono-code">
                      {item.type === 'video' ? (isNl ? 'Videoclip' : 'Video clip') : (isNl ? 'Origineel' : 'Photo')}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLikeItem(item.id);
                      }}
                      className="flex items-center gap-1.5 text-xs text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors active:scale-125 px-2 py-1 rounded-md hover:bg-[var(--paper-2)]"
                      aria-label="Vind dit moment leuk"
                    >
                      <span className="text-[var(--accent)]">♥</span>
                      <span className="tabular-nums font-mono-code font-semibold">{item.likes}</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
