import { useCallback, useState } from 'react';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import Scanner from '../components/Scanner';
import SearchBar from '../components/SearchBar';
import ResultPreview from '../components/ResultPreview';
import { lookupByIsbn, searchByText, isFailure, type LookupResult } from '../lib/lookup';
import { api } from '../lib/api';
import { useToast } from '../components/Toast';
import ManualEntryModal from '../components/ManualEntryModal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
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
  const [manualOpen, setManualOpen] = useState(false);
  const toast = useToast();
  useDocumentTitle('The Broken Spine — Add');

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

  const onAdd = async (r: LookupResult, status: 'owned' | 'wishlist') => {
    setBusy(true);
    try {
      const inferredType: ItemType = type ?? (r.source === 'anilist' ? 'manga' : 'book');
      await api.createItem({
        title: r.title,
        creator: r.creator,
        cover_url: r.cover_url,
        type: inferredType,
        isbn: r.isbn,
        external_id: r.external_id,
        source: r.source,
        status
      });
      toast.show(
        `${r.title} · saved to ${status === 'owned' ? 'Library' : 'Wishlist'}`,
        'success'
      );
      setResult(null);
      setResults([]);
    } catch (e) {
      toast.show(e instanceof Error ? `Couldn't save: ${e.message}` : 'Save failed.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page>
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
            pending={busy}
            onAdd={(s) => void onAdd(result, s)}
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
                pending={busy}
                onAdd={(s) => void onAdd(r, s)}
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
              Add it manually instead.
            </p>
            <button
              onClick={() => setManualOpen(true)}
              className="mt-3 rounded-md bg-burgundy px-3 py-1.5 text-xs font-semibold text-paper-light"
            >
              Add manually
            </button>
          </div>
        )}
      </div>

      <ManualEntryModal
        open={manualOpen}
        initialIsbn={notFound?.isbn}
        onClose={() => setManualOpen(false)}
        onSaved={() => setNotFound(null)}
      />
    </Page>
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
