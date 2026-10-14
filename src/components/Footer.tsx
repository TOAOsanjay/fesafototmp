import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface FooterProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenCheck: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onLanguageChange,
  onOpenCheck,
}) => {
  const t = translations[lang].footer;

  return (
    <footer className="bg-[#f3ece0] border-t border-[#e2d8ca] py-14 text-sm text-[#57534e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#e2d8ca]">
          <div>
            <a
              href="#"
              className="text-2xl font-bold tracking-tight text-[#1c1917] font-sans-clean flex items-center mb-1.5"
            >
              <span>fesafotos</span>
              <span className="text-[#c2410c]">.</span>
            </a>
            <p className="font-editorial italic text-base text-[#78716c]">
              {t.tagline}
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-6 sm:gap-8 font-medium text-xs">
            <li>
              <button
                type="button"
                onClick={onOpenCheck}
                className="hover:text-[#1c1917] transition-colors"
              >
                {t.check}
              </button>
            </li>
            <li>
              <a href="#prijzen" className="hover:text-[#1c1917] transition-colors">
                {t.pricing}
              </a>
            </li>
            <li>
              <a href="#album" className="hover:text-[#1c1917] transition-colors">
                {t.album}
              </a>
            </li>
            <li>
              <a href="#fotograaf" className="hover:text-[#1c1917] transition-colors">
                {t.photographer}
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onLanguageChange(lang === 'nl' ? 'en' : 'nl')}
                className="text-[#1c1917] font-semibold hover:underline"
              >
                {lang === 'nl' ? 'Switch to English' : 'Naar Nederlands'}
              </button>
            </li>
          </ul>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716c] gap-4">
          <p>{t.copyright}</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#1c1917] cursor-pointer">Privacy & Data</span>
            <span>·</span>
            <span className="hover:text-[#1c1917] cursor-pointer">Voorwaarden</span>
            <span>·</span>
            <span className="hover:text-[#1c1917] cursor-pointer">Contact & Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
