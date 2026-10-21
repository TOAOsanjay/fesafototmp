import React, { useState } from 'react';
import { Language } from '../../types/party';

interface ComponentInventoryProps {
  lang: Language;
}

export const ComponentInventory: React.FC<ComponentInventoryProps> = ({ lang }) => {
  const isNl = lang === 'nl';
  const [isOpen, setIsOpen] = useState(false);

  const inventory = [
    {
      name: 'AppBar',
      purpose: 'Brand header with wordmark fesafotos., FF monogram with x-height confetti dot, role switcher chip, and NL/EN toggle.',
      states: 'Default, role active (guest/organiser/photographer/venue), language toggle active.',
    },
    {
      name: 'BottomTabBar',
      purpose: 'Fixed mobile bottom navigation with 4 destinations: Feest, Muur, Mijn album, Organisatie. Safe-area aware.',
      states: 'Active tab indicator dot, host-only indicator for Organisatie, tap scale response.',
    },
    {
      name: 'HeroSection',
      purpose: 'Party headline (Sanjay & Dewie), date, #HoldMyDrinkKeepCalm41! chip, verbatim welcome copy, counter strip, and venue QR block.',
      states: 'Responsive layout, role-specific notification banner, live counter sync.',
    },
    {
      name: 'LiveWallSection',
      purpose: 'Realtime mosaic of photos and videos with newest items first. Feed on mobile, masonry on desktop.',
      states: 'Filter tabs (all/photo/video), new item pulse, video duration badge, like reaction counter, empty state preview toggle.',
    },
    {
      name: 'MyAlbumSection',
      purpose: 'The guest\'s private upload workspace with big inviting drop tile (supports tap, drag-drop, and folder drop).',
      states: 'Status ribbons (geaccepteerd, in beoordeling, verborgen), moderation review workspace, soft highlight pulse on upload completion.',
    },
    {
      name: 'UploadModalSheet',
      purpose: 'One modal primitive: mobile bottom sheet / desktop centered dialog. Overall progress bar, per-file speed and ETA.',
      states: 'Idle, active uploading with live ETA, checkmark drawing animation, confetti burst, countdown with Review and Blijven buttons.',
    },
    {
      name: 'Lightbox',
      purpose: 'Unobstructed full-screen media viewer with HTML5 video playback, keyboard navigation (Esc, Arrow keys), download and delete.',
      states: 'Active media view, video play/pause controls, like toggle, guest deletion modal.',
    },
    {
      name: 'OrganisationSection',
      purpose: 'Host dashboard with guest roster, live theme switcher (swaps CSS tokens), party copy editor, and plan limit meter.',
      states: 'Active theme preset selection, confetti vs balloon animation preview, CSV guest import, save confirmation.',
    },
    {
      name: 'GuestbookChatSection',
      purpose: 'Dual-surface for guest messages: text/voice note countdown composer, and intelligent guest assistant chat.',
      states: 'Text submit, voice note live recording timer (0-30s), assistant typing state naming the assistant, quick question chips.',
    },
    {
      name: 'RsvpCard',
      purpose: 'Interactive attendance confirmation card with guest count, dietary preferences, and personal link copy.',
      states: 'Aanwezig, Misschien, Verhinderd, saved confirmation state.',
    },
    {
      name: 'BeamerView',
      purpose: 'Fullscreen venue screen presentation mode with photo cycling, ambient backdrop, corner QR code, and countdown timer.',
      states: 'Auto-advance countdown, pause/play toggle, keyboard shortcuts (Space, Arrow keys, Esc).',
    },
  ];

  return (
    <section className="py-10 border-t border-[var(--border)] bg-[var(--paper)] text-xs text-[var(--ink-soft)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono-code font-bold text-[var(--accent)] uppercase">
              {isNl ? 'Ontwikkelaars Documentatie' : 'Developer Documentation'}
            </span>
            <span>·</span>
            <span>{isNl ? 'Componenten Inventaris' : 'Component Inventory'}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--paper-2)] text-[var(--ink)] font-semibold transition-colors"
          >
            {isOpen ? (isNl ? 'Verberg inventaris ▲' : 'Hide inventory ▲') : (isNl ? 'Bekijk componenten inventaris ▼' : 'View component inventory ▼')}
          </button>
        </div>

        {isOpen && (
          <div className="mt-6 space-y-4 pt-4 border-t border-[var(--border)]">
            <p className="leading-relaxed">
              {isNl
                ? 'Deze feestpagina is opgebouwd volgens een coherent ontwerpsysteem met herbruikbare tokens en één overkoepelend modale primitieve. Hieronder volgt de specificatie voor ontwikkelaars om het ontwerp direct naar een backend of andere stack te porteren.'
                : 'This party page is constructed with a cohesive design system, unified CSS tokens, and a single modal primitive. Below is the technical component inventory for developers.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {inventory.map((comp) => (
                <div
                  key={comp.name}
                  className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1.5"
                >
                  <div className="font-mono-code font-bold text-[var(--ink)] flex items-center justify-between">
                    <span>&lt;{comp.name} /&gt;</span>
                  </div>
                  <p className="text-[11px] text-[var(--ink)] leading-snug">
                    {comp.purpose}
                  </p>
                  <div className="text-[10px] font-mono-code text-[var(--accent)] pt-1 border-t border-[var(--border)]">
                    States: {comp.states}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
