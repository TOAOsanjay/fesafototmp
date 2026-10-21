import React from 'react';
import { Role, Language } from '../../types/party';

interface BottomTabBarProps {
  activeTab: 'top' | 'muur' | 'mijn-album' | 'organisatie';
  onTabClick: (tab: 'top' | 'muur' | 'mijn-album' | 'organisatie') => void;
  currentRole: Role;
  lang: Language;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabClick,
  currentRole,
  lang,
}) => {
  const tabs = [
    {
      id: 'top' as const,
      labelNl: 'Feest',
      labelEn: 'Party',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'muur' as const,
      labelNl: 'Muur',
      labelEn: 'Wall',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
    },
    {
      id: 'mijn-album' as const,
      labelNl: 'Mijn album',
      labelEn: 'My album',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M12 12v9" />
          <path d="m16 16-4-4-4 4" />
        </svg>
      ),
    },
    {
      id: 'organisatie' as const,
      labelNl: 'Organisatie',
      labelEn: 'Host area',
      isHostOnly: true,
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--paper)]/95 backdrop-blur-lg border-t border-[var(--border)] px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] shadow-lg"
      aria-label="Mobiele navigatiebalk"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const label = lang === 'nl' ? tab.labelNl : tab.labelEn;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabClick(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all active:scale-95 relative ${
                isActive
                  ? 'text-[var(--accent)] font-semibold'
                  : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.id === 'organisatie' && currentRole === 'organiser' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--accent)]" />
                )}
              </div>
              <span className="text-[11px] font-medium leading-none">{label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
