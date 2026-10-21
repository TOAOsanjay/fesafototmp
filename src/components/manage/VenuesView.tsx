import React, { useState } from 'react';
import { VenueLocation } from '../../types/manage';
import { initialVenues } from '../../data/manageData';
import { MapPin, Tv, RefreshCw, Volume2, Wifi, CheckCircle2, Sliders, ExternalLink } from 'lucide-react';

interface VenuesViewProps {
  lang: 'nl' | 'en';
  onShowToast: (msg: string) => void;
}

export const VenuesView: React.FC<VenuesViewProps> = ({ lang, onShowToast }) => {
  const isNl = lang === 'nl';
  const [venues, setVenues] = useState<VenueLocation[]>(initialVenues);

  const handleUpdateTiming = (venueId: string, newSeconds: number) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === venueId ? { ...v, cycleSeconds: newSeconds } : v))
    );
    onShowToast(`Diawissel-interval aangepast naar ${newSeconds} seconden.`);
  };

  const handleRegenerateToken = (venueId: string) => {
    const newToken = `bmr_live_${Math.random().toString(36).substring(2, 9)}`;
    setVenues((prev) =>
      prev.map((v) => (v.id === venueId ? { ...v, beamerToken: newToken } : v))
    );
    onShowToast(`Nieuwe beamer stream token gegenereerd: ${newToken}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border)]">
        <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
          {isNl ? 'Locaties & Zaal Beamer Koppelingen' : 'Venues & Projector Stream Tokens'}
        </h2>
        <p className="text-xs text-[var(--ink-soft)] mt-0.5">
          {isNl
            ? 'Evenementenlocaties met live beamer schermen, WebSocket stream tokens en diawissel configuratie.'
            : 'Event venues with live projector displays, WebSocket stream tokens, and slideshow timings.'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-mono-code uppercase">Actieve Schermen</div>
          <div className="text-2xl font-display font-bold text-[var(--ink)] mt-0.5">7 beamers</div>
          <div className="text-[10px] font-mono-code text-[var(--success)] mt-0.5">Over 3 feestlocaties</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-mono-code uppercase">Stream Protocol</div>
          <div className="text-2xl font-display font-bold text-[var(--accent)] mt-0.5">wss://beamer</div>
          <div className="text-[10px] font-mono-code text-[var(--ink-soft)] mt-0.5">Lage latency (onder 300ms)</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-mono-code uppercase">Audio & DB Begrenzer</div>
          <div className="text-2xl font-display font-bold text-[var(--success)] mt-0.5">Gekoppeld</div>
          <div className="text-[10px] font-mono-code text-[var(--ink-soft)] mt-0.5">Ondersteunt zaallimiet 95dBA</div>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-[var(--paper)] text-[var(--accent)] border border-[var(--border)]">
                  <MapPin size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[var(--ink)]">
                    {venue.name}
                  </h3>
                  <div className="text-xs text-[var(--ink-soft)] font-medium">
                    {venue.city} · {venue.address}
                  </div>
                  <div className="text-[11px] font-mono-code text-[var(--accent)] font-semibold mt-0.5">
                    Actieve tenant: {venue.activeTenantSlug}
                  </div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase ${
                  venue.status === 'connected'
                    ? 'bg-emerald-50 text-[var(--success)] border border-emerald-200'
                    : 'bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                {venue.status === 'connected' ? 'Verbonden (4K)' : 'Standby'}
              </span>
            </div>

            {/* Hardware Parameters */}
            <div className="p-3.5 rounded-2xl bg-[var(--paper)] border border-[var(--border)] space-y-2.5 font-mono-code text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[var(--ink-soft)] flex items-center gap-1.5">
                  <Tv size={13} />
                  <span>Schermen / Aspect Ratio:</span>
                </span>
                <span className="font-bold text-[var(--ink)]">
                  {venue.screens}x schermen ({venue.aspectRatio})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--ink-soft)] flex items-center gap-1.5">
                  <Wifi size={13} />
                  <span>Wi-Fi SSID:</span>
                </span>
                <span className="text-[var(--ink)]">{venue.wifiSsid}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--ink-soft)] flex items-center gap-1.5">
                  <Volume2 size={13} />
                  <span>Geluidsbegrenzer:</span>
                </span>
                <span className="text-[var(--ink)]">{venue.maxDba} dBA max</span>
              </div>
            </div>

            {/* Timing & Controls */}
            <div className="pt-2 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--ink-soft)] font-medium">Diawissel:</span>
                <div className="flex items-center gap-1">
                  {[3, 5, 8, 10].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => handleUpdateTiming(venue.id, sec)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono-code font-bold transition-colors ${
                        venue.cycleSeconds === sec
                          ? 'bg-[var(--accent)] text-white shadow-2xs'
                          : 'bg-[var(--paper)] text-[var(--ink-soft)] hover:text-[var(--ink)] border border-[var(--border)]'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRegenerateToken(venue.id)}
                className="px-2.5 py-1.5 rounded-xl border border-[var(--border)] hover:bg-[var(--paper-2)] text-[var(--ink)] text-[11px] font-mono-code flex items-center gap-1.5 self-start sm:self-auto"
                title="Hergenereer beamer secret token"
              >
                <RefreshCw size={12} />
                <span>Nieuw Token</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
