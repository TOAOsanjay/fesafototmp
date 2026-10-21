import React, { useState, useEffect } from 'react';
import { GuestbookEntry, ChatMessage, Language } from '../../types/party';
import { initialGuestbookEntries } from '../../data/partyData';

interface GuestbookChatSectionProps {
  lang: Language;
}

export const GuestbookChatSection: React.FC<GuestbookChatSectionProps> = ({ lang }) => {
  const isNl = lang === 'nl';
  const [activeTab, setActiveTab] = useState<'guestbook' | 'chat'>('guestbook');

  // Guestbook state
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialGuestbookEntries);
  const [authorName, setAuthorName] = useState('');
  const [textContent, setTextContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  // Assistant Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'c1',
      sender: 'assistant',
      text: isNl
        ? 'Hoi! Ik ben Dewie\'s feestassistent. Vraag me gerust alles over de route, tijden, parkeren of het uploaden van foto\'s!'
        : 'Hi! I am Dewie\'s party assistant. Feel free to ask me anything about directions, timings, parking or photo uploads!',
      timestamp: '20:00',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);

  // Voice note recording countdown simulator
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordSeconds((s) => {
          if (s >= 30) {
            handleStopVoiceRecord();
            return 30;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleStartVoiceRecord = () => {
    setRecordSeconds(0);
    setIsRecording(true);
  };

  const handleStopVoiceRecord = () => {
    setIsRecording(false);
    const newEntry: GuestbookEntry = {
      id: `voice-${Date.now()}`,
      author: authorName.trim() || (isNl ? 'Feestganger' : 'Party guest'),
      type: 'voice',
      content: isNl
        ? `Spraakbericht (${recordSeconds}s): "Wat een fantastisch feest voor Sanjay en Dewie!"`
        : `Voice message (${recordSeconds}s): "What a fantastic celebration for Sanjay and Dewie!"`,
      timestamp: isNl ? 'Zojuist' : 'Just now',
      audioDuration: `0:${recordSeconds < 10 ? '0' : ''}${recordSeconds}`,
    };
    setEntries([newEntry, ...entries]);
    setRecordSeconds(0);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim()) return;

    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      author: authorName.trim() || (isNl ? 'Feestganger' : 'Party guest'),
      type: 'text',
      content: textContent.trim(),
      timestamp: isNl ? 'Zojuist' : 'Just now',
    };

    setEntries([newEntry, ...entries]);
    setTextContent('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: chatInput.trim(),
      timestamp: isNl ? 'Zojuist' : 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = chatInput.toLowerCase();
    setChatInput('');
    setIsAssistantTyping(true);

    setTimeout(() => {
      let replyText = isNl
        ? 'Wat een leuke vraag! Geniet van ieder moment met Sanjay & Dewie. Je kunt foto\'s toevoegen via de grote oranje knop!'
        : 'Great question! Enjoy every moment with Sanjay & Dewie. You can upload photos using the big orange button!';

      if (query.includes('parker') || query.includes('park')) {
        replyText = isNl
          ? 'Parkeren kan gratis op het terrein van Paviljoen Puur. Volg de bordjes feestgangers bij de oprijlaan.'
          : 'Free parking is available right at Paviljoen Puur. Follow the signs at the driveway.';
      } else if (query.includes('taart') || query.includes('cake') || query.includes('tijd')) {
        replyText = isNl
          ? 'De bruidstaart is zojuist aangesneden! Om 23:45 verzamelen we buiten voor de feestelijke sterretjes!'
          : 'The cake was just cut! At 23:45 we gather outside for sparklers!';
      } else if (query.includes('beamer') || query.includes('scherm')) {
        replyText = isNl
          ? 'Foto\'s die je hier uploadt worden direct doorgestuurd naar het beamerscherm in de feestzaal!'
          : 'Photos you upload here are streamed live to the venue projector wall!';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: isNl ? 'Zojuist' : 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsAssistantTyping(false);
    }, 1100);
  };

  return (
    <section className="py-12 sm:py-16 border-b border-[var(--border)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Toggle between Guestbook & Assistant Chat */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[var(--border)]">
          <div>
            <div className="text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
              {isNl ? 'Interactief : Woorden & Vragen' : 'Interactive : Wishes & Assistance'}
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--ink)] tracking-tight">
              {activeTab === 'guestbook'
                ? (isNl ? 'Gastenboek & Gelukswensen' : 'Guestbook & Best Wishes')
                : (isNl ? 'Feestassistent voor Sanjay & Dewie' : 'Party Assistant for Sanjay & Dewie')}
            </h2>
          </div>

          <div className="flex items-center p-1 bg-[var(--paper-2)] border border-[var(--border)] rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('guestbook')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'guestbook'
                  ? 'bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-2xs'
                  : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              📖 {isNl ? 'Gastenboek' : 'Guestbook'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'chat'
                  ? 'bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-2xs'
                  : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              💬 {isNl ? 'Chat' : 'Chat'}
            </button>
          </div>
        </div>

        {/* TAB 1: GUESTBOOK */}
        {activeTab === 'guestbook' && (
          <div className="space-y-6">
            {/* Composer Card */}
            <div className="bg-[var(--surface)] rounded-3xl p-6 border border-[var(--border)] shadow-xs">
              <h3 className="font-display font-bold text-base text-[var(--ink)] mb-3">
                {isNl ? 'Laat een herinnering of wens achter' : 'Leave a memory or wish'}
              </h3>

              <div className="mb-3">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder={isNl ? 'Jouw naam (bijv. Sanne & Lucas)' : 'Your name'}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] text-[var(--ink)]"
                />
              </div>

              {/* Text Form */}
              <form onSubmit={handleSendText} className="space-y-3">
                <textarea
                  rows={2}
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder={
                    isNl
                      ? 'Schrijf een lieve felicitatie voor Sanjay & Dewie...'
                      : 'Write a warm message for Sanjay & Dewie...'
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] text-[var(--ink)] leading-relaxed"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {/* Voice Note Simulation Composer */}
                  <div className="flex items-center gap-2">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={handleStartVoiceRecord}
                        className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--paper)] hover:bg-[var(--paper-2)] text-xs text-[var(--ink)] font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <span>🎙️</span>
                        <span>{isNl ? 'Spreek bericht in' : 'Record voice note'}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono-code animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                        <span>
                          {isNl ? 'Opname:' : 'Recording:'} 0:{recordSeconds < 10 ? '0' : ''}{recordSeconds} (max 30s)
                        </span>
                        <button
                          type="button"
                          onClick={handleStopVoiceRecord}
                          className="px-2 py-0.5 rounded bg-red-600 text-white font-bold ml-1"
                        >
                          {isNl ? 'Plaats' : 'Post'}
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!textContent.trim()}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[var(--accent)] hover:opacity-90 rounded-xl transition-all shadow-xs disabled:opacity-40"
                  >
                    {isNl ? 'Plaats in gastenboek' : 'Post to guestbook'}
                  </button>
                </div>
              </form>
            </div>

            {/* Guestbook Entries Stream */}
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--ink)] flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-[var(--ink)] font-display">
                      {entry.author}
                    </span>
                    <span className="text-[11px] font-mono-code text-[var(--ink-soft)]">
                      {entry.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
                    {entry.content}
                  </p>

                  {entry.type === 'voice' && (
                    <div className="mt-2.5 pt-2 border-t border-[var(--border)] flex items-center gap-2 text-[11px] font-mono-code text-[var(--accent)]">
                      <span>▶️</span>
                      <span>{isNl ? 'Beluister spraakbericht' : 'Play voice message'} ({entry.audioDuration})</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ASSISTANT CHAT */}
        {activeTab === 'chat' && (
          <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-xs flex flex-col h-[440px]">
            {/* Chat Header */}
            <div className="px-5 py-3.5 border-b border-[var(--border)] bg-[var(--paper-2)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xs font-bold">
                  FF
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--ink)] font-display">
                    {isNl ? 'Dewie\'s Feestassistent' : 'Dewie\'s Party Assistant'}
                  </div>
                  <div className="text-[10px] text-[var(--success)] font-medium">
                    ● {isNl ? 'Online voor gasten' : 'Online for guests'}
                  </div>
                </div>
              </div>

              {/* Sample Quick Prompts */}
              <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setChatInput(isNl ? 'Waar kan ik parkeren?' : 'Where can I park?')}
                  className="px-2 py-0.5 rounded bg-[var(--paper)] border border-[var(--border)] hover:bg-[var(--border)] text-[var(--ink-soft)] transition-colors"
                >
                  🅿️ {isNl ? 'Parkeren' : 'Parking'}
                </button>
                <button
                  type="button"
                  onClick={() => setChatInput(isNl ? 'Hoe laat is de taart?' : 'When is cake?')}
                  className="px-2 py-0.5 rounded bg-[var(--paper)] border border-[var(--border)] hover:bg-[var(--border)] text-[var(--ink-soft)] transition-colors"
                >
                  🎂 {isNl ? 'Taart' : 'Cake'}
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[var(--paper)]/40 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[var(--ink)] text-[var(--paper)] rounded-br-xs'
                        : 'bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)] rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    <p>{m.text}</p>
                    <div
                      className={`text-[10px] font-mono-code mt-1 text-right ${
                        m.sender === 'user' ? 'text-white/60' : 'text-[var(--ink-soft)]'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {/* Friendly Typing State Naming Assistant */}
              {isAssistantTyping && (
                <div className="flex justify-start">
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl rounded-bl-xs p-3 text-xs text-[var(--ink-soft)] shadow-2xs flex items-center gap-2">
                    <span className="font-semibold text-[var(--ink)]">
                      {isNl ? 'Dewie\'s Feestassistent typt' : 'Dewie\'s Party Assistant is typing'}
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

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChat} className="p-3 bg-[var(--surface)] border-t border-[var(--border)] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={isNl ? 'Stel een vraag aan de assistent...' : 'Ask the party assistant...'}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--accent)] text-[var(--ink)]"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-[var(--accent)] hover:opacity-90 rounded-xl transition-all shadow-xs disabled:opacity-40"
              >
                {isNl ? 'Verstuur' : 'Send'}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
