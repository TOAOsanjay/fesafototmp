import React, { useState } from 'react';
import { EmailLogItem } from '../../types/manage';
import { initialEmailLogs } from '../../data/manageData';
import { Mail, CheckCircle2, RefreshCw, Send, Eye, ShieldCheck, Clock } from 'lucide-react';

interface EmailDispatcherViewProps {
  lang: 'nl' | 'en';
  onShowToast: (msg: string) => void;
}

export const EmailDispatcherView: React.FC<EmailDispatcherViewProps> = ({ lang, onShowToast }) => {
  const isNl = lang === 'nl';
  const [logs, setLogs] = useState<EmailLogItem[]>(initialEmailLogs);
  const [selectedTemplate, setSelectedTemplate] = useState<'tpl_welcome' | 'tpl_invoice' | 'tpl_magic' | 'tpl_zip_ready'>('tpl_welcome');
  const [testEmail, setTestEmail] = useState('sanjay@live.nl');

  const templates = {
    tpl_welcome: {
      name: 'Feest Welkomstmail & QR Tafelkaart',
      subject: 'fesafotos. : Welkom bij jouw feest & download de QR tafelkaarten',
      sampleBody: `Beste organisator,\n\nJe feestpagina staat live op: https://sanjayendewie.fesafotos.nl/\n\nIn de bijlage vind je de printklare PDF met jouw persoonlijke QR-tafelkaarten en poster. Print deze uit en zet ze op de tafels of bij de bar. Gasten hoeven geen app te downloaden!\n\nVeel feestplezier,\nHet team van fesafotos.`,
    },
    tpl_invoice: {
      name: 'Event / Event+ Factuur (Mollie webhook)',
      subject: 'fesafotos. : Factuur en bevestiging Event+ upgrade (Sanjay & Dewie)',
      sampleBody: `Beste Sanjay & Dewie,\n\nBedankt voor jullie upgrade naar Event+ (EUR 69,00 incl. 21% btw). Mollie referentie: tr_9PQ6nGBbDvETPvKPJcSYJ.\n\nJullie voordelen zijn per direct geactiveerd:\n- 24 maanden veilige foto-opslag\n- Live Beamer Slideshow modus\n- Directe fotograaf originals koppeling\n\nMet vriendelijke groet,\nfesafotos.nl`,
    },
    tpl_magic: {
      name: 'Fotograaf Magic Link Login',
      subject: 'fesafotos. : Jouw directe uploadlink voor bruiloft Sanjay & Dewie',
      sampleBody: `Beste fotograaf,\n\nDe organisator heeft je uitgenodigd om je foto's rechtstreeks in originele kwaliteit te uploaden:\n\nhttps://fesafotos.nl/pro/upload?token=ff_photo_live_79a29e190f8b1a8d\n\nJe kunt ongecomprimeerde RAW of high-res JPEGs tot 50 MB per bestand direct via de browser slepen.`,
    },
    tpl_zip_ready: {
      name: 'ZIP Download Archief Klaar Notificatie',
      subject: 'fesafotos. : Jouw complete feestarchief staat klaar om te downloaden',
      sampleBody: `Beste gastheer,\n\nGoed nieuws: het complete archief met alle 248 foto's en video's in originele resolutie is samengevoegd tot 1 ZIP bestand (1.42 GB).\n\nDownloadlink: https://dl.fesafotos.nl/archives/sanjayendewie-full-archive.zip\nDeze link blijft 30 dagen geldig.`,
    },
  };

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast(`Test e-mail (${templates[selectedTemplate].name}) verzonden naar ${testEmail}.`);
  };

  const handleRetryEmail = (logId: string) => {
    setLogs((prev) =>
      prev.map((l) => (l.id === logId ? { ...l, status: 'delivered' } : l))
    );
    onShowToast(`E-mail ${logId} opnieuw verwerkt via Stalwart k3s mail server.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-emerald-50 text-[var(--success)] border border-emerald-200 uppercase">
            Open Source Stalwart Mail Server
          </span>
          <span className="text-xs text-[var(--ink-soft)] font-mono-code">
            k3s pod stalwart-mail-server-0 on 188.245.82.11
          </span>
        </div>
        <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
          {isNl ? 'Stalwart Mail Server & Transactionele Sjablonen' : 'Stalwart Mail Server & Transactional Templates'}
        </h2>
        <p className="text-xs text-[var(--ink-soft)] mt-0.5">
          {isNl
            ? 'Self-hosted open-source e-mailserver op Kubernetes met directe PTR reverse DNS op Hetzner IP, Ed25519 DKIM en SPF.'
            : 'Self-hosted open-source mail server on Kubernetes with PTR reverse DNS on Hetzner IP, Ed25519 DKIM and SPF.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-mono-code uppercase">Wachtrij Status</div>
          <div className="text-2xl font-display font-bold text-[var(--success)] mt-0.5">0 in wacht</div>
          <div className="text-[10px] font-mono-code text-[var(--ink-soft)] mt-0.5">Stalwart outbound queue leeg</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-mono-code uppercase">Hetzner PTR Reverse DNS</div>
          <div className="text-2xl font-display font-bold text-[var(--success)] mt-0.5">Geldig (10/10)</div>
          <div className="text-[10px] font-mono-code text-[var(--ink-soft)] mt-0.5">mail.fesafotos.nl → 188.245.82.11</div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs">
          <div className="text-[11px] text-[var(--ink-soft)] font-mono-code uppercase">SPF, DKIM & DMARC</div>
          <div className="text-2xl font-display font-bold text-[var(--success)] mt-0.5">Ed25519 + RSA</div>
          <div className="text-[10px] font-mono-code text-[var(--ink-soft)] mt-0.5">DMARC policy p=reject actief</div>
        </div>
      </div>

      {/* Interactive Template Preview & Test Dispatcher */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border)] gap-2">
          <div>
            <h3 className="font-display font-bold text-base text-[var(--ink)]">
              {isNl ? 'Interactieve Sjabloon Inspectie' : 'Template Preview & Test Send'}
            </h3>
            <p className="text-xs text-[var(--ink-soft)]">
              Bekijk hoe transactionele e-mails eruitzien voor gastheren en fotografen.
            </p>
          </div>

          {/* Template pills */}
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(templates) as Array<keyof typeof templates>).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedTemplate(key)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono-code transition-colors ${
                  selectedTemplate === key
                    ? 'bg-[var(--accent)] text-white font-bold shadow-2xs'
                    : 'bg-[var(--paper)] text-[var(--ink-soft)] hover:text-[var(--ink)] border border-[var(--border)]'
                }`}
              >
                {templates[key].name.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Template Subject & Preview */}
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--border)]">
            <span className="font-semibold text-[var(--ink-soft)] font-mono-code">Onderwerp: </span>
            <span className="font-bold text-[var(--ink)]">{templates[selectedTemplate].subject}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--paper-2)] border border-[var(--border)] font-mono-code text-[11px] text-[var(--ink)] whitespace-pre-wrap leading-relaxed">
            {templates[selectedTemplate].sampleBody}
          </div>

          {/* Test Send Form */}
          <form onSubmit={handleSendTest} className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Test e-mailadres..."
              className="px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--paper)] text-xs text-[var(--ink)] font-mono-code flex-1"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[var(--ink)] text-white hover:bg-[#292524] text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Send size={13} />
              <span>Verstuur testsjabloon</span>
            </button>
          </form>
        </div>
      </div>

      {/* Recent Dispatches Log Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--paper-2)] flex items-center justify-between">
          <span className="font-display font-bold text-sm text-[var(--ink)]">
            Recente Afleveringen & Logboek
          </span>
          <span className="text-[11px] font-mono-code text-[var(--ink-soft)]">
            Laatste 4 verzonden berichten
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--paper)] text-[var(--ink-soft)] font-mono-code uppercase text-[10px]">
              <th className="py-2.5 px-4">Log ID & Tijd</th>
              <th className="py-2.5 px-4">Ontvanger</th>
              <th className="py-2.5 px-4">Onderwerp</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4 text-right">Geopend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] font-mono-code text-[11px]">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-[var(--paper)]">
                <td className="py-3 px-4 text-[var(--ink-soft)] whitespace-nowrap">
                  <div className="font-bold text-[var(--ink)]">{log.id}</div>
                  <div>{log.sentAt}</div>
                </td>
                <td className="py-3 px-4 font-semibold text-[var(--ink)] whitespace-nowrap">
                  {log.recipient}
                </td>
                <td className="py-3 px-4 text-[var(--ink)] truncate max-w-xs">
                  {log.subject}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[var(--success)] border border-emerald-200">
                    {log.status === 'delivered' ? 'Afgeleverd' : log.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-[var(--ink-soft)] tabular-nums">
                  {log.opensCount}x
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
