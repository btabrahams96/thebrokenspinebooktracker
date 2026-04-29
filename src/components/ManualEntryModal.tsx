import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import { looksLikeIsbn } from '../lib/lookup';
import type { ItemType } from '../types';
import { useToast } from './Toast';

type Props = {
  open: boolean;
  initialIsbn?: string;
  onClose: () => void;
  onSaved: () => void;
};

const TYPES: { value: ItemType; label: string }[] = [
  { value: 'book', label: 'Book' },
  { value: 'manga', label: 'Manga' },
  { value: 'comic', label: 'Comic' }
];

export default function ManualEntryModal({ open, initialIsbn, onClose, onSaved }: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [type, setType] = useState<ItemType>('book');
  const [series, setSeries] = useState('');
  const [volume, setVolume] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [isbn, setIsbn] = useState(initialIsbn ?? '');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setIsbn(initialIsbn ?? '');
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [open, initialIsbn]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (status: 'owned' | 'wishlist') => {
    const t = title.trim();
    if (!t) {
      titleRef.current?.focus();
      return;
    }
    setBusy(true);
    try {
      await api.createItem({
        title: t,
        creator: creator.trim() || undefined,
        cover_url: coverUrl.trim() || undefined,
        type,
        isbn: isbn.trim() || undefined,
        series: series.trim() || undefined,
        volume: volume ? Number(volume) : undefined,
        source: 'manual',
        status
      });
      toast.show(`${t} · saved to ${status === 'owned' ? 'Library' : 'Wishlist'}`, 'success');
      onSaved();
      onClose();
      reset();
    } catch (e) {
      toast.show(e instanceof Error ? `Couldn't save: ${e.message}` : 'Save failed.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setTitle('');
    setCreator('');
    setType('book');
    setSeries('');
    setVolume('');
    setCoverUrl('');
    setIsbn('');
  };

  const isbnValid = isbn ? looksLikeIsbn(isbn) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-ink/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:w-[480px] max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl bg-paper-light border border-line shadow-xl p-6"
      >
        <div className="flex items-baseline justify-between">
          <h2 className="display text-xl text-ink">Add manually</h2>
          <button onClick={onClose} className="text-sepia hover:text-ink text-xl leading-none" aria-label="Close">
            ×
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Title" required>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              autoCapitalize="words"
            />
          </Field>

          <Field label="Creator">
            <input
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              placeholder="Author / artist"
              className="input"
            />
          </Field>

          <Field label="Type">
            <div className="flex gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium border transition-colors ${
                    type === t.value
                      ? 'bg-burgundy text-paper-light border-burgundy'
                      : 'bg-paper-deep text-ink border-line'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-[1fr,80px] gap-3">
            <Field label="Series">
              <input
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Volume">
              <input
                value={volume}
                onChange={(e) => setVolume(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                className="input"
              />
            </Field>
          </div>

          <Field label="Cover URL">
            <input
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://…"
              className="input"
              inputMode="url"
            />
          </Field>

          <Field
            label="ISBN"
            hint={
              isbn
                ? isbnValid
                  ? <span className="text-forest">Looks valid ✓</span>
                  : <span className="text-sepia">Doesn't look like an ISBN</span>
                : null
            }
          >
            <input
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="input font-mono"
              inputMode="numeric"
            />
          </Field>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => void submit('owned')}
            disabled={busy || !title.trim()}
            className="flex-1 rounded-md bg-burgundy px-3 py-2 text-sm font-semibold text-paper-light disabled:opacity-60"
          >
            Add to Library
          </button>
          <button
            type="button"
            onClick={() => void submit('wishlist')}
            disabled={busy || !title.trim()}
            className="flex-1 rounded-md border border-line bg-paper-deep px-3 py-2 text-sm font-semibold text-ink disabled:opacity-60"
          >
            Wishlist
          </button>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: #FAF3E3;
          border: 1px solid rgba(26, 20, 16, 0.12);
          border-radius: 6px;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          color: #1A1410;
          outline: none;
        }
        .input:focus { border-color: #6B1F2E; }
      `}</style>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children
}: {
  label: string;
  hint?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-widest text-sepia">
          {label}
          {required && <span className="text-burgundy"> *</span>}
        </span>
        {hint && <span className="text-[11px] italic">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
