import React, { useState } from 'react';
import { AppBar } from './AppBar';
import { HeroSection } from './HeroSection';
import { LiveWallSection } from './LiveWallSection';
import { MyAlbumSection } from './MyAlbumSection';
import { GuestbookChatSection } from './GuestbookChatSection';
import { OrganisationSection } from './OrganisationSection';
import { UploadModalSheet } from './UploadModalSheet';
import { Lightbox } from './Lightbox';
import { BeamerView } from './BeamerView';
import { BottomTabBar } from './BottomTabBar';
import { ComponentInventory } from './ComponentInventory';
import { Role, Language, MediaItem, ThemeId } from '../../types/party';
import { partyConfig, initialMediaItems } from '../../data/partyData';

interface PartyPageViewProps {
  onBackToLanding?: () => void;
  onOpenManage?: () => void;
}

export const PartyPageView: React.FC<PartyPageViewProps> = ({
  onBackToLanding,
  onOpenManage,
}) => {
  const [lang, setLang] = useState<Language>('nl');
  const [currentRole, setCurrentRole] = useState<Role>('guest');
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('terracotta');
  const [activeTab, setActiveTab] = useState<'top' | 'muur' | 'mijn-album' | 'organisatie'>('top');

  // Media & Counters
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMediaItems);
  const [counters, setCounters] = useState(partyConfig.initialCounters);

  // Modals & Sheets
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeLightboxItem, setActiveLightboxItem] = useState<MediaItem | null>(null);
  const [isBeamerOpen, setIsBeamerOpen] = useState(false);
  const [highlightAlbum, setHighlightAlbum] = useState(false);

  // Apply Theme CSS Variable
  const themeClass = `theme-${currentTheme}`;

  const handleLikeItem = (id: string) => {
    setMediaItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  const handleUploadComplete = (newItems: MediaItem[]) => {
    setMediaItems((prev) => [...newItems, ...prev]);
    setCounters((prev) => ({
      ...prev,
      uploads: prev.uploads + newItems.length,
      videos: prev.videos + newItems.filter((i) => i.type === 'video').length,
    }));
    setIsUploadOpen(false);
    setHighlightAlbum(true);
    setTimeout(() => setHighlightAlbum(false), 2400);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen bg-[var(--paper)] text-[var(--ink)] font-body ${themeClass} pb-20 sm:pb-12`}>
      {/* Top Banner allowing return to fesafotos.nl */}
      <div className="bg-[var(--ink)] text-white px-4 py-2 text-xs flex items-center justify-between border-b border-neutral-700">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
          <span className="font-mono-code font-bold">sanjayendewie.fesafotos.nl</span>
          <span className="text-white/60 hidden sm:inline">(Live feestpagina voor gasten)</span>
        </div>

        <div className="flex items-center gap-3">
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="text-xs font-semibold text-[#fbd38d] hover:underline"
            >
              ← Terug naar fesafotos.nl
            </button>
          )}
          {onOpenManage && (
            <button
              type="button"
              onClick={onOpenManage}
              className="text-xs font-semibold text-white/80 hover:text-white"
            >
              Beheerpaneel
            </button>
          )}
        </div>
      </div>

      {/* Main Party App Bar */}
      <AppBar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        lang={lang}
        onLanguageChange={setLang}
        onOpenBeamer={() => setIsBeamerOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero */}
        <HeroSection
          lang={lang}
          currentRole={currentRole}
          counters={counters}
          onOpenUpload={() => setIsUploadOpen(true)}
          onScrollToWall={() => scrollToSection('muur')}
        />

        {/* Live Wall */}
        <LiveWallSection
          lang={lang}
          mediaItems={mediaItems}
          onOpenLightbox={(item) => setActiveLightboxItem(item)}
          onLikeItem={handleLikeItem}
          onOpenUpload={() => setIsUploadOpen(true)}
        />

        {/* My Album Section */}
        <MyAlbumSection
          lang={lang}
          mediaItems={mediaItems}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenLightbox={(item) => setActiveLightboxItem(item)}
          highlightAlbum={highlightAlbum}
        />

        {/* Guestbook Chat Section */}
        <GuestbookChatSection lang={lang} />

        {/* Organisation Section */}
        <OrganisationSection
          lang={lang}
          currentTheme={currentTheme}
          onThemeSelect={setCurrentTheme}
          onOpenBeamer={() => setIsBeamerOpen(true)}
        />

        {/* Developer Component Inventory */}
        <ComponentInventory lang={lang} />
      </main>

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar
        activeTab={activeTab}
        onTabClick={(tab) => {
          setActiveTab(tab);
          scrollToSection(tab);
        }}
        currentRole={currentRole}
        lang={lang}
      />

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <Lightbox
          item={activeLightboxItem}
          items={mediaItems}
          isOpen={!!activeLightboxItem}
          onClose={() => setActiveLightboxItem(null)}
          onNext={() => {
            if (!activeLightboxItem) return;
            const idx = mediaItems.findIndex((m) => m.id === activeLightboxItem.id);
            const nextItem = mediaItems[(idx + 1) % mediaItems.length];
            setActiveLightboxItem(nextItem);
          }}
          onPrev={() => {
            if (!activeLightboxItem) return;
            const idx = mediaItems.findIndex((m) => m.id === activeLightboxItem.id);
            const prevItem = mediaItems[(idx - 1 + mediaItems.length) % mediaItems.length];
            setActiveLightboxItem(prevItem);
          }}
          onLike={handleLikeItem}
          lang={lang}
        />
      )}

      {/* Upload Modal / Bottom Sheet */}
      <UploadModalSheet
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadComplete}
        lang={lang}
      />

      {/* Fullscreen Beamer Projector Mode */}
      <BeamerView
        isOpen={isBeamerOpen}
        mediaItems={mediaItems}
        onClose={() => setIsBeamerOpen(false)}
        lang={lang}
      />
    </div>
  );
};
