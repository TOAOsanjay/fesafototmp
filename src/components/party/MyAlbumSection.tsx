import React, { useState } from 'react';
import { MediaItem, Language, ReviewStatus } from '../../types/party';

interface MyAlbumSectionProps {
  lang: Language;
  mediaItems: MediaItem[];
  onOpenUpload: () => void;
  onOpenLightbox: (item: MediaItem) => void;
  onDeleteGuestItem?: (id: string) => void;
  highlightAlbum: boolean;
}

export const MyAlbumSection: React.FC<MyAlbumSectionProps> = ({
  lang,
  mediaItems,
  onOpenUpload,
  onOpenLightbox,
  onDeleteGuestItem,
  highlightAlbum,
}) => {
  const isNl = lang === 'nl';
  const [filterState, setFilterState] = useState<'all' | ReviewStatus>('all');
  const [isDragOver, setIsDragOver] = useState(false);

  // All guest-owned items plus sample items representing the user's session
  const myItems = mediaItems.filter((i) => i.isGuestOwner || i.author === 'Sanne' || i.author === 'Youssef');

  const filteredMyItems = myItems.filter((i) => {
    if (filterState === 'all') return true;
    return i.status === filterState;
  });

  const pendingItems = myItems.filter((i) => i.status === 'in_beoordeling');

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onOpenUpload();
  };

  return (
    <section
      id="mijn-album"
      className={`py-12 sm:py-16 border-b border-[var(--border)] transition-all ${
        highlightAlbum ? 'animate-highlight-pulse bg-[var(--paper-2)]/60' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
              {isNl ? 'Mijn Album : Jouw uploads' : 'My Album : Your uploads'}
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--ink)] tracking-tight">
              {isNl ? 'Jouw persoonlijke feestverzameling' : 'Your personal party collection'}
            </h2>
            <p className="text-sm text-[var(--ink-soft)] mt-1">
              {isNl
                ? 'Alles wat jij vandaag uploadt, staat hier overzichtelijk bij elkaar.'
                : 'Everything you upload today is safely stored and organized right here.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code text-[var(--ink-soft)] px-3 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
              {myItems.length} {isNl ? 'items geüpload' : 'items uploaded'}
            </span>
          </div>
        </div>

        {/* Big Inviting Drop Tile with Drag & Drop and Folder Support */}
        <div
          onClick={onOpenUpload}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group mb-10 ${
            isDragOver
              ? 'border-[var(--accent)] bg-[var(--accent-soft)]/20 scale-[1.01]'
              : 'border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface)]'
          }`}
        >
          {/* Confetti decoration */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[var(--paper-2)] border border-[var(--border)] text-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            📸
          </div>

          <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--ink)] mb-1.5">
            {isNl ? 'Tik hier of sleep jouw foto\'s en video\'s' : 'Tap here or drag and drop your photos and videos'}
          </h3>

          <p className="text-sm text-[var(--ink-soft)] max-w-md mx-auto mb-4 leading-relaxed">
            {isNl
              ? 'Foto\'s en video\'s van harte welkom! Je kunt losse bestanden of zelfs een hele map in één keer neerzetten.'
              : 'Photos and videos warmly welcome! Drop single files or an entire folder at once.'}
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold shadow-xs group-hover:opacity-90">
            <span>+</span>
            <span>{isNl ? 'Kies bestanden of map' : 'Select files or folder'}</span>
          </div>
        </div>

        {/* Review Workspace for items in review */}
        {pendingItems.length > 0 && (
          <div className="mb-8 p-4.5 rounded-2xl bg-[#fffbeb] border border-[#fde68a] text-[#92400e]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase font-mono-code tracking-wider">
                <span>⏳</span>
                <span>{isNl ? 'Review Workspace : In Beoordeling' : 'Review Workspace : In Moderation'}</span>
              </div>
              <span className="text-xs font-semibold">
                {pendingItems.length} {isNl ? 'wacht op goedkeuring' : 'awaiting approval'}
              </span>
            </div>
            <p className="text-xs text-[#92400e]/90 leading-relaxed">
              {isNl
                ? 'Deze foto\'s zijn veilig geüpload naar jouw album en worden door Sanjay & Dewie goedgekeurd voordat ze op de publieke beamer muur verschijnen.'
                : 'These photos are safely saved in your album and will be approved by the host before appearing on the public live wall.'}
            </p>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-[var(--border)]">
          <div className="flex items-center p-1 bg-[var(--paper-2)] border border-[var(--border)] rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilterState('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterState === 'all'
                  ? 'bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-2xs'
                  : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              {isNl ? 'Alle eigen items' : 'All my items'} ({myItems.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterState('geaccepteerd')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterState === 'geaccepteerd'
                  ? 'bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-2xs'
                  : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              {isNl ? 'Geaccepteerd' : 'Accepted'}
            </button>
            <button
              type="button"
              onClick={() => setFilterState('in_beoordeling')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterState === 'in_beoordeling'
                  ? 'bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-2xs'
                  : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              {isNl ? 'In beoordeling' : 'Pending'}
            </button>
            <button
              type="button"
              onClick={() => setFilterState('verborgen')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterState === 'verborgen'
                  ? 'bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-2xs'
                  : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              {isNl ? 'Verborgen' : 'Hidden'}
            </button>
          </div>
        </div>

        {/* Guest Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredMyItems.map((item) => {
            const statusConfig = {
              geaccepteerd: {
                label: isNl ? 'Geaccepteerd' : 'Accepted',
                color: 'bg-[var(--success)] text-white',
              },
              in_beoordeling: {
                label: isNl ? 'In beoordeling' : 'In review',
                color: 'bg-[#d97706] text-white',
              },
              verborgen: {
                label: isNl ? 'Verborgen' : 'Hidden',
                color: 'bg-[#57534e] text-white',
              },
            }[item.status];

            return (
              <div
                key={item.id}
                onClick={() => onOpenLightbox(item)}
                className="group relative bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full bg-[var(--paper-2)] overflow-hidden">
                  <img
                    src={item.type === 'video' ? (item.poster || item.url) : item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Status Ribbon */}
                  <span
                    className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase tracking-wider shadow-xs ${statusConfig.color}`}
                  >
                    {statusConfig.label}
                  </span>

                  {item.type === 'video' && (
                    <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-black/75 text-white text-[10px] font-mono-code">
                      ▶ {item.videoDuration}
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <p className="text-xs text-[var(--ink)] line-clamp-1 font-medium mb-1">
                    {item.caption}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[var(--ink-soft)] font-mono-code">
                    <span>{item.timestamp}</span>
                    <span className="text-[var(--accent)] font-bold">♥ {item.likes}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
