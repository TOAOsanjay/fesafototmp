import React, { useState } from 'react';
import { TenantParty, PlanId } from '../../types/manage';
import { X, CheckCircle2, Sparkles, Calendar, Tag, User, Mail, Globe } from 'lucide-react';

interface NewTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newTenant: TenantParty) => void;
  lang: 'nl' | 'en';
}

export const NewTenantModal: React.FC<NewTenantModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  lang,
}) => {
  const isNl = lang === 'nl';

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [date, setDate] = useState('Zaterdag 28 november 2026');
  const [hashtag, setHashtag] = useState('');
  const [plan, setPlan] = useState<PlanId>('event');
  const [hostName, setHostName] = useState('');
  const [hostEmail, setHostEmail] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState(
    'Welkom op ons feest! Deel hier al jullie mooie foto\'s en video\'s met ons.'
  );

  if (!isOpen) return null;

  // Auto-slug generator when name changes
  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 24);
    setSlug(generatedSlug);
    if (!hashtag && val) {
      setHashtag(`#${val.replace(/[^a-zA-Z0-9]/g, '')}2026`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    const newTenant: TenantParty = {
      id: `t-${slug}-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      slug: slug.trim(),
      subdomain: `${slug.trim()}.fesafotos.nl`,
      date: date.trim(),
      hashtag: hashtag.trim() || `#${slug}2026`,
      plan,
      uploads: 0,
      videos: 0,
      guests: 0,
      health: 'healthy',
      daysToGo: 38,
      hostName: hostName.trim() || name.trim(),
      hostEmail: hostEmail.trim() || 'gastheer@example.nl',
      customDomain: plan === 'event_plus' && customDomain.trim() ? customDomain.trim() : undefined,
      storageMb: 0,
      welcomeMessage: welcomeMessage.trim(),
    };

    onCreate(newTenant);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden text-[var(--ink)] flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--border)] bg-[var(--paper-2)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)]">
              <Sparkles size={18} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-[var(--ink)]">
                {isNl ? 'Nieuw Feest (Tenant) Aanmaken' : 'Create New Party (Tenant)'}
              </h3>
              <p className="text-xs text-[var(--ink-soft)] font-mono-code">
                {isNl ? 'Direct klaarzetten voor gastheer en beamer' : 'Instant provisioning for host and projector'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--paper)] hover:bg-[var(--border)] flex items-center justify-center text-xs font-semibold transition-colors"
          >
            <X size={15} strokeWidth={1.5} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Party Name */}
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-1">
              {isNl ? 'Naam van het feest of bruidspaar *' : 'Party or Couple Name *'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="bijv. Lisa & Mark of Jasper 40"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] text-xs text-[var(--ink)] font-medium"
            />
          </div>

          {/* Subdomain & Slug Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[var(--ink)] mb-1">
                Slug (adrescode) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                placeholder="bijv. lisaenmark"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] font-mono-code text-xs text-[var(--ink)]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--ink)] mb-1">
                Subdomein adres
              </label>
              <div className="px-3 py-2 rounded-xl bg-[var(--paper-2)] border border-[var(--border)] font-mono-code text-[11px] text-[var(--accent)] font-semibold truncate">
                {slug ? `${slug}.fesafotos.nl` : 'naam.fesafotos.nl'}
              </div>
            </div>
          </div>

          {/* Date & Hashtag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[var(--ink)] mb-1 flex items-center gap-1.5">
                <Calendar size={13} className="text-[var(--ink-soft)]" />
                <span>Datum</span>
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="bijv. Zaterdag 28 november 2026"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] text-xs text-[var(--ink)]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--ink)] mb-1 flex items-center gap-1.5">
                <Tag size={13} className="text-[var(--ink-soft)]" />
                <span>Hashtag</span>
              </label>
              <input
                type="text"
                value={hashtag}
                onChange={(e) => setHashtag(e.target.value)}
                placeholder="#LisaMark2026"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] font-mono-code text-xs text-[var(--accent)]"
              />
            </div>
          </div>

          {/* Plan Selector */}
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-1.5">
              Pakket selectie
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'free', label: 'Gratis', price: 'EUR 0', note: '90 dagen retentie' },
                { id: 'event', label: 'Event', price: 'EUR 49', note: '12 mnd, ZIP archief' },
                { id: 'event_plus', label: 'Event+', price: 'EUR 69', note: '24 mnd, Live Beamer & Domein' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlan(p.id as PlanId)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    plan === p.id
                      ? 'border-[var(--accent)] bg-[var(--paper)] shadow-2xs ring-1 ring-[var(--accent)]'
                      : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--paper-2)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--ink)]">{p.label}</span>
                    <span className="font-mono-code text-[11px] text-[var(--accent)] font-semibold">{p.price}</span>
                  </div>
                  <div className="text-[10px] text-[var(--ink-soft)] mt-1 font-mono-code">
                    {p.note}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Host Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]">
            <div>
              <label className="block font-semibold text-[var(--ink)] mb-1 flex items-center gap-1.5">
                <User size={13} className="text-[var(--ink-soft)]" />
                <span>Naam gastheer / contact</span>
              </label>
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="bijv. Lisa Vermeer"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] text-xs text-[var(--ink)]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--ink)] mb-1 flex items-center gap-1.5">
                <Mail size={13} className="text-[var(--ink-soft)]" />
                <span>E-mail gastheer</span>
              </label>
              <input
                type="email"
                value={hostEmail}
                onChange={(e) => setHostEmail(e.target.value)}
                placeholder="lisa@vermeer.nl"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] text-xs text-[var(--ink)]"
              />
            </div>
          </div>

          {/* Optional Custom Domain for Event+ */}
          {plan === 'event_plus' && (
            <div>
              <label className="block font-semibold text-[var(--ink)] mb-1 flex items-center gap-1.5">
                <Globe size={13} className="text-[var(--accent)]" />
                <span>Eigen domeinnaam (Event+ inbegrepen)</span>
              </label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="bijv. markenlisa.nl (optioneel)"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] font-mono-code text-xs text-[var(--ink)]"
              />
            </div>
          )}

          {/* Welcome Message */}
          <div>
            <label className="block font-semibold text-[var(--ink)] mb-1">
              Welkomsttekst voor gasten
            </label>
            <textarea
              rows={2}
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] text-xs text-[var(--ink)] resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)]"
            >
              Annuleren
            </button>

            <button
              type="submit"
              disabled={!name.trim() || !slug.trim()}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[var(--ink)] hover:bg-[#292524] disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs flex items-center gap-2"
            >
              <CheckCircle2 size={14} />
              <span>{isNl ? 'Feest Aanmaken & Activeren' : 'Provision Party'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
