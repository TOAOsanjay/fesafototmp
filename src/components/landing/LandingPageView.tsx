import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Sparkles,
  Camera,
  Tv,
  Check,
  Heart,
  ArrowRight,
  Download,
  Share2,
  Lock,
  Layers,
  Zap,
  Maximize2,
  X,
  Play,
  Pause,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { Language, CardTheme, PhotoItem, PricingPlan } from '../../types';
import { initialPhotos } from '../../data/sampleAlbums';

interface LandingPageViewProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigateToParty?: (subdomain: string) => void;
  onNavigateToManage?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  lang,
  onLanguageChange,
  onNavigateToParty,
  onNavigateToManage,
}) => {
  const isNl = lang === 'nl';

  // Hero input state
  const [heroSlug, setHeroSlug] = useState('daanensophie');
  const [isHeroSlugAvailable, setIsHeroSlugAvailable] = useState(true);

  // Live Wall State
  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);
  const [wallFilter, setWallFilter] = useState<'all' | 'guest' | 'photographer'>('all');
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<PhotoItem | null>(null);
  const [likedPhotoIds, setLikedPhotoIds] = useState<Record<string, number>>({});
  const [floatingHearts, setFloatingHearts] = useState<{ id: string; x: number; y: number }[]>([]);

  // Table Card Studio State
  const [cardTheme, setCardTheme] = useState<CardTheme>('linen');
  const [cardTitle, setCardTitle] = useState('Daan & Sophie');
  const [cardDate, setCardDate] = useState('18 Juli 2026');

  // Modals & Overlays
  const [isBeamerOpen, setIsBeamerOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload simulation state
  const [uploadGuestName, setUploadGuestName] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');

  // Toast trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle hero slug input change
  const handleHeroSlugChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setHeroSlug(clean);
    // Simple availability logic: taken if in reserved list
    const reserved = ['admin', 'api', 'manage', 'mail', 'radar', 'fesa', 'test'];
    setIsHeroSlugAvailable(!reserved.includes(clean) && clean.length >= 3);
  };

  // Like interaction with confetti/heart pop
  const handleLike = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const newHeart = {
      id: `${photoId}-${Date.now()}`,
      x: rect.left + rect.width / 2,
      y: rect.top,
    };
    setFloatingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 900);

    setLikedPhotoIds((prev) => ({
      ...prev,
      [photoId]: (prev[photoId] ?? 0) + 1,
    }));
    showToast(isNl ? 'Hartje geplaatst!' : 'Liked moment!');
  };

  // Submit test upload to live wall
  const handleTestUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadGuestName.trim()) return;

    const newPhoto: PhotoItem = {
      id: `live-${Date.now()}`,
      url: '/src/assets/images/party_guest_moments_grid_1791985661203.jpg',
      caption: uploadCaption.trim() || (isNl ? 'Zojuist vastgelegd op de dansvloer! ✨' : 'Just captured on the dance floor! ✨'),
      author: uploadGuestName.trim(),
      authorType: 'guest',
      timestamp: isNl ? 'Zojuist' : 'Just now',
      likes: 1,
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    setIsUploadModalOpen(false);
    setUploadGuestName('');
    setUploadCaption('');
    showToast(isNl ? 'Foto direct toegevoegd aan de live muur!' : 'Photo added directly to the live wall!');
  };

  // Filtered photos
  const filteredPhotos = photos.filter((p) => {
    if (wallFilter === 'all') return true;
    return p.authorType === wallFilter;
  });

  // Table card theme definitions
  const cardThemes = {
    linen: {
      name: isNl ? 'Crème Linnen' : 'Cream Linen',
      cardBg: 'bg-[#f8f5ee]',
      border: 'border-[#dfd7ca]',
      text: 'text-[#2b2520]',
      accent: 'text-[#8c5835]',
      accentBg: 'bg-[#8c5835]',
    },
    terracotta: {
      name: isNl ? 'Terracotta Confetti' : 'Terracotta Confetti',
      cardBg: 'bg-[#fdf4ed]',
      border: 'border-[#f5d0ba]',
      text: 'text-[#431407]',
      accent: 'text-[#c2410c]',
      accentBg: 'bg-[#c2410c]',
    },
    olive: {
      name: isNl ? 'Botanisch Olijf' : 'Botanical Olive',
      cardBg: 'bg-[#f4f7f2]',
      border: 'border-[#d4e0cf]',
      text: 'text-[#1c2d1b]',
      accent: 'text-[#3f6212]',
      accentBg: 'bg-[#3f6212]',
    },
    noir: {
      name: isNl ? 'Middernacht Noir' : 'Midnight Noir',
      cardBg: 'bg-[#181615]',
      border: 'border-[#383330]',
      text: 'text-[#f5f2ed]',
      accent: 'text-[#fbd38d]',
      accentBg: 'bg-[#fbd38d]',
    },
  };

  const activeTheme = cardThemes[cardTheme];

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-body selection:bg-[#fbd38d]/50 selection:text-[var(--ink)] relative">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[var(--ink)] text-white text-xs font-medium shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles size={14} className="text-[#fbd38d]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Likes Animations */}
      {floatingHearts.map((h) => (
        <div
          key={h.id}
          style={{ left: h.x, top: h.y }}
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-8 animate-fade-out text-rose-500 font-bold text-lg flex items-center gap-1"
        >
          <span>❤️</span>
          <span className="text-xs">+1</span>
        </div>
      ))}

      {/* ── 1. Clean Editorial Header ── */}
      <header className="sticky top-0 z-40 bg-[var(--paper)]/90 backdrop-blur-md border-b border-[var(--border)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
          {/* Brand Wordmark with Confetti Dot */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 rounded-lg bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center font-display font-bold text-sm tracking-tighter shadow-2xs">
              <span>FF</span>
              <span
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--accent)] border-2 border-[var(--paper)] shadow-2xs"
                aria-hidden="true"
              />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-[var(--ink)]">
              fesafotos<span className="text-[var(--accent)]">.</span>
            </span>
          </a>

          {/* Minimal Clean Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--ink-soft)]" aria-label="Hoofdnavigatie">
            <a href="#hoe-het-werkt" className="hover:text-[var(--ink)] transition-colors">
              {isNl ? 'Hoe het werkt' : 'How it works'}
            </a>
            <a href="#live-muur" className="hover:text-[var(--ink)] transition-colors">
              {isNl ? 'Het album' : 'The album'}
            </a>
            <a href="#tafelkaartjes" className="hover:text-[var(--ink)] transition-colors">
              {isNl ? 'Tafelkaartjes' : 'Table cards'}
            </a>
            <a href="#fotograaf" className="hover:text-[var(--ink)] transition-colors">
              {isNl ? 'Voor de fotograaf' : 'For photographers'}
            </a>
            <a href="#prijzen" className="hover:text-[var(--ink)] transition-colors">
              {isNl ? 'Prijzen' : 'Pricing'}
            </a>
          </nav>

          {/* Right Controls: Language & Primary CTA */}
          <div className="flex items-center gap-3">
            {/* Language Switch */}
            <div className="flex items-center text-xs font-mono-code font-bold text-[var(--ink-soft)] mr-1">
              <button
                type="button"
                onClick={() => onLanguageChange('nl')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  lang === 'nl'
                    ? 'text-[var(--ink)] font-extrabold underline underline-offset-4 decoration-[var(--accent)]'
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
                    ? 'text-[var(--ink)] font-extrabold underline underline-offset-4 decoration-[var(--accent)]'
                    : 'hover:text-[var(--ink)]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Claim Name CTA */}
            <button
              type="button"
              onClick={() => setIsClaimModalOpen(true)}
              className="px-4.5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[var(--ink)] hover:bg-[#292524] rounded-xl transition-all shadow-sm active:scale-[0.98] flex items-center gap-2"
            >
              <span>{isNl ? 'Claim jouw feest' : 'Claim your party'}</span>
              <ArrowRight size={14} className="text-[#fbd38d]" />
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. Hero Section: Visueel & Adembenemend, Weinig Tekst ── */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Tagline */}
          <div className="text-center max-w-3xl mx-auto mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono-code bg-[var(--paper-2)] text-[var(--accent)] border border-[var(--border)] shadow-2xs mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <span>{isNl ? 'Geen app installeren · Geen account nodig' : 'No app install · No account required'}</span>
            </span>

            {/* Confident, Tight Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--ink)] tracking-tight leading-[1.08] mb-4 text-balance">
              {isNl ? 'Elk feest een eigen adres.' : 'Every party deserves its own address.'}
            </h1>

            {/* Single Short Lede Sentence */}
            <p className="text-base sm:text-lg text-[var(--ink-soft)] max-w-xl mx-auto leading-relaxed">
              {isNl
                ? 'Gasten scannen de QR op tafel. Alle foto\'s en video\'s landen direct op de beamer en in één gedeeld album.'
                : 'Guests scan the table QR code. Every photo and video lands instantly on the projector and in one shared album.'}
            </p>
          </div>

          {/* Interactive Subdomain Claim Input in Hero */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-[var(--surface)] border-2 border-[var(--border)] focus-within:border-[var(--accent)] shadow-md flex items-center gap-2 transition-all">
              <div className="pl-3 text-xs sm:text-sm font-mono-code text-[var(--ink-soft)] select-none">
                https://
              </div>
              <input
                type="text"
                value={heroSlug}
                onChange={(e) => handleHeroSlugChange(e.target.value)}
                placeholder="jouwnaam"
                className="w-full text-sm sm:text-base font-mono-code font-bold text-[var(--ink)] placeholder:text-neutral-400 focus:outline-hidden bg-transparent"
              />
              <span className="text-xs sm:text-sm font-mono-code text-[var(--accent)] font-semibold select-none pr-2">
                .fesafotos.nl
              </span>
              <button
                type="button"
                onClick={() => setIsClaimModalOpen(true)}
                className="shrink-0 px-4 py-2 sm:py-2.5 rounded-xl bg-[var(--accent)] text-white font-semibold text-xs sm:text-sm hover:opacity-95 transition-opacity shadow-sm flex items-center gap-1.5"
              >
                <span>{isNl ? 'Check' : 'Check'}</span>
                <Check size={14} strokeWidth={2.5} />
              </button>
            </div>

            {/* Instant Status Chip */}
            <div className="mt-2.5 px-3 flex items-center justify-between text-xs font-mono-code text-[var(--ink-soft)]">
              <div className="flex items-center gap-1.5">
                {isHeroSlugAvailable ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                    <span className="text-[var(--success)] font-semibold">
                      {heroSlug}.fesafotos.nl {isNl ? 'is nog vrij!' : 'is available!'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[var(--danger)]" />
                    <span className="text-[var(--danger)] font-semibold">
                      {heroSlug}.fesafotos.nl {isNl ? 'is al bezet' : 'is taken'}
                    </span>
                  </>
                )}
              </div>
              <span className="text-neutral-400 hidden sm:inline">
                {isNl ? 'Direct te reserveren' : 'Ready to reserve'}
              </span>
            </div>
          </div>

          {/* Live Party Showcase: sanjay.fesafotos.nl */}
          <div className="max-w-3xl mx-auto mb-10 p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[var(--accent)] flex items-center justify-center font-display font-extrabold text-base shrink-0 shadow-2xs">
                🎉
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-code font-bold text-sm text-[var(--ink)]">sanjay.fesafotos.nl</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-emerald-50 text-[var(--success)] border border-emerald-200">
                    Live feest voorbeeld
                  </span>
                </div>
                <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                  "Sanjay & Dewie" · Vrijdag 30 oktober 2026 · Paviljoen Puur (#HoldMyDrinkKeepCalm41!)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToParty && onNavigateToParty('sanjay')}
              className="px-4 py-2 rounded-xl bg-[var(--ink)] text-white hover:bg-[var(--accent)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-2xs"
            >
              <span>{isNl ? 'Bekijk dit feest' : 'View party demo'}</span>
              <ArrowRight size={14} className="text-[#fbd38d]" />
            </button>
          </div>

          {/* ── Visual Showcase Split Stage ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left: The Real Candid Party Photograph with Live Badges */}
            <div className="lg:col-span-7 relative group">
              <div className="relative rounded-3xl overflow-hidden border border-[#d8ccbc] shadow-xl bg-[#eee5d8]">
                <img
                  src="/src/assets/images/hero_party_celebration_1791985660408.jpg"
                  alt="Vrolijk diner met vrienden en feestgasten die proosten aan een lange tafel"
                  className="w-full h-[380px] sm:h-[460px] object-cover transition-transform duration-700 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Floating Live Activity Badges on the Photo */}
                <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg flex items-center gap-2.5 text-xs font-sans">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <span className="font-bold text-[var(--ink)]">Lucas</span>
                    <span className="text-[var(--ink-soft)]"> {isNl ? 'uploadde zojuist 3 foto\'s' : 'uploaded 3 photos'}</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 p-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono-code flex items-center gap-1.5 shadow-lg">
                  <Tv size={14} className="text-[#fbd38d]" />
                  <span>{isNl ? 'Live Beamer Actief' : 'Live Beamer Stream'}</span>
                </div>

                {/* Lower bar on photo */}
                <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
                  <div>
                    <div className="font-mono-code text-xs text-white/80">
                      daanensophie.fesafotos.nl
                    </div>
                    <div className="font-display font-bold text-lg text-white">
                      Daan & Sophie : Zomerbruiloft
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsBeamerOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-medium border border-white/30 transition-colors flex items-center gap-1.5"
                  >
                    <Play size={12} fill="currentColor" />
                    <span>{isNl ? 'Beamer demo' : 'Beamer demo'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: The Physical Table Card Artifact & Mobile Scan Preview */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Card 1: Physical Table Card Mock */}
              <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-md space-y-4">
                <div className="flex items-center justify-between text-xs font-mono-code text-[var(--ink-soft)]">
                  <span className="uppercase font-bold tracking-wider">{isNl ? 'Op tafel tijdens het feest' : 'On table at the venue'}</span>
                  <span className="text-[var(--accent)] font-semibold">{isNl ? 'A6 Tafelkaart' : 'A6 Table card'}</span>
                </div>

                {/* Styled Physical Paper Preview */}
                <div className="p-5 rounded-2xl bg-[#faf6ee] border-2 border-[#e3d7c5] shadow-inner text-center space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-[var(--accent)]" />

                  <div className="pt-2">
                    <div className="font-display font-extrabold text-xl text-[var(--ink)]">
                      {cardTitle}
                    </div>
                    <div className="text-xs text-[var(--ink-soft)] font-mono-code mt-0.5">
                      {cardDate}
                    </div>
                  </div>

                  {/* High Quality Styled QR Matrix */}
                  <div className="inline-block p-3 rounded-xl bg-white border border-[#dfd2be] shadow-sm">
                    <div className="w-28 h-28 relative flex items-center justify-center bg-neutral-900 rounded-lg p-1.5">
                      <QrCode size={96} className="text-white" strokeWidth={1.5} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-md bg-[var(--accent)] text-white flex items-center justify-center font-display font-bold text-[9px] shadow-sm">
                          FF
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-[var(--ink)] leading-snug">
                    {isNl
                      ? 'Scan met je camera en deel jouw mooiste momenten!'
                      : 'Scan with your camera and share your best moments!'}
                  </p>
                  <div className="text-[10px] font-mono-code text-[var(--ink-soft)]">
                    daanensophie.fesafotos.nl
                  </div>
                </div>

                {/* Quick Action below card */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[var(--ink-soft)] font-mono-code">
                    {isNl ? 'Inbegrepen in elk pakket' : 'Included with all plans'}
                  </span>
                  <a
                    href="#tafelkaartjes"
                    className="font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
                  >
                    <span>{isNl ? 'Pas thema aan' : 'Customize theme'}</span>
                    <ChevronRight size={14} />
                  </a>
                </div>
              </div>

              {/* 4 Quick Visual Proof Points */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono-code">
                <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-[var(--success)] shrink-0">
                    <Zap size={14} />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--ink)]">{isNl ? '0 sec installatie' : '0 sec install'}</div>
                    <div className="text-[10px] text-[var(--ink-soft)]">{isNl ? 'Geen app store' : 'No app store'}</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-[var(--success)] shrink-0">
                    <Lock size={14} />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--ink)]">{isNl ? '100% Privé' : '100% Private'}</div>
                    <div className="text-[10px] text-[var(--ink-soft)]">{isNl ? 'Alleen genodigden' : 'Guests only'}</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-[var(--success)] shrink-0">
                    <Camera size={14} />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--ink)]">{isNl ? 'Originele RAW' : 'Original RAW'}</div>
                    <div className="text-[10px] text-[var(--ink-soft)]">{isNl ? 'Zonder compressie' : 'Zero compression'}</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-[var(--success)] shrink-0">
                    <Tv size={14} />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--ink)]">{isNl ? 'Beamer Modus' : 'Projector Mode'}</div>
                    <div className="text-[10px] text-[var(--ink-soft)]">{isNl ? 'Direct in de zaal' : 'Live at the venue'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Het Beeldverhaal in 3 Stappen (In 3 Krachtige Beelden) ── */}
      <section id="hoe-het-werkt" className="py-16 lg:py-24 border-b border-[var(--border)] bg-[var(--paper)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--accent)] mb-2 block">
              {isNl ? 'Het feestverloop' : 'The party experience'}
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">
              {isNl ? 'Zo simpel hoort een feest te zijn.' : 'As effortless as a celebration should be.'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stap 01 */}
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4 flex flex-col justify-between group hover:border-[var(--accent)] transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex items-center justify-center font-mono-code font-extrabold text-sm text-[var(--accent)]">
                  01
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] h-48 bg-[#faf6ee] flex items-center justify-center p-4">
                  <img
                    src="/src/assets/images/qr_table_card_mockup_1791985661307.jpg"
                    alt="Tafelkaartje met QR code tussen de wijnglazen en kaarsen op feest"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-white/90 text-[10px] font-mono-code font-bold text-[var(--ink)]">
                    A6 Tafelkaartje
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-xl text-[var(--ink)]">
                    {isNl ? '1. Scan de QR op tafel' : '1. Scan the table QR'}
                  </h3>
                  <p className="text-xs text-[var(--ink-soft)] mt-1.5 leading-relaxed">
                    {isNl
                      ? 'Geen app installeren. De camera op de telefoon opent het album direct in de browser.'
                      : 'No app download. The phone camera opens the shared album instantly in the browser.'}
                  </p>
                </div>
              </div>

              <div className="text-[11px] font-mono-code text-[var(--success)] font-semibold flex items-center gap-1.5 pt-2 border-t border-[var(--border)]">
                <Check size={13} strokeWidth={2.5} />
                <span>{isNl ? 'Werkt op iOS & Android' : 'Works on iOS & Android'}</span>
              </div>
            </div>

            {/* Stap 02 */}
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4 flex flex-col justify-between group hover:border-[var(--accent)] transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex items-center justify-center font-mono-code font-extrabold text-sm text-[var(--accent)]">
                  02
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] h-48 bg-[#eee5d8] flex items-center justify-center p-3">
                  <img
                    src="/src/assets/images/party_guest_moments_grid_1791985661203.jpg"
                    alt="Gasten dansen en leggen momenten vast"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute bottom-3 inset-x-3 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-xs font-mono-code flex items-center justify-between text-[var(--ink)] shadow-md">
                    <span className="font-bold">Upload 4 foto's</span>
                    <span className="text-[var(--success)] font-bold">100% gereed</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-bold text-xl text-[var(--ink)]">
                    {isNl ? '2. Deel foto\'s en video\'s' : '2. Share photos & videos'}
                  </h3>
                  <p className="text-xs text-[var(--ink-soft)] mt-1.5 leading-relaxed">
                    {isNl
                      ? 'Selecteer foto\'s uit de filmrol of maak direct een snap. Binnen een tel staat het in het album.'
                      : 'Select candid shots from camera roll or snap live. Lands in the album in seconds.'}
                  </p>
                </div>
              </div>

              <div className="text-[11px] font-mono-code text-[var(--success)] font-semibold flex items-center gap-1.5 pt-2 border-t border-[var(--border)]">
                <Check size={13} strokeWidth={2.5} />
                <span>{isNl ? 'Foto\'s en video\'s tot 300s' : 'Photos and clips up to 300s'}</span>
              </div>
            </div>

            {/* Stap 03 */}
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4 flex flex-col justify-between group hover:border-[var(--accent)] transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex items-center justify-center font-mono-code font-extrabold text-sm text-[var(--accent)]">
                  03
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-neutral-800 h-48 bg-neutral-900 flex items-center justify-center p-3 text-white">
                  <div className="text-center space-y-2">
                    <div className="p-2 rounded-xl bg-white/10 inline-block text-[var(--accent)]">
                      <Tv size={28} />
                    </div>
                    <div className="font-display font-bold text-sm">
                      Beamer Slideshow
                    </div>
                    <div className="text-[10px] font-mono-code text-white/60">
                      Auto-verversing · 348 uploads
                    </div>
                  </div>
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono-code">
                    Live Stream
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-xl text-[var(--ink)]">
                    {isNl ? '3. Live op het grote scherm' : '3. Live on the big screen'}
                  </h3>
                  <p className="text-xs text-[var(--ink-soft)] mt-1.5 leading-relaxed">
                    {isNl
                      ? 'Projecteer de live wall op de beamer of schermen in de zaal. Iedereen geniet meteen mee.'
                      : 'Stream the live mosaic to venue screens or projector. Everyone celebrates together.'}
                  </p>
                </div>
              </div>

              <div className="text-[11px] font-mono-code text-[var(--success)] font-semibold flex items-center gap-1.5 pt-2 border-t border-[var(--border)]">
                <Check size={13} strokeWidth={2.5} />
                <span>{isNl ? 'Geen extra hardware nodig' : 'Zero extra hardware needed'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. De Interactieve Live Muur (The Visual Proof) ── */}
      <section id="live-muur" className="py-16 lg:py-24 border-b border-[var(--border)] bg-[var(--paper-2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--accent)] mb-2 block">
                {isNl ? 'Interactief demonstratie-album' : 'Interactive live demo album'}
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">
                {isNl ? 'De levende feestmuur' : 'The living celebration wall'}
              </h2>
            </div>

            {/* Filter Tabs & Test Upload Button */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center gap-1 text-xs font-mono-code">
                <button
                  type="button"
                  onClick={() => setWallFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    wallFilter === 'all'
                      ? 'bg-[var(--ink)] text-white font-bold'
                      : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                  }`}
                >
                  {isNl ? 'Alle' : 'All'} ({photos.length})
                </button>
                <button
                  type="button"
                  onClick={() => setWallFilter('guest')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    wallFilter === 'guest'
                      ? 'bg-[var(--ink)] text-white font-bold'
                      : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                  }`}
                >
                  {isNl ? 'Gasten' : 'Guests'}
                </button>
                <button
                  type="button"
                  onClick={() => setWallFilter('photographer')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    wallFilter === 'photographer'
                      ? 'bg-[var(--ink)] text-white font-bold'
                      : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                  }`}
                >
                  {isNl ? 'Fotograaf (RAW)' : 'Pro RAW'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] hover:border-[var(--ink)] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <UploadCloud size={14} className="text-[var(--accent)]" />
                <span>{isNl ? 'Test upload' : 'Test upload'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBeamerOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[var(--ink)] text-white hover:bg-[var(--accent)] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Tv size={14} className="text-[#fbd38d]" />
                <span>{isNl ? 'Open beamer' : 'Open beamer'}</span>
              </button>
            </div>
          </div>

          {/* Living Masonry / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => {
              const currentLikes = (photo.likes ?? 0) + (likedPhotoIds[photo.id] ?? 0);

              return (
                <div
                  key={photo.id}
                  onClick={() => setActiveLightboxPhoto(photo)}
                  className="group relative rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                >
                  {/* Image container */}
                  <div className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-neutral-100">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Pro Badge if photographer */}
                    {photo.authorType === 'photographer' && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-300 border border-amber-300/30 text-[10px] font-mono-code font-bold">
                        RAW Original
                      </span>
                    )}

                    {/* Subtle Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Metadata & Interactive Like Row */}
                  <div className="p-3.5 space-y-2">
                    <p className="text-xs text-[var(--ink)] font-medium line-clamp-2 leading-snug">
                      {photo.caption}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]/70 text-[11px] font-mono-code text-[var(--ink-soft)]">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-bold text-[var(--ink)] truncate">{photo.author}</span>
                        <span>·</span>
                        <span>{photo.timestamp}</span>
                      </div>

                      {/* Interactive Like Button */}
                      <button
                        type="button"
                        onClick={(e) => handleLike(photo.id, e)}
                        className="px-2 py-1 rounded-lg bg-[var(--paper)] hover:bg-rose-50 text-[var(--ink)] hover:text-rose-600 transition-colors flex items-center gap-1 shrink-0 font-bold"
                        aria-label="Vind ik leuk"
                      >
                        <Heart size={12} className="fill-rose-500 text-rose-500" />
                        <span>{currentLikes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Interactieve Tafelkaart Studio (Printbaar & Visueel) ── */}
      <section id="tafelkaartjes" className="py-16 lg:py-24 border-b border-[var(--border)] bg-[var(--paper)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Visual Customizer Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--accent)] mb-2 block">
                  {isNl ? 'Tafelkaart Studio' : 'Table Card Studio'}
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">
                  {isNl ? 'Kies jouw stijl. Print en zet op tafel.' : 'Choose your style. Print and place.'}
                </h2>
                <p className="text-sm text-[var(--ink-soft)] mt-2 leading-relaxed">
                  {isNl
                    ? 'Inbegrepen in Event en Event+: kant-en-klare PDF op A6-formaat, met jouw feestnaam en unieke QR-code.'
                    : 'Included in Event and Event+: print-ready A6 PDF cards with your custom party name and QR code.'}
                </p>
              </div>

              {/* Theme Selector Pills */}
              <div className="space-y-2">
                <label className="text-xs font-mono-code font-bold uppercase text-[var(--ink-soft)] block">
                  {isNl ? 'Kies kaartthema' : 'Select theme'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['linen', 'terracotta', 'olive', 'noir'] as CardTheme[]).map((thm) => {
                    const item = cardThemes[thm];
                    const isSelected = cardTheme === thm;

                    return (
                      <button
                        key={thm}
                        type="button"
                        onClick={() => setCardTheme(thm)}
                        className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between h-20 ${
                          isSelected
                            ? 'bg-[var(--surface)] border-[var(--ink)] shadow-md ring-1 ring-[var(--ink)]'
                            : 'bg-[var(--surface)] border-[var(--border)] hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`w-3.5 h-3.5 rounded-full ${item.accentBg} shadow-2xs`} />
                          {isSelected && <Check size={12} className="text-[var(--ink)]" />}
                        </div>
                        <span className="font-semibold text-[var(--ink)] truncate mt-1">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-code">
                <div>
                  <label className="text-[10px] text-[var(--ink-soft)] uppercase font-bold block mb-1">
                    {isNl ? 'Titel op kaart' : 'Card title'}
                  </label>
                  <input
                    type="text"
                    value={cardTitle}
                    onChange={(e) => setCardTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] font-bold focus:outline-hidden focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--ink-soft)] uppercase font-bold block mb-1">
                    {isNl ? 'Datum' : 'Date'}
                  </label>
                  <input
                    type="text"
                    value={cardDate}
                    onChange={(e) => setCardDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] focus:outline-hidden focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => showToast(isNl ? 'Printklare A6 PDF gedownload (300 DPI)' : 'Printable A6 PDF downloaded (300 DPI)')}
                  className="px-5 py-3 rounded-xl bg-[var(--ink)] text-white hover:bg-[#292524] text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  <Download size={14} />
                  <span>{isNl ? 'Download printklare PDF' : 'Download printable PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(`https://${heroSlug}.fesafotos.nl`);
                    showToast(isNl ? 'Feestlink gekopieerd naar klembord!' : 'Party link copied to clipboard!');
                  }}
                  className="px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--paper-2)] text-xs sm:text-sm font-semibold text-[var(--ink)] transition-colors flex items-center gap-2"
                >
                  <Share2 size={14} />
                  <span>{isNl ? 'Kopieer feestlink' : 'Copy party link'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Physical Folded Card Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className={`w-full max-w-sm rounded-3xl p-8 border-2 ${activeTheme.cardBg} ${activeTheme.border} shadow-2xl relative space-y-6 text-center select-none transform hover:-translate-y-1 transition-transform duration-300`}>
                {/* Fold crease hint */}
                <div className="absolute top-0 inset-x-8 h-1 border-b border-dashed border-neutral-400/40" />

                <div className="pt-2">
                  <div className={`font-display font-extrabold text-2xl ${activeTheme.text}`}>
                    {cardTitle}
                  </div>
                  <div className={`text-xs font-mono-code ${activeTheme.accent} mt-1`}>
                    {cardDate}
                  </div>
                </div>

                {/* QR Block */}
                <div className="inline-block p-4 rounded-2xl bg-white border border-neutral-300/60 shadow-md">
                  <div className="w-40 h-40 relative flex items-center justify-center bg-neutral-900 rounded-xl p-2 mx-auto">
                    <QrCode size={130} className="text-white" strokeWidth={1.5} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center font-display font-bold text-xs shadow-md">
                        FF
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className={`font-display font-bold text-sm ${activeTheme.text}`}>
                    {isNl ? 'Scan met je camera' : 'Scan with your camera'}
                  </div>
                  <p className="text-xs text-neutral-500 font-sans max-w-xs mx-auto">
                    {isNl ? 'Geen app nodig. Open de link en deel direct jouw mooiste herinneringen.' : 'No app needed. Open link and share your best moments.'}
                  </p>
                  <div className="text-[11px] font-mono-code font-bold text-[var(--accent)] pt-1">
                    {heroSlug}.fesafotos.nl
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Voor Fotografen (Visueel & Geen Gedoe) ── */}
      <section id="fotograaf" className="py-16 lg:py-24 border-b border-[var(--border)] bg-[var(--paper-2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Visual Photography Workflow Mock */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#d8ccbc] shadow-xl bg-[#eee5d8]">
                <img
                  src="/src/assets/images/photographer_delivery_workflow_1791985661699.jpg"
                  alt="Professionele eventfotograaf aan het werk met camera en laptop"
                  className="w-full h-[380px] sm:h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-[11px] font-mono-code font-bold uppercase text-amber-300">
                    Pro Fotograaf Portaal
                  </span>
                  <div className="font-display font-bold text-xl sm:text-2xl text-white">
                    Sony A7R V · Leica M11 · Canon R5
                  </div>
                  <p className="text-xs text-white/80 font-mono-code">
                    Originele RAW & uncompressed JPEG uploads zonder kwaliteitsverlies.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Crisp Comparison */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--accent)] mb-2 block">
                  {isNl ? 'Voor event- en trouwfotografen' : 'For event & wedding photographers'}
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">
                  {isNl ? 'Geen WeTransfer links meer die na 7 dagen verlopen.' : 'No more expiring WeTransfer links.'}
                </h2>
              </div>

              {/* Comparison Cards */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[var(--surface)] border border-red-200/80 shadow-2xs space-y-1">
                  <div className="text-xs font-bold text-[var(--danger)] flex items-center gap-1.5">
                    <span>✕</span>
                    <span>{isNl ? 'De oude rompslomp' : 'The old hassle'}</span>
                  </div>
                  <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
                    {isNl
                      ? 'ZIP-bestanden van 12 GB downloaden, WeTransfer links die verlopen na een week, en foto\'s die in WhatsApp groepen worden verkleind tot korrelige snapshots.'
                      : 'Downloading 12 GB ZIP archives, links expiring in 7 days, and photos compressed in chat groups into blurry low-res shots.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--surface)] border border-emerald-300 shadow-2xs space-y-1">
                  <div className="text-xs font-bold text-[var(--success)] flex items-center gap-1.5">
                    <Check size={14} strokeWidth={2.5} />
                    <span>{isNl ? 'De fesafotos. manier' : 'The fesafotos. way'}</span>
                  </div>
                  <p className="text-xs text-[var(--ink)] leading-relaxed">
                    {isNl
                      ? 'Eén dedicated upload-ingang voor de fotograaf. De originals belanden direct in hoge resolutie in het album, klaar voor de beamer en voor het bruidspaar om te downloaden.'
                      : 'One dedicated portal for the photographer. Originals land directly in full resolution into the album, ready for the beamer and 1-click host downloads.'}
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => showToast(isNl ? 'Fotograaf toegang geactiveerd voor Sanjay & Dewie!' : 'Photographer portal unlocked for Sanjay & Dewie!')}
                  className="px-5 py-3 rounded-xl bg-[var(--ink)] text-white hover:bg-[#292524] text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  <span>{isNl ? 'Open fotograaf portaal demo' : 'Open photographer portal demo'}</span>
                  <ArrowRight size={14} className="text-[#fbd38d]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Visuele Prijzen (Helder, Eerlijk, Geen Flauwekul) ── */}
      <section id="prijzen" className="py-16 lg:py-24 border-b border-[var(--border)] bg-[var(--paper)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--accent)] mb-2 block">
              {isNl ? 'Transparante tarieven' : 'Transparent pricing'}
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight mb-3">
              {isNl ? 'Eenmalig per feest. Nooit een abonnement.' : 'One-time per event. Never a subscription.'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-soft)]">
              {isNl
                ? 'Geen maandelijkse kosten die stilzwijgend doorlopen. Je betaalt één keer en het album blijft online.'
                : 'No recurring monthly charges. Pay once and your album remains accessible online.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Plan 1: Gratis */}
            <div className="p-7 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-mono-code font-bold uppercase text-[var(--ink-soft)]">
                    {isNl ? 'Gratis Uitproberen' : 'Free Trial'}
                  </div>
                  <div className="font-display font-extrabold text-4xl text-[var(--ink)] mt-2">
                    € 0
                  </div>
                  <div className="text-xs text-[var(--ink-soft)] font-mono-code mt-0.5">
                    {isNl ? 'Voor een klein feestje' : 'For intimate get-togethers'}
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-[var(--ink)] pt-4 border-t border-[var(--border)] font-sans">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[var(--success)]" />
                    <span>Tot 150 foto's</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[var(--success)]" />
                    <span>Eigen adres: naam.fesafotos.nl</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[var(--success)]" />
                    <span>Geen app download voor gasten</span>
                  </li>
                  <li className="flex items-center gap-2 text-neutral-400">
                    <span>✕</span>
                    <span>Geen videoclips</span>
                  </li>
                  <li className="flex items-center gap-2 text-neutral-400">
                    <span>✕</span>
                    <span>30 dagen online</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setIsClaimModalOpen(true)}
                className="w-full py-3 rounded-xl bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--border)] text-xs font-semibold border border-[var(--border)] transition-colors"
              >
                {isNl ? 'Start gratis feest' : 'Start free party'}
              </button>
            </div>

            {/* Plan 2: Event (Populairst) */}
            <div className="p-7 rounded-3xl bg-[var(--surface)] border-2 border-[var(--ink)] shadow-xl relative flex flex-col justify-between space-y-6">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--accent)] text-white text-[11px] font-mono-code font-bold uppercase tracking-wider shadow-sm">
                ★ {isNl ? 'Meest Gekozen' : 'Most Popular'}
              </span>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-mono-code font-bold uppercase text-[var(--accent)]">
                    Event
                  </div>
                  <div className="font-display font-extrabold text-4xl text-[var(--ink)] mt-2">
                    € 49
                  </div>
                  <div className="text-xs text-[var(--ink-soft)] font-mono-code mt-0.5">
                    {isNl ? 'Eenmalig bedrag' : 'One-time fee'}
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-[var(--ink)] pt-4 border-t border-[var(--border)] font-sans">
                  <li className="flex items-center gap-2 font-bold">
                    <Check size={14} className="text-[var(--success)]" />
                    <span>{isNl ? 'Onbeperkt aantal foto\'s' : 'Unlimited photos'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[var(--success)]" />
                    <span>50 videoclips (tot 180s per clip)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[var(--success)]" />
                    <span>Live Beamer Slideshow voor op zaalschermen</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[var(--success)]" />
                    <span>Printklare A6 Tafelkaartjes PDF met QR</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[var(--success)]" />
                    <span>12 maanden bewaartermijn</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setIsClaimModalOpen(true)}
                className="w-full py-3 rounded-xl bg-[var(--ink)] text-white hover:bg-[var(--accent)] text-xs font-semibold transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <span>{isNl ? 'Kies Event pakket' : 'Choose Event plan'}</span>
                <ArrowRight size={14} className="text-[#fbd38d]" />
              </button>
            </div>

            {/* Plan 3: Event+ */}
            <div className="p-7 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-mono-code font-bold uppercase text-[var(--ink-soft)]">
                    Event+
                  </div>
                  <div className="font-display font-extrabold text-4xl text-[var(--ink)] mt-2">
                    € 69
                  </div>
                  <div className="text-xs text-[var(--ink-soft)] font-mono-code mt-0.5">
                    {isNl ? 'Voor grote feesten en bruiloften' : 'For weddings & major milestones'}
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-[var(--ink)] pt-4 border-t border-[var(--border)] font-sans">
                  <li className="flex items-center gap-2 font-bold">
                    <Check size={14} className="text-[var(--success)]" />
                    <span>{isNl ? 'Onbeperkt foto\'s en gasten' : 'Unlimited photos and guests'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[var(--success)]" />
                    <span>100 videoclips (tot 300s per clip)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[var(--success)]" />
                    <span>Eigen domein optie (bijv. daanensophie.nl)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[var(--success)]" />
                    <span>Toegang voor professionele fotograaf</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[var(--success)]" />
                    <span>24 maanden bewaartermijn</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setIsClaimModalOpen(true)}
                className="w-full py-3 rounded-xl bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--border)] text-xs font-semibold border border-[var(--border)] transition-colors"
              >
                {isNl ? 'Kies Event+' : 'Choose Event+'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Editorial Footer ── */}
      <footer className="bg-[#f5ede2] border-t border-[var(--border)] py-14 text-xs text-[var(--ink-soft)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[var(--border)]">
            <div>
              <div className="flex items-center gap-2 font-display font-bold text-2xl text-[var(--ink)]">
                <span>fesafotos</span>
                <span className="text-[var(--accent)]">.</span>
              </div>
              <p className="text-xs text-[var(--ink-soft)] mt-1 font-mono-code">
                {isNl ? 'Het feest dat blijft.' : 'The party that stays.'}
              </p>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap items-center gap-6 font-medium text-xs">
              <button
                type="button"
                onClick={() => setIsClaimModalOpen(true)}
                className="hover:text-[var(--ink)]"
              >
                {isNl ? 'Check naam' : 'Check name'}
              </button>
              <a href="#prijzen" className="hover:text-[var(--ink)]">
                {isNl ? 'Prijzen' : 'Pricing'}
              </a>
              <a href="#tafelkaartjes" className="hover:text-[var(--ink)]">
                {isNl ? 'Tafelkaarten' : 'Table cards'}
              </a>
              {onNavigateToParty && (
                <button
                  type="button"
                  onClick={() => onNavigateToParty('sanjayendewie')}
                  className="font-bold text-[var(--accent)] hover:underline"
                >
                  Demo: Sanjay & Dewie →
                </button>
              )}
              {onNavigateToManage && (
                <button
                  type="button"
                  onClick={onNavigateToManage}
                  className="hover:text-[var(--ink)]"
                >
                  Operator Login
                </button>
              )}
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono-code text-[var(--ink-soft)]">
            <p>© 2026 fesafotos. Alle rechten voorbehouden.</p>
            <div className="flex items-center gap-4">
              <span>Gehost op Hetzner Cloud (k3s)</span>
              <span>·</span>
              <span>100% AVG / GDPR compliant</span>
              <span>·</span>
              <span>Amsterdam, NL</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Modal: Name Checker / Claim Drawer ── */}
      {isClaimModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsClaimModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-2xl text-[var(--ink)]">
                  {isNl ? 'Kies jouw feestadres' : 'Choose your party address'}
                </h3>
                <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                  {isNl ? 'Check direct of jouw gewenste albumnaam nog vrij is.' : 'Check instantly if your desired party slug is available.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsClaimModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-[var(--ink)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex items-center gap-2">
              <span className="text-xs font-mono-code text-[var(--ink-soft)]">https://</span>
              <input
                type="text"
                value={heroSlug}
                onChange={(e) => handleHeroSlugChange(e.target.value)}
                placeholder="jouwnaam"
                className="w-full text-base font-mono-code font-bold text-[var(--ink)] bg-transparent focus:outline-hidden"
                autoFocus
              />
              <span className="text-xs font-mono-code text-[var(--accent)] font-bold">.fesafotos.nl</span>
            </div>

            {isHeroSlugAvailable ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                <div className="font-bold text-[var(--success)] flex items-center gap-1.5 font-mono-code">
                  <Check size={16} strokeWidth={2.5} />
                  <span>{heroSlug}.fesafotos.nl {isNl ? 'is beschikbaar!' : 'is available!'}</span>
                </div>
                <p className="text-[var(--ink-soft)]">
                  {isNl
                    ? 'Reserveer dit adres nu. Je kunt direct je thema kiezen en tafelkaartjes downloaden.'
                    : 'Reserve this address now. Choose your theme and generate table cards right away.'}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                <div className="font-bold text-amber-800 font-mono-code">
                  {heroSlug}.fesafotos.nl {isNl ? 'is al in gebruik' : 'is taken'}
                </div>
                <p className="text-amber-900">
                  {isNl ? 'Probeer een van deze suggesties:' : 'Try one of these suggestions:'}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono-code">
                  {[`${heroSlug}-2026`, `feest-van-${heroSlug}`, `fesa-${heroSlug}`].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleHeroSlugChange(sug)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-[11px] font-bold text-[var(--ink)] hover:border-[var(--ink)]"
                    >
                      {sug}.fesafotos.nl
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3 font-sans">
              <button
                type="button"
                onClick={() => setIsClaimModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)]"
              >
                {isNl ? 'Annuleren' : 'Cancel'}
              </button>

              <button
                type="button"
                disabled={!isHeroSlugAvailable}
                onClick={() => {
                  setIsClaimModalOpen(false);
                  showToast(isNl ? `Adres ${heroSlug}.fesafotos.nl gereserveerd!` : `Address ${heroSlug}.fesafotos.nl reserved!`);
                  if (onNavigateToParty) {
                    onNavigateToParty(heroSlug);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-[var(--ink)] text-white hover:bg-[var(--accent)] text-xs font-semibold disabled:opacity-50 transition-colors shadow-sm"
              >
                {isNl ? 'Reserveer dit feest' : 'Reserve this party'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Beamer Projector Mode ── */}
      {isBeamerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#0d0c0b] text-white flex flex-col justify-between p-6 sm:p-10 select-none animate-in fade-in duration-200"
        >
          {/* Top Bar for Venue Screens */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl font-bold tracking-tight">
                fesafotos<span className="text-[var(--accent)]">.</span>
              </span>
              <span className="text-white/30">/</span>
              <span className="text-xs font-mono-code text-white/70">
                {heroSlug}.fesafotos.nl
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono-code border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Beamer Stream (Paviljoen Puur)</span>
              </span>

              <button
                type="button"
                onClick={() => setIsBeamerOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Sluit beamer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Central Hero Photo Showcase */}
          <div className="flex-1 my-6 flex items-center justify-center relative overflow-hidden">
            <div className="max-w-4xl max-h-[65vh] rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative group">
              <img
                src={photos[0].url}
                alt="Beamer slide"
                className="w-full h-full object-contain max-h-[65vh]"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold">{photos[0].author}</div>
                  <div className="text-white/70 text-[11px]">{photos[0].caption}</div>
                </div>
                <div className="text-rose-400 font-bold flex items-center gap-1">
                  <Heart size={14} className="fill-rose-400" />
                  <span>{photos[0].likes + 1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Venue Footer with QR Code */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono-code text-white/70">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 p-1 rounded-lg bg-white flex items-center justify-center">
                <QrCode size={40} className="text-black" />
              </div>
              <div>
                <div className="text-white font-bold">{isNl ? 'Scan en doe mee' : 'Scan and join'}</div>
                <div className="text-[11px] text-white/50">{heroSlug}.fesafotos.nl</div>
              </div>
            </div>

            <div className="text-right">
              <div>{photos.length} {isNl ? 'momenten vastgelegd' : 'moments captured'}</div>
              <div className="text-[10px] text-white/40">Druk op [ESC] om te sluiten</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Lightbox Viewer ── */}
      {activeLightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-150"
          onClick={() => setActiveLightboxPhoto(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-[var(--surface)] border border-neutral-700 overflow-hidden shadow-2xl flex flex-col md:flex-row text-[var(--ink)]"
          >
            {/* Image on Left */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px]">
              <img
                src={activeLightboxPhoto.url}
                alt={activeLightboxPhoto.caption}
                className="max-h-[75vh] w-full object-contain"
              />
              <button
                type="button"
                onClick={() => setActiveLightboxPhoto(null)}
                className="md:hidden absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Metadata on Right */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded bg-[var(--paper)] border border-[var(--border)] text-[var(--accent)]">
                    {activeLightboxPhoto.authorType === 'photographer' ? 'Pro Fotograaf' : 'Gast Moment'}
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveLightboxPhoto(null)}
                    className="hidden md:block p-1 rounded-lg text-neutral-400 hover:text-[var(--ink)]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div>
                  <h4 className="font-display font-bold text-lg text-[var(--ink)]">
                    {activeLightboxPhoto.author}
                  </h4>
                  <div className="text-xs text-[var(--ink-soft)] font-mono-code">
                    {activeLightboxPhoto.timestamp} · Paviljoen Puur
                  </div>
                </div>

                <p className="text-xs text-[var(--ink)] leading-relaxed pt-2 border-t border-[var(--border)]">
                  {activeLightboxPhoto.caption}
                </p>
              </div>

              {/* Bottom stats and action */}
              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono-code">
                <button
                  type="button"
                  onClick={(e) => handleLike(activeLightboxPhoto.id, e)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 font-bold border border-rose-200 flex items-center gap-1.5"
                >
                  <Heart size={14} className="fill-rose-500" />
                  <span>
                    {(activeLightboxPhoto.likes ?? 0) + (likedPhotoIds[activeLightboxPhoto.id] ?? 0)} likes
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast(isNl ? 'Originele hoge resolutie foto gedownload.' : 'Original high-res photo downloaded.')}
                  className="px-3 py-1.5 rounded-xl bg-[var(--paper)] hover:bg-[var(--border)] text-[var(--ink)] font-medium flex items-center gap-1"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Guest Test Upload Simulation ── */}
      {isUploadModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-7 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="font-display font-bold text-xl text-[var(--ink)]">
                  {isNl ? 'Upload een testfoto' : 'Upload a test photo'}
                </h3>
                <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                  {isNl ? 'Ervaar hoe snel een gastfoto op de muur verschijnt.' : 'See how instantly a photo lands on the live wall.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-[var(--ink)]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTestUpload} className="space-y-4 text-xs font-mono-code">
              <div>
                <label className="text-[10px] uppercase font-bold text-[var(--ink-soft)] block mb-1">
                  {isNl ? 'Jouw voornaam' : 'Your first name'} *
                </label>
                <input
                  type="text"
                  required
                  value={uploadGuestName}
                  onChange={(e) => setUploadGuestName(e.target.value)}
                  placeholder={isNl ? 'bijv. Sanne' : 'e.g. Sarah'}
                  className="w-full p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] text-[var(--ink)] font-bold focus:outline-hidden focus:border-[var(--accent)] font-sans"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[var(--ink-soft)] block mb-1">
                  {isNl ? 'Kort bijschrift (optioneel)' : 'Short caption (optional)'}
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder={isNl ? 'Wat gebeurt er op de foto?' : 'What is happening in this photo?'}
                  className="w-full p-2.5 rounded-xl bg-[var(--paper)] border border-[var(--border)] text-[var(--ink)] focus:outline-hidden focus:border-[var(--accent)] font-sans"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[var(--paper)] border border-[var(--border)] flex items-center gap-3">
                <img
                  src="/src/assets/images/party_guest_moments_grid_1791985661203.jpg"
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="text-[11px] leading-tight">
                  <div className="font-bold text-[var(--ink)]">dansvloer_finale.jpg</div>
                  <div className="text-[var(--ink-soft)]">3.2 MB · Directe compressieloze upload</div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--ink-soft)]"
                >
                  {isNl ? 'Annuleren' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--ink)] text-white hover:bg-[var(--accent)] text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <UploadCloud size={14} />
                  <span>{isNl ? 'Plaats op de muur' : 'Place on the wall'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
