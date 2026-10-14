import React, { useState } from 'react';
import { CardTheme, Language } from '../types';
import { translations } from '../data/translations';

interface TableCardStudioProps {
  lang: Language;
  currentSlug: string;
}

export const TableCardStudio: React.FC<TableCardStudioProps> = ({ lang, currentSlug }) => {
  const t = translations[lang].stage2;
  const [theme, setTheme] = useState<CardTheme>('linen');
  const [title, setTitle] = useState('Daan & Sophie');
  const [date, setDate] = useState('18 Juli 2026');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const themeStyles = {
    linen: {
      bg: 'bg-[#f7f2ea]',
      border: 'border-[#dfd3c3]',
      text: 'text-[#2b2520]',
      accent: 'text-[#8c5835]',
      qrDark: '#2b2520',
      qrBg: '#f7f2ea',
    },
    terracotta: {
      bg: 'bg-[#fdf4ed]',
      border: 'border-[#f5d0ba]',
      text: 'text-[#431407]',
      accent: 'text-[#c2410c]',
      qrDark: '#431407',
      qrBg: '#fdf4ed',
    },
    olive: {
      bg: 'bg-[#f3f6f1]',
      border: 'border-[#d2decb]',
      text: 'text-[#1c2d1b]',
      accent: 'text-[#3f6212]',
      qrDark: '#1c2d1b',
      qrBg: '#f3f6f1',
    },
    noir: {
      bg: 'bg-[#181615]',
      border: 'border-[#383330]',
      text: 'text-[#f5f2ed]',
      accent: 'text-[#d6cebf]',
      qrDark: '#181615',
      qrBg: '#f5f2ed',
    },
  };

  const currentThemeStyle = themeStyles[theme];

  const handleCopy = () => {
    const url = `https://${currentSlug || 'daanensophie'}.fesafotos.nl`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      const link = document.createElement('a');
      link.href = '#';
      // Simulated PDF card download notification
      alert(`Printklare PDF voor tafelkaart "${title}" gedownload (300 DPI formaat A6 voor op tafel).`);
    }, 700);
  };

  return (
    <section className="py-16 lg:py-24 border-b border-[#e7ded1] bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="text-xs font-mono-code font-semibold tracking-wider text-[#c2410c] uppercase mb-2">
            {t.kicker}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1c1917] tracking-tight font-sans-clean">
            {t.title}
          </h2>
        </div>

        {/* 2-Column Split: Story & Real Table Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-16">
          <div className="lg:col-span-6 space-y-5 text-base text-[#57534e] leading-relaxed">
            <p>{t.copy1}</p>
            <p>{t.copy2}</p>

            <div className="bg-white rounded-xl p-6 border border-[#e2d8ca] space-y-3 mt-6">
              <h3 className="text-base font-bold text-[#1c1917] font-sans-clean">
                {t.panelTitle}
              </h3>
              <ul className="space-y-2.5 text-sm text-[#44403c]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#c2410c] font-bold">✓</span>
                  <span>{t.feat1}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#c2410c] font-bold">✓</span>
                  <span>{t.feat2}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#c2410c] font-bold">✓</span>
                  <span>{t.feat3}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-6">
            <figure className="rounded-2xl overflow-hidden border border-[#d8ccbc] bg-[#eee5d8] shadow-sm">
              <img
                src="/src/assets/images/qr_table_card_mockup_1791985661307.jpg"
                alt="Table QR stand card on a candlelit rustic dinner table with wine glass"
                className="w-full h-[360px] sm:h-[400px] object-cover"
                referrerPolicy="no-referrer"
              />
              <figcaption className="p-4 text-xs text-[#78716c] font-mono-code bg-[#f2e9dc] border-t border-[#e2d8ca]">
                {t.cardCaption}
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Interactive QR Table Card Studio */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#e2d8ca] shadow-sm">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#1c1917] font-sans-clean">
              {t.cardCustomizerTitle}
            </h3>
            <p className="text-sm text-[#78716c] mt-1">
              {t.cardCustomizerDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Customizer Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#44403c] mb-2">
                  {t.themeLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'linen', label: t.themeLinen, swatch: '#f7f2ea' },
                      { id: 'terracotta', label: t.themeTerracotta, swatch: '#f5d0ba' },
                      { id: 'olive', label: t.themeOlive, swatch: '#d2decb' },
                      { id: 'noir', label: t.themeNoir, swatch: '#181615' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTheme(item.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                        theme === item.id
                          ? 'border-[#1c1917] ring-1 ring-[#1c1917] bg-[#fbf8f4]'
                          : 'border-[#e2d8ca] hover:bg-[#faf7f2]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: item.swatch }}
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#44403c] mb-1.5">
                    {t.fieldTitle}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#d6cebf] bg-[#faf7f2] focus:outline-none focus:border-[#1c1917]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#44403c] mb-1.5">
                    {t.fieldSubtitle}
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#d6cebf] bg-[#faf7f2] focus:outline-none focus:border-[#1c1917]"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="px-5 py-3 text-xs font-semibold text-white bg-[#1c1917] hover:bg-[#292524] rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>{downloading ? 'Genereren...' : t.downloadCard}</span>
                  <span>↓</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-5 py-3 text-xs font-semibold text-[#1c1917] bg-[#f2e9dc] hover:bg-[#e7ded1] rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>{copied ? t.linkCopied : t.copyShareLink}</span>
                  <span>🔗</span>
                </button>
              </div>
            </div>

            {/* Live Card Preview Box */}
            <div className="lg:col-span-6 flex justify-center">
              <div
                className={`w-[260px] sm:w-[290px] rounded-2xl p-6 sm:p-8 border shadow-md flex flex-col items-center text-center transition-all ${currentThemeStyle.bg} ${currentThemeStyle.border} ${currentThemeStyle.text}`}
              >
                <div className="text-[10px] font-mono-code uppercase tracking-widest opacity-60 mb-2">
                  fesafotos.
                </div>
                <h4 className="font-editorial text-xl sm:text-2xl font-bold tracking-tight mb-0.5">
                  {title || 'Jouw feest'}
                </h4>
                <p className="text-xs opacity-75 mb-6">{date}</p>

                {/* SVG Rendered QR Mockup */}
                <div className="p-3 bg-white rounded-xl shadow-xs border border-black/10 mb-5">
                  <svg
                    viewBox="0 0 100 100"
                    width="140"
                    height="140"
                    className="shape-rendering-crispEdges"
                  >
                    {/* Corner Position Detection Patterns */}
                    <rect width="100" height="100" fill="#ffffff" />
                    {/* Top Left Finder */}
                    <rect x="10" y="10" width="28" height="28" fill="#1c1917" />
                    <rect x="14" y="14" width="20" height="20" fill="#ffffff" />
                    <rect x="18" y="18" width="12" height="12" fill="#1c1917" />

                    {/* Top Right Finder */}
                    <rect x="62" y="10" width="28" height="28" fill="#1c1917" />
                    <rect x="66" y="14" width="20" height="20" fill="#ffffff" />
                    <rect x="70" y="18" width="12" height="12" fill="#1c1917" />

                    {/* Bottom Left Finder */}
                    <rect x="10" y="62" width="28" height="28" fill="#1c1917" />
                    <rect x="14" y="66" width="20" height="20" fill="#ffffff" />
                    <rect x="18" y="70" width="12" height="12" fill="#1c1917" />

                    {/* Data Pattern Simulation */}
                    <rect x="44" y="10" width="4" height="8" fill="#1c1917" />
                    <rect x="52" y="14" width="4" height="4" fill="#1c1917" />
                    <rect x="44" y="24" width="8" height="4" fill="#1c1917" />
                    <rect x="10" y="44" width="8" height="4" fill="#1c1917" />
                    <rect x="22" y="48" width="4" height="8" fill="#1c1917" />
                    <rect x="44" y="44" width="12" height="12" fill="#1c1917" />
                    <rect x="60" y="44" width="4" height="8" fill="#1c1917" />
                    <rect x="70" y="48" width="8" height="4" fill="#1c1917" />
                    <rect x="82" y="44" width="8" height="8" fill="#1c1917" />
                    <rect x="44" y="60" width="4" height="12" fill="#1c1917" />
                    <rect x="52" y="68" width="8" height="4" fill="#1c1917" />
                    <rect x="44" y="80" width="12" height="4" fill="#1c1917" />
                    <rect x="64" y="64" width="12" height="12" fill="#1c1917" />
                    <rect x="80" y="60" width="8" height="8" fill="#1c1917" />
                    <rect x="64" y="80" width="4" height="8" fill="#1c1917" />
                    <rect x="74" y="84" width="12" height="4" fill="#1c1917" />
                  </svg>
                </div>

                <p className="text-[11px] font-medium tracking-tight mb-1">
                  Scan met camera
                </p>
                <p className="font-mono-code text-[10px] opacity-75">
                  {currentSlug || 'daanensophie'}.fesafotos.nl
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
