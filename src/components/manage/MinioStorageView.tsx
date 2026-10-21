import React, { useState } from 'react';
import { initialMinioBuckets } from '../../data/manageData';
import { MinioBucketInfo } from '../../types/manage';
import { HardDrive, ShieldCheck, Lock, Database, Copy, Check, RefreshCw, Plus, Folder, FileArchive } from 'lucide-react';

interface MinioStorageViewProps {
  lang: 'nl' | 'en';
  onShowToast: (msg: string) => void;
}

export const MinioStorageView: React.FC<MinioStorageViewProps> = ({ lang, onShowToast }) => {
  const isNl = lang === 'nl';
  const [buckets, setBuckets] = useState<MinioBucketInfo[]>(initialMinioBuckets);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleGeneratePresigned = (bucketName: string) => {
    const url = `https://s3.fesafotos.nl/${bucketName}/uploads/test_upload_${Date.now()}.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=900`;
    setPresignedUrl(url);
    onShowToast(`Presigned S3 upload URL gegenereerd voor ${bucketName} (15 min geldig).`);
  };

  const handleCopyPresigned = () => {
    if (!presignedUrl) return;
    navigator.clipboard?.writeText(presignedUrl);
    setCopiedUrl(true);
    onShowToast('Presigned MinIO URL gekopieerd!');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border)] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-amber-50 text-[var(--accent)] border border-amber-200 uppercase">
              Open Source S3
            </span>
            <span className="text-xs text-[var(--ink-soft)] font-mono-code">
              MinIO Distributed on Hetzner CSI
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight mt-1">
            {isNl ? 'MinIO Self-Hosted S3 Object Storage' : 'MinIO Self-Hosted S3 Storage'}
          </h2>
          <p className="text-xs text-[var(--ink-soft)] mt-0.5">
            {isNl
              ? 'Volledig in-cluster objectopslag draaiend op Hetzner CSI Persistent Volumes. Geen cloud vendor lock-in of egress kosten.'
              : 'In-cluster object storage on Hetzner CSI Persistent Volumes with zero cloud vendor lock-in and zero egress fees.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleGeneratePresigned('fesafotos-media-prod')}
          className="px-3.5 py-2 rounded-xl bg-[var(--ink)] text-white hover:bg-[#292524] text-xs font-semibold flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>{isNl ? 'Genereer Presigned URL' : 'Generate Presigned URL'}</span>
        </button>
      </div>

      {/* Generated Presigned URL Card */}
      {presignedUrl && (
        <div className="p-4 rounded-3xl bg-[var(--surface)] border border-[var(--accent)] shadow-2xs space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[var(--ink)] font-mono-code">
              Gegenereerde MinIO S3 Presigned Upload URL (Directe Browser Passthrough)
            </span>
            <button
              type="button"
              onClick={handleCopyPresigned}
              className="px-3 py-1 rounded-xl bg-[var(--paper)] hover:bg-[var(--border)] border border-[var(--border)] font-mono-code text-[11px] font-semibold flex items-center gap-1.5"
            >
              {copiedUrl ? <Check size={12} className="text-[var(--success)]" /> : <Copy size={12} />}
              <span>{copiedUrl ? 'Gekopieerd!' : 'Kopieer URL'}</span>
            </button>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--paper-2)] border border-[var(--border)] font-mono-code text-[11px] text-[var(--ink-soft)] break-all select-all">
            {presignedUrl}
          </div>
        </div>
      )}

      {/* Stats KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-mono-code uppercase">Totale MinIO Opslag</div>
          <div className="text-2xl font-display font-bold text-[var(--ink)] mt-0.5">26,1 GB</div>
          <div className="text-[10px] font-mono-code text-[var(--ink-soft)] mt-0.5">Over 3 actieve buckets</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-mono-code uppercase">Egress Kosten</div>
          <div className="text-2xl font-display font-bold text-[var(--success)] mt-0.5">EUR 0,00</div>
          <div className="text-[10px] font-mono-code text-[var(--ink-soft)] mt-0.5">Inbegrepen in Hetzner Cloud vloot</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-mono-code uppercase">Versleuteling & KMS</div>
          <div className="text-2xl font-display font-bold text-[var(--success)] mt-0.5">AES-256</div>
          <div className="text-[10px] font-mono-code text-[var(--ink-soft)] mt-0.5">At-rest encryption via MinIO KES</div>
        </div>
      </div>

      {/* Buckets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {buckets.map((b) => (
          <div
            key={b.name}
            className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs space-y-4 hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Folder size={16} className="text-[var(--accent)]" />
                <span className="font-mono-code font-bold text-sm text-[var(--ink)] truncate max-w-[170px]">
                  {b.name}
                </span>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase bg-emerald-50 text-[var(--success)] border border-emerald-200">
                Gezond
              </span>
            </div>

            {/* Quota bar */}
            <div>
              <div className="flex justify-between font-mono-code text-[11px] text-[var(--ink-soft)] mb-1">
                <span>{b.sizeGb} GB verbruikt</span>
                <span>Quota: {b.quotaGb} GB</span>
              </div>
              <div className="w-full bg-[var(--paper)] rounded-full h-1.5 overflow-hidden border border-[var(--border)]">
                <div
                  className="h-1.5 rounded-full bg-[var(--accent)]"
                  style={{ width: `${(b.sizeGb / b.quotaGb) * 100}%` }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="p-3 rounded-2xl bg-[var(--paper)] border border-[var(--border)] space-y-1.5 font-mono-code text-[11px]">
              <div className="flex justify-between">
                <span className="text-[var(--ink-soft)]">Objecten:</span>
                <span className="font-bold text-[var(--ink)] tabular-nums">{b.objectsCount} bestanden</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-soft)]">Retentie:</span>
                <span className="text-[var(--ink)] truncate max-w-[150px]">{b.retentionPolicy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-soft)]">Hetzner CSI Pool:</span>
                <span className="text-[var(--ink-soft)]">{b.storagePool}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-[10px] font-mono-code text-[var(--ink-soft)] flex items-center gap-1">
                <Lock size={11} className="text-[var(--success)]" />
                <span>{b.encryption}</span>
              </span>

              <button
                type="button"
                onClick={() => handleGeneratePresigned(b.name)}
                className="text-[11px] font-mono-code text-[var(--accent)] hover:underline font-semibold"
              >
                Test Presigned
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
