import React from 'react';
import { Role, Language } from '../../types/party';

interface AppBarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenBeamer: () => void;
}

export const AppBar: React.FC<AppBarProps> = ({
  currentRole,
  onRoleChange,
  lang,
  onLanguageChange,
  onOpenBeamer,
}) => {
  const roleLabels: Record<Role, { nl: string; en: string }> = {
    guest: { nl: 'Gast', en: 'Guest' },
    organiser: { nl: 'Organisator', en: 'Host' },
    photographer: { nl: 'Fotograaf', en: 'Photographer' },
    venue: { nl: 'Locatiehouder', en: 'Venue' },
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--paper)]/95 backdrop-blur-md border-b border-[var(--border)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand with FF monogram & trailing dot */}
        <div className="flex items-center gap-3">
          <a
            href="#top"
            className="flex items-center gap-2 group hover:opacity-90 transition-opacity"
            aria-label="fesafotos. startpagina"
          >
            {/* FF Monogram with confetti dot at x-height */}
            <div className="relative w-8 h-8 rounded-lg bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center font-display font-extrabold text-sm tracking-tighter shadow-xs">
              <span>FF</span>
              {/* Confetti dot to the right at x-height */}
              <span
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--accent)] border-2 border-[var(--paper)] shadow-xs animate-bounce"
                style={{ animationDuration: '3s' }}
                aria-hidden="true"
              />
            </div>

            {/* Wordmark: always lowercase with trailing full stop */}
            <span className="font-display font-bold text-xl text-[var(--ink)] tracking-tight">
              fesafotos<span className="text-[var(--accent)]">.</span>
            </span>
          </a>

          {/* Subdomain Indicator */}
          <span className="hidden sm:inline text-xs font-mono-code text-[var(--ink-soft)] px-2 py-0.5 rounded bg-[var(--paper-2)] border border-[var(--border)]">
            sanjayendewie.fesafotos.nl
          </span>
        </div>

        {/* Right: Role Chip Switcher, Language Toggle, and Beamer Shortcut */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Beamer Mode Shortcut */}
          <button
            type="button"
            onClick={onOpenBeamer}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--ink)] bg-[var(--surface)] hover:bg-[var(--paper-2)] border border-[var(--border)] rounded-lg transition-colors shadow-xs"
            title="Start Beamer / Projector Modus"
          >
            <span>📽️</span>
            <span>{lang === 'nl' ? 'Beamer' : 'Projector'}</span>
          </button>

          {/* Role Switcher Chip */}
          <div className="flex items-center text-xs font-medium bg-[var(--surface)] border border-[var(--border)] rounded-lg p-0.5 shadow-xs">
            <span className="hidden lg:inline text-[var(--ink-soft)] text-[11px] px-2">
              {lang === 'nl' ? 'Rol:' : 'Role:'}
            </span>
            {(['guest', 'organiser', 'photographer', 'venue'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onRoleChange(r)}
                className={`px-2 py-1 rounded-md text-xs transition-colors ${
                  currentRole === r
                    ? 'bg-[var(--ink)] text-[var(--paper)] font-semibold shadow-xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {roleLabels[r][lang]}
              </button>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center text-xs font-semibold text-[var(--ink-soft)] border-l border-[var(--border)] pl-2">
            <button
              type="button"
              onClick={() => onLanguageChange('nl')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                lang === 'nl'
                  ? 'text-[var(--accent)] font-bold underline underline-offset-4'
                  : 'hover:text-[var(--ink)]'
              }`}
            >
              NL
            </button>
            <span className="text-[var(--border)]">/</span>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                lang === 'en'
                  ? 'text-[var(--accent)] font-bold underline underline-offset-4'
                  : 'hover:text-[var(--ink)]'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
