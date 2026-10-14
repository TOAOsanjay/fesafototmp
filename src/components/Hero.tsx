import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface HeroProps {
  lang: Language;
  onOpenCheck: () => void;
  onOpenAlbum: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onOpenCheck, onOpenAlbum }) => {
  const t = translations[lang].hero;

  return (
    <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#e7ded1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Grid: Left Typography & Value Prop / Right Visual Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Editorial Tag */}
            <p className="font-editorial italic text-2xl lg:text-3xl text-[#c2410c] mb-4 tracking-normal">
              {t.tag}
            </p>

            {/* Headline */}
            <h1
              className="text-3xl sm:text-4xl lg:text-[3.25rem] font-bold text-[#1c1917] tracking-tight leading-[1.15] mb-6 font-sans-clean"
              style={{ textWrap: 'balance' }}
            >
              <span>{t.title}</span>{' '}
              <span className="font-editorial font-normal italic text-[#78716c]">
                {t.subtitle}
              </span>
            </h1>

            {/* Lede Prose */}
            <p className="text-lg lg:text-xl text-[#57534e] leading-relaxed mb-8 max-w-2xl font-normal">
              {t.lede}
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
              <button
                onClick={onOpenCheck}
                className="px-6 py-3.5 text-base font-semibold text-white bg-[#1c1917] hover:bg-[#292524] rounded-lg transition-all shadow-sm active:scale-[0.98] text-center"
              >
                {t.checkCta}
              </button>
              <button
                onClick={onOpenAlbum}
                className="px-6 py-3.5 text-base font-semibold text-[#1c1917] bg-white hover:bg-[#f5ece0] border border-[#d6cebf] rounded-lg transition-all active:scale-[0.98] text-center"
              >
                {t.openCta}
              </button>
            </div>

            {/* B2B Link */}
            <div className="flex items-center gap-2 text-sm text-[#78716c]">
              <span>Voor professionele eventfotografen:</span>
              <a
                href="#fotograaf"
                className="font-medium text-[#c2410c] hover:underline underline-offset-4"
              >
                {t.photographerCta} →
              </a>
            </div>
          </div>

          {/* Right Column: Visual Focal Carrier */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#d8ccbc] bg-[#eee5d8] shadow-md group">
              <img
                src="/src/assets/images/hero_party_celebration_1791985660408.jpg"
                alt="Chic party dinner celebration with friends toasting in Amsterdam"
                className="w-full h-[360px] sm:h-[440px] lg:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Refined gradient scrim for clean legible metadata */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

              {/* Genuine album address overlay in lower corner */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between text-xs font-mono-code text-white/80 pb-1.5 border-b border-white/20">
                  <span>daanensophie.fesafotos.nl</span>
                  <span className="tabular-nums">348 uploads</span>
                </div>
                <p className="font-editorial text-sm italic text-white/95 pt-1.5 line-clamp-1">
                  Het diner aan de Herengracht — live gasten & pro album
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Quantitative Proof Strip below the hero split */}
        <div className="mt-14 pt-8 border-t border-[#e7ded1] grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-[#1c1917] tabular-nums font-sans-clean">
              {t.proof1Val}
            </div>
            <div className="text-xs text-[#78716c] mt-0.5">{t.proof1Label}</div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-[#1c1917] font-sans-clean">
              {t.proof2Val}
            </div>
            <div className="text-xs text-[#78716c] mt-0.5">{t.proof2Label}</div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-[#1c1917] font-sans-clean">
              {t.proof3Val}
            </div>
            <div className="text-xs text-[#78716c] mt-0.5">{t.proof3Label}</div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-[#1c1917] font-sans-clean">
              {t.proof4Val}
            </div>
            <div className="text-xs text-[#78716c] mt-0.5">{t.proof4Label}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
