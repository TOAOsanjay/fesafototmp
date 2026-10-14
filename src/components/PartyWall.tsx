import React, { useState } from 'react';
import { Language, PhotoItem } from '../types';
import { translations } from '../data/translations';

interface PartyWallProps {
  lang: Language;
  photos: PhotoItem[];
  onAddPhoto: (photo: PhotoItem) => void;
  onOpenBeamer: () => void;
}

export const PartyWall: React.FC<PartyWallProps> = ({
  lang,
  photos,
  onAddPhoto,
  onOpenBeamer,
}) => {
  const t = translations[lang].stage3;
  const [filter, setFilter] = useState<'all' | 'guest' | 'photographer'>('all');
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Guest upload form state
  const [guestName, setGuestName] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedPresetUrl, setSelectedPresetUrl] = useState('/src/assets/images/party_guest_moments_grid_1791985661203.jpg');
  const [localLikes, setLocalLikes] = useState<Record<string, number>>({});

  const filteredPhotos = photos.filter((p) => {
    if (filter === 'all') return true;
    return p.authorType === filter;
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalLikes((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }));
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const newPhoto: PhotoItem = {
      id: `guest-${Date.now()}`,
      url: selectedPresetUrl,
      caption: caption.trim() || 'Net geüpload vanaf de dansvloer! ✨',
      author: guestName.trim(),
      authorType: 'guest',
      timestamp: 'Zojuist',
      likes: 1,
    };

    onAddPhoto(newPhoto);
    setIsUploadModalOpen(false);
    setGuestName('');
    setCaption('');
  };

  return (
    <section className="py-16 lg:py-24 border-b border-[#e7ded1] bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="text-xs font-mono-code font-semibold tracking-wider text-[#c2410c] uppercase mb-2">
            {t.kicker}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1c1917] tracking-tight font-sans-clean">
            {t.title}
          </h2>
        </div>

        {/* Narrative & Pro Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-6 space-y-4 text-base text-[#57534e] leading-relaxed">
            <p>{t.copy1}</p>
            <p>{t.copy2}</p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#e2d8ca]">
              <div className="text-xs font-bold font-sans-clean text-[#1c1917] mb-1.5 flex items-center gap-1.5">
                <span className="text-[#c2410c]">●</span>
                <span>{t.proPanelTitle}</span>
              </div>
              <p className="text-xs text-[#78716c] leading-normal">
                {t.proPanelDesc}
              </p>
            </div>

            <div className="bg-[#f5ede2] p-5 rounded-xl border border-[#e2d8ca]">
              <div className="text-xs font-bold font-sans-clean text-[#1c1917] mb-1.5 flex items-center gap-1.5">
                <span className="text-[#c2410c]">●</span>
                <span>{t.photographerPanelTitle}</span>
              </div>
              <p className="text-xs text-[#78716c] leading-normal">
                {t.photographerPanelDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Live Interactive Album Demo Container */}
        <div className="bg-white rounded-2xl border border-[#e2d8ca] p-6 sm:p-8 shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#f0e8db]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code text-[#78716c] uppercase">
                {t.liveAlbumBadge} · daanensophie.fesafotos.nl
              </span>
            </div>

            {/* Filter Tabs & Action Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center p-1 bg-[#f4ebe0] rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    filter === 'all'
                      ? 'bg-white text-[#1c1917] font-semibold shadow-xs'
                      : 'text-[#78716c] hover:text-[#1c1917]'
                  }`}
                >
                  {t.allPhotos} ({photos.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('guest')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    filter === 'guest'
                      ? 'bg-white text-[#1c1917] font-semibold shadow-xs'
                      : 'text-[#78716c] hover:text-[#1c1917]'
                  }`}
                >
                  {t.guestUploads}
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('photographer')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    filter === 'photographer'
                      ? 'bg-white text-[#1c1917] font-semibold shadow-xs'
                      : 'text-[#78716c] hover:text-[#1c1917]'
                  }`}
                >
                  {t.proOriginals}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1c1917] hover:bg-[#292524] rounded-lg transition-colors whitespace-nowrap"
              >
                + {t.btnUploadGuest}
              </button>

              <button
                type="button"
                onClick={onOpenBeamer}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#1c1917] bg-[#f2e9dc] hover:bg-[#e7ded1] rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span>📽️</span>
                <span>{t.btnStartBeamer}</span>
              </button>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredPhotos.map((photo) => {
              const likes = photo.likes + (localLikes[photo.id] ?? 0);
              return (
                <div
                  key={photo.id}
                  onClick={() => setActivePhoto(photo)}
                  className="group relative rounded-xl overflow-hidden border border-[#e6dcce] bg-[#fbf8f4] cursor-pointer transition-all hover:shadow-md hover:border-[#cfc2af]"
                >
                  <div className="aspect-4/3 w-full overflow-hidden bg-[#e9ded0] relative">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {photo.isOriginalQuality && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-mono-code font-bold uppercase bg-black/80 text-white backdrop-blur-xs rounded">
                        Original RAW
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 flex flex-col justify-between">
                    <p className="text-xs text-[#292524] font-medium line-clamp-2 mb-2 leading-relaxed">
                      {photo.caption}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#78716c] pt-2 border-t border-[#f0e8db]">
                      <div className="truncate pr-1">
                        <span className="font-semibold text-[#44403c]">
                          {photo.author}
                        </span>
                        <span className="mx-1">·</span>
                        <span className="font-mono-code">{photo.timestamp}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleLike(photo.id, e)}
                        className="flex items-center gap-1 text-xs hover:text-[#c2410c] transition-colors shrink-0"
                      >
                        <span>♥</span>
                        <span className="tabular-nums font-mono-code">{likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="bg-[#faf7f2] rounded-2xl overflow-hidden max-w-2xl w-full border border-[#d6cebf] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/10 bg-black">
              <img
                src={activePhoto.url}
                alt={activePhoto.caption}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between text-xs text-[#78716c] font-mono-code mb-2">
                <span>Door: {activePhoto.author}</span>
                <span>{activePhoto.timestamp}</span>
              </div>
              <p className="text-base text-[#1c1917] font-medium mb-4">
                {activePhoto.caption}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-[#e2d8ca]">
                <span className="text-xs text-[#78716c]">
                  Onderdeel van album daanensophie.fesafotos.nl
                </span>
                <button
                  type="button"
                  onClick={() => {
                    alert('Foto opgeslagen in volledige resolutie!');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[#1c1917] text-white rounded-lg hover:bg-[#292524]"
                >
                  Download Origineel ↓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guest Upload Simulation Modal */}
      {isUploadModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#d6cebf] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#f0e8db]">
              <h3 className="text-base font-bold text-[#1c1917] font-sans-clean">
                Upload jouw foto naar het feest
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-xs text-[#78716c] hover:text-[#1c1917]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGuestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#44403c] mb-1">
                  Jouw naam
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="bijv. Thijs & Sanne"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#d6cebf] focus:outline-none focus:border-[#1c1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403c] mb-1">
                  Kies een feestmoment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPresetUrl('/src/assets/images/party_guest_moments_grid_1791985661203.jpg')
                    }
                    className={`p-1.5 rounded-lg border text-left flex items-center gap-2 ${
                      selectedPresetUrl.includes('party_guest_moments')
                        ? 'border-[#1c1917] bg-[#fbf8f4]'
                        : 'border-[#e2d8ca]'
                    }`}
                  >
                    <img
                      src="/src/assets/images/party_guest_moments_grid_1791985661203.jpg"
                      alt="Moment 1"
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span className="text-xs font-medium text-[#1c1917]">Dansvloer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPresetUrl('/src/assets/images/hero_party_celebration_1791985660408.jpg')
                    }
                    className={`p-1.5 rounded-lg border text-left flex items-center gap-2 ${
                      selectedPresetUrl.includes('hero_party_celebration')
                        ? 'border-[#1c1917] bg-[#fbf8f4]'
                        : 'border-[#e2d8ca]'
                    }`}
                  >
                    <img
                      src="/src/assets/images/hero_party_celebration_1791985660408.jpg"
                      alt="Moment 2"
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span className="text-xs font-medium text-[#1c1917]">Diner toast</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403c] mb-1">
                  Herinnering of wens (optioneel)
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Wat een geweldige avond!"
                  rows={2}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#d6cebf] focus:outline-none focus:border-[#1c1917]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#78716c] hover:text-[#1c1917]"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#1c1917] hover:bg-[#292524] rounded-lg"
                >
                  Plaats in album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
