import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenCheck: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, onLanguageChange, onOpenCheck }) => {
  const t = translations[lang].nav;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#faf7f2]/90 backdrop-blur-md border-b border-[#e7ded1] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face, no subtitles or status pills) */}
        <a
          href="#"
          className="text-2xl font-bold tracking-tight text-[#1c1917] font-sans-clean hover:opacity-85 transition-opacity whitespace-nowrap shrink-0 flex items-center"
        >
          <span>fesafotos</span>
          <span className="text-[#c2410c]">.</span>
        </a>

        {/* Zone 2: 4-5 single-line nav links with clean hover styling */}
        <nav
          className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#57534e]"
          aria-label="Hoofdnavigatie"
        >
          <a
            href="#werk"
            className="hover:text-[#1c1917] transition-colors whitespace-nowrap shrink-0"
          >
            {t.howItWorks}
          </a>
          <a
            href="#prijzen"
            className="hover:text-[#1c1917] transition-colors whitespace-nowrap shrink-0"
          >
            {t.pricing}
          </a>
          <a
            href="#album"
            className="hover:text-[#1c1917] transition-colors whitespace-nowrap shrink-0"
          >
            {t.album}
          </a>
          <a
            href="#fotograaf"
            className="hover:text-[#1c1917] transition-colors whitespace-nowrap shrink-0"
          >
            {t.photographer}
          </a>
        </nav>

        {/* Zone 3: Language toggle & 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center text-xs font-semibold tracking-wider text-[#78716c] mr-1">
            <button
              onClick={() => onLanguageChange('nl')}
              className={`px-2 py-1 transition-colors ${
                lang === 'nl'
                  ? 'text-[#1c1917] font-bold underline decoration-[#c2410c] decoration-2 underline-offset-4'
                  : 'hover:text-[#1c1917]'
              }`}
              aria-label="Nederlands"
            >
              NL
            </button>
            <span className="text-[#d6cebf]">/</span>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 transition-colors ${
                lang === 'en'
                  ? 'text-[#1c1917] font-bold underline decoration-[#c2410c] decoration-2 underline-offset-4'
                  : 'hover:text-[#1c1917]'
              }`}
              aria-label="English"
            >
              EN
            </button>
          </div>

          <button
            onClick={onOpenCheck}
            className="px-4.5 py-2.5 text-sm font-semibold text-white bg-[#1c1917] hover:bg-[#292524] rounded-lg transition-all shadow-sm active:scale-[0.98] whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>{t.checkName}</span>
            <span className="text-[#fbd38d]">→</span>
          </button>
        </div>
      </div>
    </header>
  );
};
