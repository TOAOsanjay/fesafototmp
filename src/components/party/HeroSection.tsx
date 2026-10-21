import React from 'react';
import { partyConfig } from '../../data/partyData';
import { Language, Role } from '../../types/party';

interface HeroSectionProps {
  lang: Language;
  currentRole: Role;
  counters: {
    uploads: number;
    videos: number;
    guests: number;
    daysToGo: number;
  };
  onOpenUpload: () => void;
  onScrollToWall: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  currentRole,
  counters,
  onOpenUpload,
  onScrollToWall,
}) => {
  const isNl = lang === 'nl';

  return (
    <section id="top" className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 border-b border-[var(--border)] overflow-hidden">
      {/* Decorative subtle confetti elements in CSS */}
      <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-[var(--accent-soft)] opacity-60 animate-float-gentle pointer-events-none" />
      <div className="absolute top-16 right-10 w-2.5 h-2.5 rounded-sm bg-[var(--accent)] opacity-40 rotate-45 pointer-events-none" />
      <div className="absolute bottom-6 left-1/3 w-3 h-1.5 rounded-full bg-[var(--accent)] opacity-30 rotate-12 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Role Adaptation Banner (when not standard guest) */}
        {currentRole !== 'guest' && (
          <div className="mb-6 p-3 rounded-xl bg-[var(--paper-2)] border border-[var(--border)] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span className="font-semibold text-[var(--ink)]">
                {currentRole === 'organiser' && (isNl ? 'Organisator Modus actief: beheer gasten, thema en instellingen hieronder.' : 'Host Mode active: manage guests, theme and settings below.')}
                {currentRole === 'photographer' && (isNl ? 'Fotograaf Ingang actief: lever originele RAW/JPEG bestanden zonder compressie aan.' : 'Photographer Portal active: deliver original RAW/JPEG files with zero compression.')}
                {currentRole === 'venue' && (isNl ? 'Locatie Modus: beamer projectie en Wi-Fi gegevens gereed voor zaalschermen.' : 'Venue Mode: projector and screen stream ready for venue displays.')}
              </span>
            </div>
            <span className="font-mono-code text-[11px] text-[var(--accent)] font-semibold">
              {currentRole.toUpperCase()}
            </span>
          </div>
        )}

        {/* Hero Card */}
        <div className="bg-[var(--surface)] rounded-3xl p-6 sm:p-10 border border-[var(--border)] shadow-sm relative overflow-hidden">
          {/* Top metadata row: Date & Hashtag chip */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-[var(--ink-soft)] font-medium">
              <span className="text-[var(--accent)]">📅</span>
              <span>{isNl ? partyConfig.dateNl : partyConfig.dateEn}</span>
              <span className="text-[var(--border)]">·</span>
              <span className="text-xs font-mono-code text-[var(--ink-soft)]">{partyConfig.location}</span>
            </div>

            {/* Hashtag Chip */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--paper)] text-[var(--accent)] border border-[var(--border)] text-xs font-mono-code font-bold shadow-2xs">
              <span>#</span>
              <span>{partyConfig.hashtag.replace('#', '')}</span>
            </span>
          </div>

          {/* Party Name Headline */}
          <h1
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--ink)] tracking-tight leading-[1.08] mb-5"
            style={{ textWrap: 'balance' }}
          >
            {partyConfig.name}
          </h1>

          {/* Welcome Text Verbatim */}
          <p className="text-base sm:text-lg text-[var(--ink-soft)] leading-relaxed mb-8 max-w-2xl font-normal">
            {isNl ? partyConfig.welcomeTextNl : partyConfig.welcomeTextEn}
          </p>

          {/* Primary & Secondary Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
            <button
              type="button"
              onClick={onOpenUpload}
              className="px-6 py-3.5 text-base font-semibold text-white bg-[var(--accent)] hover:opacity-95 rounded-xl transition-all shadow-sm active:scale-[0.98] text-center flex items-center justify-center gap-2"
            >
              <span>📷</span>
              <span>{isNl ? 'Deel jouw momenten' : 'Share your moments'}</span>
            </button>

            <button
              type="button"
              onClick={onScrollToWall}
              className="px-6 py-3.5 text-base font-semibold text-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--paper-2)] border border-[var(--border)] rounded-xl transition-all active:scale-[0.98] text-center"
            >
              {isNl ? 'Bekijk de muur' : 'View the live wall'}
            </button>
          </div>

          {/* Compact, elegant counter strip */}
          <div className="pt-6 border-t border-[var(--border)] grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
              <div className="text-2xl sm:text-3xl font-display font-bold text-[var(--ink)] tabular-nums">
                {counters.uploads}
              </div>
              <div className="text-xs text-[var(--ink-soft)] mt-0.5 font-medium">
                {isNl ? 'uploads' : 'uploads'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
              <div className="text-2xl sm:text-3xl font-display font-bold text-[var(--ink)] tabular-nums">
                {counters.videos}
              </div>
              <div className="text-xs text-[var(--ink-soft)] mt-0.5 font-medium">
                {isNl ? "video's" : 'videos'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
              <div className="text-2xl sm:text-3xl font-display font-bold text-[var(--ink)] tabular-nums">
                {counters.guests}
              </div>
              <div className="text-xs text-[var(--ink-soft)] mt-0.5 font-medium">
                {isNl ? 'gasten' : 'guests'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
              <div className="text-2xl sm:text-3xl font-display font-bold text-[var(--accent)] tabular-nums">
                {counters.daysToGo}
              </div>
              <div className="text-xs text-[var(--ink-soft)] mt-0.5 font-medium">
                {isNl ? 'dagen te gaan' : 'days to go'}
              </div>
            </div>
          </div>

          {/* QR Code Block for people at the venue */}
          <div className="mt-8 p-4.5 rounded-2xl bg-[var(--paper-2)] border border-[var(--border)] flex flex-col sm:flex-row items-center gap-4">
            {/* SVG Crisp QR Code Placeholder */}
            <div className="p-2 bg-white rounded-xl border border-[var(--border)] shrink-0 shadow-xs">
              <svg viewBox="0 0 100 100" width="80" height="80" className="shape-rendering-crispEdges">
                <rect width="100" height="100" fill="#ffffff" />
                <rect x="8" y="8" width="28" height="28" fill="#1c1917" />
                <rect x="12" y="12" width="20" height="20" fill="#ffffff" />
                <rect x="16" y="16" width="12" height="12" fill="#c2410c" />

                <rect x="64" y="8" width="28" height="28" fill="#1c1917" />
                <rect x="68" y="12" width="20" height="20" fill="#ffffff" />
                <rect x="72" y="16" width="12" height="12" fill="#c2410c" />

                <rect x="8" y="64" width="28" height="28" fill="#1c1917" />
                <rect x="12" y="68" width="20" height="20" fill="#ffffff" />
                <rect x="16" y="72" width="12" height="12" fill="#c2410c" />

                <rect x="42" y="12" width="6" height="14" fill="#1c1917" />
                <rect x="52" y="16" width="6" height="6" fill="#1c1917" />
                <rect x="42" y="42" width="16" height="16" fill="#1c1917" />
                <rect x="12" y="44" width="8" height="6" fill="#1c1917" />
                <rect x="24" y="48" width="6" height="8" fill="#1c1917" />
                <rect x="66" y="44" width="8" height="8" fill="#1c1917" />
                <rect x="78" y="48" width="10" height="6" fill="#1c1917" />
                <rect x="44" y="66" width="8" height="18" fill="#1c1917" />
                <rect x="64" y="66" width="18" height="8" fill="#1c1917" />
                <rect x="76" y="78" width="12" height="10" fill="#1c1917" />
              </svg>
            </div>

            <div className="text-center sm:text-left">
              <div className="text-xs font-mono-code font-bold text-[var(--accent)] uppercase tracking-wider mb-0.5">
                {isNl ? 'Op het feest aanwezig?' : 'At the venue?'}
              </div>
              <div className="text-sm font-semibold text-[var(--ink)]">
                {isNl
                  ? 'Scan de QR code op tafel met je camera om direct jouw foto\'s toe te voegen.'
                  : 'Scan the QR code on your table with your camera to upload directly.'}
              </div>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                {isNl
                  ? 'Geen app installatie nodig. Alles landt rechtstreeks in het album van Sanjay & Dewie.'
                  : 'No app download needed. Everything lands directly into Sanjay & Dewie\'s album.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
