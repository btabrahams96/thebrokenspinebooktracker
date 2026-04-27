import { useCallback, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Scanner from '../components/Scanner';
import SearchBar from '../components/SearchBar';
import ResultPreview from '../components/ResultPreview';
import { lookupByIsbn, searchByText, isFailure, type LookupResult } from '../lib/lookup';
import type { ItemType } from '../types';

type Mode = 'scan' | 'search';

const TYPES: { value: ItemType; label: string }[] = [
  { value: 'book', label: 'Books' },
  { value: 'manga', label: 'Manga' },
  { value: 'comic', label: 'Comics' }
];

export default function Add() {
  const [mode, setMode] = useState<Mode>('scan');
  const [type, setType] = useState<ItemType | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [results, setResults] = useState<LookupResult[]>([]);
  const [notFound, setNotFound] = useState<{ isbn?: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleIsbn = useCallback(
    async (isbn: string) => {
      if (busy) return;
      setBusy(true);
      setNotFound(null);
      setResult(null);
      setResults([]);
      try {
        const out = await lookupByIsbn(isbn, type);
        if (isFailure(out)) setNotFound({ isbn: out.isbn });
        else setResult(out);
      } finally {
        setBusy(false);
      }
    },
    [busy, type]
  );

  const handleSearch = useCallback(
    async (query: string) => {
      setBusy(true);
      setNotFound(null);
      setResult(null);
      try {
        const list = await searchByText(query, type);
        if (list.length === 0) setNotFound({});
        else if (list.length === 1) setResult(list[0]);
        else setResults(list);
      } finally {
        setBusy(false);
      }
    },
    [type]
  );

  const onAdd = (r: LookupResult, status: 'owned' | 'wishlist') => {
    // Phase 03 wires this to the Worker.
    setToast(`${r.title} · saved to ${status === 'owned' ? 'Library' : 'Wishlist'} (stub)`);
    setResult(null);
    setResults([]);
    setTimeout(() => setToast(null), 2400);
  };

  return (
    <div className="px-5 pt-8 md:px-12 md:pt-12 pb-12">
      <PageHeader eyebrow="§ 03" title="Add" subtitle="Aim at the barcode, or search." />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-md border border-line bg-paper-deep p-1">
          <button
            onClick={() => setMode('scan')}
            className={`px-3 py-1.5 text-xs font-semibold rounded ${
              mode === 'scan' ? 'bg-burgundy text-paper-light' : 'text-ink'
            }`}
          >
            Scan
          </button>
          <button
            onClick={() => setMode('search')}
            className={`px-3 py-1.5 text-xs font-semibold rounded ${
              mode === 'search' ? 'bg-burgundy text-paper-light' : 'text-ink'
            }`}
          >
            Search
          </button>
        </div>
        <div className="inline-flex flex-wrap gap-1">
          <TypeChip active={type === undefined} onClick={() => setType(undefined)} label="Any" />
          {TYPES.map((t) => (
            <TypeChip
              key={t.value}
              active={type === t.value}
              onClick={() => setType(t.value)}
              label={t.label}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {mode === 'scan' ? (
          <Scanner paused={!!result || !!results.length || busy} onDetected={handleIsbn} />
        ) : (
          <SearchBar onSubmit={handleSearch} />
        )}

        {busy && <p className="text-sepia text-sm italic">Looking that up…</p>}

        {result && (
          <ResultPreview
            result={result}
            onAdd={(s) => onAdd(result, s)}
            onDismiss={() => setResult(null)}
          />
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-sepia">
              {results.length} matches
            </p>
            {results.map((r, i) => (
              <ResultPreview
                key={`${r.source}-${r.external_id ?? r.isbn ?? i}`}
                result={r}
                onAdd={(s) => onAdd(r, s)}
              />
            ))}
          </div>
        )}

        {notFound && (
          <div className="rounded-2xl border border-line bg-paper-light p-5 max-w-md">
            <p className="text-ink">
              {notFound.isbn
                ? `Couldn't find ${notFound.isbn}.`
                : 'Nothing matched that search.'}
            </p>
            <p className="mt-1 text-sm italic text-sepia">
              Manual entry lands in Phase 03 — for now, try a different search or angle.
            </p>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-ink px-4 py-2 text-sm text-paper-light shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function TypeChip({
  active,
  onClick,
  label
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'rounded-full px-3 py-1 text-xs font-medium border',
        active
          ? 'bg-forest text-paper-light border-forest'
          : 'bg-paper-deep text-ink border-line'
      ].join(' ')}
    >
      {label}
    </button>
  );
}
