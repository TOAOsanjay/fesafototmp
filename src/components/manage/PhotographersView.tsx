import React, { useState } from 'react';
import { PhotographerUser } from '../../types/manage';
import { initialPhotographers } from '../../data/manageData';
import { Camera, Copy, Check, Plus, ExternalLink, ShieldCheck, HardDrive, Smartphone } from 'lucide-react';

interface PhotographersViewProps {
  lang: 'nl' | 'en';
  onShowToast: (msg: string) => void;
}

export const PhotographersView: React.FC<PhotographersViewProps> = ({ lang, onShowToast }) => {
  const isNl = lang === 'nl';
  const [photographers, setPhotographers] = useState<PhotographerUser[]>(initialPhotographers);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Photographer Form State
  const [name, setName] = useState('');
  const [studioName, setStudioName] = useState('');
  const [email, setEmail] = useState('');
  const [tenantSlug, setTenantSlug] = useState('sanjayendewie');
  const [cameraPreset, setCameraPreset] = useState('Sony A7R V / Canon R5 (Uncompressed RAW)');

  const copyMagicLink = (token: string, id: string) => {
    navigator.clipboard?.writeText(`https://fesafotos.nl/pro/upload?token=${token}`);
    setCopiedId(id);
    onShowToast('Magic link gekopieerd naar klembord!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddPhotographer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newPhoto: PhotographerUser = {
      id: `photo-0${photographers.length + 1}`,
      name: name.trim(),
      studioName: studioName.trim() || name.trim(),
      email: email.trim(),
      phone: '+31 6 00000000',
      activeTenantSlug: tenantSlug,
      uploadsCount: 0,
      storageMb: 0,
      cameraPreset,
      magicToken: `ff_photo_live_${Math.random().toString(36).substring(2, 12)}`,
      status: 'pending',
      lastUpload: 'Uitnodiging verzonden',
    };

    setPhotographers([newPhoto, ...photographers]);
    setIsNewModalOpen(false);
    onShowToast(`Fotograaf ${name} toegevoegd en magic link aangemaakt.`);
    setName('');
    setStudioName('');
    setEmail('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border)] gap-3">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
            {isNl ? 'Gekoppelde Fotografen & Portaal Toegang' : 'Connected Photographers & Portal Access'}
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            {isNl
              ? 'Professionele fotografen die direct ongecomprimeerde RAW of high-res originals aanleveren zonder gastenapp.'
              : 'Professional photographers supplying uncompressed RAW and high-res originals directly.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-[var(--ink)] text-white hover:bg-[#292524] text-xs font-semibold flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>{isNl ? 'Nieuwe fotograaf uitnodigen' : 'Invite Photographer'}</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-mono-code uppercase">Gekoppelde Pro's</div>
          <div className="text-2xl font-display font-bold text-[var(--ink)] mt-0.5">{photographers.length}</div>
          <div className="text-[10px] font-mono-code text-[var(--success)] mt-0.5">2 actief met uploads</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-mono-code uppercase">Pro Originals Geleverd</div>
          <div className="text-2xl font-display font-bold text-[var(--accent)] mt-0.5">36 bestanden</div>
          <div className="text-[10px] font-mono-code text-[var(--ink-soft)] mt-0.5">2.1 GB zonder kwaliteitsverlies</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-mono-code uppercase">RAW Compressie Filter</div>
          <div className="text-2xl font-display font-bold text-[var(--success)] mt-0.5">Directe Passthrough</div>
          <div className="text-[10px] font-mono-code text-[var(--ink-soft)] mt-0.5">EXIF & kleurprofielen behouden</div>
        </div>
      </div>

      {/* Photographers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {photographers.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-4 hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-[var(--paper)] text-[var(--accent)] border border-[var(--border)]">
                  <Camera size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-display font-bold text-base text-[var(--ink)]">
                    {p.name}
                  </div>
                  <div className="text-xs text-[var(--ink-soft)] font-medium">
                    {p.studioName}
                  </div>
                  <div className="font-mono-code text-[11px] text-[var(--ink-soft)]/70 mt-0.5">
                    {p.email} · {p.phone}
                  </div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase ${
                  p.status === 'active'
                    ? 'bg-emerald-50 text-[var(--success)] border border-emerald-200'
                    : p.status === 'pending'
                    ? 'bg-amber-50 text-[var(--warning)] border border-amber-200'
                    : 'bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                {p.status === 'active' ? 'Actief' : p.status === 'pending' ? 'In afwachting' : 'Afgerond'}
              </span>
            </div>

            {/* Tenant assignment & quota info */}
            <div className="p-3 rounded-2xl bg-[var(--paper)] border border-[var(--border)] space-y-2 text-[11px] font-mono-code">
              <div className="flex justify-between">
                <span className="text-[var(--ink-soft)]">Gekoppeld Feest:</span>
                <span className="font-bold text-[var(--ink)]">fesafotos.nl/{p.activeTenantSlug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-soft)]">Camera Preset:</span>
                <span className="text-[var(--ink)]">{p.cameraPreset}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[var(--border)]">
                <span className="text-[var(--ink-soft)]">Uploads / Opslag:</span>
                <span className="font-bold text-[var(--accent)]">
                  {p.uploadsCount} foto's ({(p.storageMb / 1024).toFixed(1)} GB)
                </span>
              </div>
            </div>

            {/* Magic Link Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
              <div className="text-[10px] font-mono-code text-[var(--ink-soft)] truncate max-w-[200px]">
                Token: {p.magicToken.slice(0, 16)}...
              </div>

              <button
                type="button"
                onClick={() => copyMagicLink(p.magicToken, p.id)}
                className="px-3 py-1.5 rounded-xl border border-[var(--border)] hover:bg-[var(--paper-2)] text-[var(--ink)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedId === p.id ? (
                  <>
                    <Check size={13} className="text-[var(--success)]" />
                    <span className="text-[var(--success)]">Gekopieerd!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Kopieer Magic Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {isNewModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsNewModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl p-6 text-[var(--ink)] space-y-4"
          >
            <h3 className="font-display font-extrabold text-lg">
              {isNl ? 'Nieuwe Fotograaf Uitnodigen' : 'Invite New Photographer'}
            </h3>

            <form onSubmit={handleAddPhotographer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Naam fotograaf *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="bijv. Thijs van Houten"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Studio / Bedrijfsnaam</label>
                <input
                  type="text"
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  placeholder="bijv. Van Houten Weddings"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">E-mailadres *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="thijs@vanhouten.nl"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Koppel aan feest (tenant)</label>
                <select
                  value={tenantSlug}
                  onChange={(e) => setTenantSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] text-xs font-mono-code"
                >
                  <option value="sanjayendewie">Sanjay & Dewie (sanjayendewie)</option>
                  <option value="mientjes65">Mientjes 65 (mientjes65)</option>
                  <option value="test-amsterdam">Test Feestje Amsterdam (test-amsterdam)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Camera Preset</label>
                <select
                  value={cameraPreset}
                  onChange={(e) => setCameraPreset(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] text-xs"
                >
                  <option value="Sony A7R V / Canon R5 (Uncompressed RAW)">Sony A7R V / Canon R5 (Uncompressed RAW)</option>
                  <option value="Leica M11 (DNG Lossless)">Leica M11 (DNG Lossless)</option>
                  <option value="Fujifilm X-T5 / GFX (16-bit RAF)">Fujifilm X-T5 / GFX (16-bit RAF)</option>
                  <option value="Nikon Z8 / Z9 (High Efficiency RAW)">Nikon Z8 / Z9 (High Efficiency RAW)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[var(--ink-soft)]"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--ink)] text-white text-xs font-semibold"
                >
                  Genereer Magic Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
