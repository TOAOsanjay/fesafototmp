import React, { useState } from 'react';
import { DemoAlbum, Language } from '../types';
import { translations } from '../data/translations';

interface AlbumFinderProps {
  lang: Language;
  demoAlbums: DemoAlbum[];
  onSelectAlbum: (album: DemoAlbum) => void;
}

export const AlbumFinder: React.FC<AlbumFinderProps> = ({
  lang,
  demoAlbums,
  onSelectAlbum,
}) => {
  const t = translations[lang].stage4;
  const [inputVal, setInputVal] = useState('');
  const [zipDownloading, setZipDownloading] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputVal.trim().toLowerCase();
    const match = demoAlbums.find((a) => a.slug === clean);
    if (match) {
      onSelectAlbum(match);
    } else {
      // Default to the primary demo album with that name
      const customAlbum: DemoAlbum = {
        ...demoAlbums[0],
        slug: clean || 'jouwfeest',
        name: clean ? `Album #${clean}` : demoAlbums[0].name,
      };
      onSelectAlbum(customAlbum);
    }
  };

  const handleDownloadZip = () => {
    setZipDownloading(true);
    setZipSuccess(false);
    setTimeout(() => {
      setZipDownloading(false);
      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4000);
    }, 1200);
  };

  return (
    <section id="album" className="py-16 lg:py-24 border-b border-[#e7ded1] bg-[#faf7f2]">
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

        {/* 2-Column Split: Narrative & Album Direct Opener Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 space-y-4 text-base text-[#57534e] leading-relaxed">
            <p>{t.copy1}</p>
            <p>{t.copy2}</p>

            {/* ZIP download teaser */}
            <div className="p-5 bg-white rounded-xl border border-[#e2d8ca] mt-6">
              <div className="text-xs font-mono-code text-[#c2410c] font-bold uppercase mb-1">
                Archief & Back-up
              </div>
              <p className="text-sm text-[#44403c] mb-3">
                Geen handmatige saves per foto: organisatoren downloaden het complete feest in 1 klik als geordende ZIP bundel in originele resolutie.
              </p>
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={zipDownloading}
                className="w-full px-4 py-2.5 text-xs font-semibold text-[#1c1917] bg-[#f2e9dc] hover:bg-[#e7ded1] border border-[#d6cebf] rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>{zipDownloading ? t.downloadSimNotice : t.downloadZipCta}</span>
                <span>📦</span>
              </button>
              {zipSuccess && (
                <div className="mt-2 text-xs text-[#166534] font-medium text-center">
                  ✓ ZIP-bestand gedownload: 348 foto's (4.2 GB) in originele camerakwaliteit.
                </div>
              )}
            </div>
          </div>

          {/* Form & Demo Albums list */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#e2d8ca] shadow-sm">
            <h3 className="text-lg font-bold text-[#1c1917] font-sans-clean mb-1">
              {t.panelTitle}
            </h3>
            <p className="text-sm text-[#78716c] mb-5">{t.panelDesc}</p>

            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex rounded-lg border border-[#d6cebf] focus-within:border-[#1c1917] focus-within:ring-1 focus-within:ring-[#1c1917] overflow-hidden bg-[#faf7f2]">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder={t.placeholder}
                  className="flex-1 px-3.5 py-3 text-sm text-[#1c1917] bg-transparent outline-none font-mono-code"
                />
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-semibold text-white bg-[#1c1917] hover:bg-[#292524] transition-colors shrink-0"
                >
                  {t.buttonOpen} →
                </button>
              </div>
              <p className="text-xs text-[#78716c] mt-1.5">{t.hint}</p>
            </form>

            <div className="border-t border-[#f0e8db] pt-6">
              <div className="text-xs font-semibold text-[#1c1917] mb-3">
                {t.demoShortcutsTitle}
              </div>
              <div className="space-y-3">
                {demoAlbums.map((album) => (
                  <div
                    key={album.slug}
                    onClick={() => onSelectAlbum(album)}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-[#e2d8ca] hover:border-[#1c1917] hover:bg-[#faf7f2] cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={album.coverImage}
                        alt={album.name}
                        className="w-12 h-12 rounded-lg object-cover border border-black/10 shrink-0"
                      />
                      <div>
                        <div className="text-sm font-bold text-[#1c1917] group-hover:text-[#c2410c] transition-colors">
                          {album.name}
                        </div>
                        <div className="text-xs text-[#78716c] font-mono-code">
                          {album.slug}.fesafotos.nl · {album.date}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-[#1c1917] group-hover:translate-x-1 transition-transform shrink-0 pl-2">
                      Bekijk album →
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
