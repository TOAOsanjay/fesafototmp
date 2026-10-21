import React, { useState } from 'react';
import { Send, Bot, Sparkles, BookOpen } from 'lucide-react';

interface AssistantViewProps {
  lang: 'nl' | 'en';
}

interface ChatItem {
  id: string;
  sender: 'operator' | 'assistant';
  text: string;
  citations?: string[];
  timestamp: string;
}

export const AssistantView: React.FC<AssistantViewProps> = ({ lang }) => {
  const isNl = lang === 'nl';
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: isNl
        ? 'Hallo Sanjay. Ik ben je operationele assistent voor fesafotos.nl. Vraag me gerust naar pod status, mislukte transcodes, openstaande orders of tenant limieten.'
        : 'Hello Sanjay. I am your operations assistant for fesafotos.nl. Ask me about pod health, failed transcoding jobs, open orders, or tenant quotas.',
      citations: ['cluster/node-ams-01..03', 'database/tenants'],
      timestamp: '22:15',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: ChatItem = {
      id: `usr-${Date.now()}`,
      sender: 'operator',
      text: inputVal.trim(),
      timestamp: '22:20',
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputVal.toLowerCase();
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = isNl
        ? 'Alle actieve systemen functioneren normaal. De 3 cluster nodes draaien stabiel en er zijn 41 actieve pods.'
        : 'All active systems are functioning normally. 3 cluster nodes are healthy and 41 pods are running.';
      let sources = ['kubernetes/status', 'metrics/v1'];

      if (query.includes('sanjay') || query.includes('dewie')) {
        reply = isNl
          ? 'Het feest "Sanjay & Dewie" staat gepland voor vrijdag 30 oktober 2026. Ze hebben het Event+ pakket (EUR 69 betaald, Mollie tr_9PQ6nGBbDvETPvKPJcSYJ). Momenteel 9 uploads, 2 videos en 24 gasten.'
          : 'The celebration "Sanjay & Dewie" is scheduled for Friday, 30 October 2026 on the Event+ plan (EUR 69 paid, ref tr_9PQ6nGBbDvETPvKPJcSYJ). Currently 9 uploads, 2 videos, and 24 guests.';
        sources = ['tenants/sanjayendewie', 'orders/ord-10492'];
      } else if (query.includes('vastgelopen') || query.includes('stuck') || query.includes('mientje')) {
        reply = isNl
          ? 'Er is 1 vastgelopen upload bij Mientjes 65: VID_20261020_003.mp4 (84.2 MB). Transcode worker node-ams-02 gaf een time-out bij frame 4120. Je kunt deze met 1 klik herstarten in het Wachtrijtaken scherm.'
          : 'There is 1 stuck upload for Mientjes 65: VID_20261020_003.mp4 (84.2 MB). Transcode worker node-ams-02 encountered a timeout at frame 4120. You can requeue it with one click.';
        sources = ['queue/job-9841', 'storage/s3-staging'];
      } else if (query.includes('omzet') || query.includes('geld') || query.includes('order')) {
        reply = isNl
          ? 'De totale omzet voor oktober staat op EUR 784,00 over 12 bestellingen. Er staat 1 openstaande iDEAL order van EUR 49,00 voor Mientjes 65 (referentie tr_K7Lm28xZb90wP).'
          : 'Total revenue for October is EUR 784.00 across 12 orders. There is 1 open iDEAL payment of EUR 49.00 for Mientjes 65.';
        sources = ['mollie/settlements', 'orders/ord-10493'];
      }

      const botMsg: ChatItem = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        citations: sources,
        timestamp: '22:20',
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border)]">
        <h2 className="font-display font-extrabold text-2xl text-[var(--ink)] tracking-tight">
          {isNl ? 'Ops Assistent' : 'Operations Assistant'}
        </h2>
        <p className="text-xs text-[var(--ink-soft)] mt-0.5">
          {isNl
            ? 'Stel gerichte operationele vragen over data, jobs, errors of omzet. Bronvermeldingen blijven netjes buiten de hoofdtekst.'
            : 'Ask operational questions about system state, jobs, errors, or revenue. Sources are kept strictly separate from answer prose.'}
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xs flex flex-col h-[520px]">
        {/* Chat Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'operator' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-2 leading-relaxed ${
                  m.sender === 'operator'
                    ? 'bg-[var(--ink)] text-[var(--paper)] rounded-br-xs'
                    : 'bg-[var(--paper-2)] border border-[var(--border)] text-[var(--ink)] rounded-bl-xs shadow-2xs'
                }`}
              >
                <p className="text-xs leading-relaxed">{m.text}</p>

                {/* Citation block strictly separated from answer prose */}
                {m.citations && m.citations.length > 0 && (
                  <div className="pt-2 border-t border-[var(--border)] flex items-center gap-1.5 text-[10px] font-mono-code text-[var(--ink-soft)]">
                    <BookOpen size={11} className="text-[var(--accent)]" />
                    <span className="font-semibold text-[var(--ink)]">Bronnen:</span>
                    <span>{m.citations.join(', ')}</span>
                  </div>
                )}

                <div
                  className={`text-[10px] font-mono-code text-right ${
                    m.sender === 'operator' ? 'text-white/60' : 'text-[var(--ink-soft)]'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Assistant Working State */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[var(--paper-2)] border border-[var(--border)] rounded-2xl rounded-bl-xs p-3 text-xs text-[var(--ink-soft)] shadow-2xs flex items-center gap-2 font-mono-code">
                <span className="font-bold text-[var(--ink)]">
                  {isNl ? 'Sanjay\'s Ops-Assistent raadpleegt database...' : 'Sanjay\'s Ops Assistant querying telemetry...'}
                </span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '0.3s' }} />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-[var(--surface)] border-t border-[var(--border)] flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={isNl ? 'Vraag bijvoorbeeld: Wat is de status van Sanjay & Dewie?' : 'Ask a question...'}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] text-[var(--ink)] font-medium"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[var(--accent)] hover:opacity-90 rounded-xl transition-all shadow-xs disabled:opacity-40 flex items-center gap-1.5"
          >
            <span>Verstuur</span>
            <Send size={13} strokeWidth={1.5} />
          </button>
        </form>
      </div>
    </div>
  );
};
