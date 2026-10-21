import React, { useState } from 'react';
import { AppBar } from './components/party/AppBar';
import { BottomTabBar } from './components/party/BottomTabBar';
import { HeroSection } from './components/party/HeroSection';
import { LiveWallSection } from './components/party/LiveWallSection';
import { MyAlbumSection } from './components/party/MyAlbumSection';
import { UploadModalSheet } from './components/party/UploadModalSheet';
import { Lightbox } from './components/party/Lightbox';
import { OrganisationSection } from './components/party/OrganisationSection';
import { GuestbookChatSection } from './components/party/GuestbookChatSection';
import { RsvpCard } from './components/party/RsvpCard';
import { BeamerView } from './components/party/BeamerView';
import { ComponentInventory } from './components/party/ComponentInventory';
import { initialMediaItems, partyConfig } from './data/partyData';
import { Role, Language, ThemeId, MediaItem } from './types/party';

export default function App() {
  const [lang, setLang] = useState<Language>('nl');
  const [role, setRole] = useState<Role>('guest');
  const [theme, setTheme] = useState<ThemeId>('terracotta');
  const [activeTab, setActiveTab] = useState<'top' | 'muur' | 'mijn-album' | 'organisatie'>('top');

  // Media state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMediaItems);
  const [counters, setCounters] = useState(partyConfig.initialCounters);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [isBeamerOpen, setIsBeamerOpen] = useState(false);
  const [highlightAlbum, setHighlightAlbum] = useState(false);

  // Scroll to section helper
  const handleScrollToSection = (sectionId: 'top' | 'muur' | 'mijn-album' | 'organisatie') => {
    setActiveTab(sectionId);
    if (sectionId === 'organisatie' && role === 'guest') {
      setRole('organiser');
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Like interaction
  const handleLikeItem = (id: string) => {
    setMediaItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  // Delete guest item
  const handleDeleteItem = (id: string) => {
    setMediaItems((prev) => prev.filter((i) => i.id !== id));
    setCounters((c) => ({ ...c, uploads: Math.max(0, c.uploads - 1) }));
  };

  // Add new uploaded items
  const handleUploadSuccess = (newItems: MediaItem[]) => {
    setMediaItems((prev) => [...newItems, ...prev]);
    const addedVideos = newItems.filter((i) => i.type === 'video').length;
    setCounters((prev) => ({
      ...prev,
      uploads: prev.uploads + newItems.length,
      videos: prev.videos + addedVideos,
    }));

    // Trigger soft highlight pulse on My Album section
    setHighlightAlbum(true);
    setTimeout(() => {
      setHighlightAlbum(false);
    }, 3600);
  };

  // Lightbox navigation
  const handleLightboxNext = () => {
    if (!lightboxItem) return;
    const currentIndex = mediaItems.findIndex((i) => i.id === lightboxItem.id);
    const nextIndex = (currentIndex + 1) % mediaItems.length;
    setLightboxItem(mediaItems[nextIndex]);
  };

  const handleLightboxPrev = () => {
    if (!lightboxItem) return;
    const currentIndex = mediaItems.findIndex((i) => i.id === lightboxItem.id);
    const prevIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    setLightboxItem(mediaItems[prevIndex]);
  };

  return (
    <div className={`theme-${theme} min-h-screen bg-[var(--paper)] text-[var(--ink)] font-body paper-pattern flex flex-col transition-colors duration-300 pb-safe`}>
      {/* 1. App Bar with Wordmark, Monogram, Role Switcher, and Language Toggle */}
      <AppBar
        currentRole={role}
        onRoleChange={setRole}
        lang={lang}
        onLanguageChange={setLang}
        onOpenBeamer={() => setIsBeamerOpen(true)}
      />

      <main className="flex-1">
        {/* 2. HERO SECTION (id="top") */}
        <HeroSection
          lang={lang}
          currentRole={role}
          counters={counters}
          onOpenUpload={() => setIsUploadOpen(true)}
          onScrollToWall={() => handleScrollToSection('muur')}
        />

        {/* 3. LIVE WALL SECTION (id="muur") */}
        <LiveWallSection
          lang={lang}
          mediaItems={mediaItems}
          onOpenLightbox={(item) => setLightboxItem(item)}
          onLikeItem={handleLikeItem}
          onOpenUpload={() => setIsUploadOpen(true)}
        />

        {/* 4. MY ALBUM SECTION (id="mijn-album") */}
        <MyAlbumSection
          lang={lang}
          mediaItems={mediaItems}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenLightbox={(item) => setLightboxItem(item)}
          onDeleteGuestItem={handleDeleteItem}
          highlightAlbum={highlightAlbum}
        />

        {/* 5. GUESTBOOK & ASSISTANT CHAT APP SURFACES */}
        <GuestbookChatSection lang={lang} />

        {/* 6. RSVP STATUS CARD */}
        <RsvpCard lang={lang} />

        {/* 7. ORGANISATION SECTION (id="organisatie") */}
        <OrganisationSection
          lang={lang}
          currentTheme={theme}
          onThemeSelect={setTheme}
          onOpenBeamer={() => setIsBeamerOpen(true)}
        />

        {/* 8. DEVELOPER COMPONENT INVENTORY */}
        <ComponentInventory lang={lang} />
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomTabBar
        activeTab={activeTab}
        onTabClick={handleScrollToSection}
        currentRole={role}
        lang={lang}
      />

      {/* Upload Modal (Bottom Sheet on Mobile / Centered Dialog on Desktop) */}
      <UploadModalSheet
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        lang={lang}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Lightbox Media Viewer with Video Playback Controls */}
      <Lightbox
        item={lightboxItem}
        items={mediaItems}
        isOpen={lightboxItem !== null}
        onClose={() => setLightboxItem(null)}
        onNext={handleLightboxNext}
        onPrev={handleLightboxPrev}
        onLike={handleLikeItem}
        onDelete={handleDeleteItem}
        lang={lang}
      />

      {/* Fullscreen Projector Beamer View */}
      <BeamerView
        isOpen={isBeamerOpen}
        onClose={() => setIsBeamerOpen(false)}
        mediaItems={mediaItems}
        lang={lang}
      />
    </div>
  );
}
