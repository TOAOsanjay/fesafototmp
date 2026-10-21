import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface TypedConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmWord: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TypedConfirmModal: React.FC<TypedConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmWord,
  onConfirm,
  onCancel,
}) => {
  const [typedValue, setTypedValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTypedValue('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isMatched = typedValue.trim().toUpperCase() === confirmWord.trim().toUpperCase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMatched) {
      onConfirm();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[var(--surface)] border-2 border-red-200 rounded-3xl shadow-2xl p-6 text-[var(--ink)] space-y-4"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]">
          <div className="p-2 rounded-xl bg-red-100 text-[var(--danger)]">
            <AlertTriangle size={18} strokeWidth={2} />
          </div>
          <div>
            <div className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[var(--danger)]">
              Bevestig Destructieve Actie
            </div>
            <h3 className="font-display font-bold text-base text-[var(--ink)]">
              {title}
            </h3>
          </div>
        </div>

        <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
          {description}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div>
            <label className="block text-[11px] font-mono-code text-[var(--ink-soft)] mb-1">
              Typ <span className="font-bold text-[var(--danger)]">{confirmWord}</span> om te bevestigen:
            </label>
            <input
              type="text"
              autoFocus
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
              placeholder={confirmWord}
              className="w-full px-3.5 py-2 text-xs font-mono-code rounded-xl border border-[var(--border)] bg-[var(--paper)] focus:outline-none focus:border-[var(--danger)] uppercase font-bold text-[var(--ink)]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)] rounded-xl"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={!isMatched}
              className="px-4 py-2 text-xs font-semibold text-white bg-[var(--danger)] hover:opacity-90 rounded-xl transition-all disabled:opacity-40 shadow-xs"
            >
              Definitief uitvoeren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
