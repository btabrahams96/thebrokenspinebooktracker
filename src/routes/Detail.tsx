import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Page from '../components/Page';
import { api } from '../lib/api';
import type { Item } from '../types';
import { STATUS_CLASSES, STATUS_LABEL, STATUS_ORDER } from '../lib/status';
import CoverPlaceholder from '../components/CoverPlaceholder';
import { ChevronLeftIcon, StarIcon } from '../components/icons';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback';
import { formatShortDate } from '../lib/dates';
import { useToast } from '../components/Toast';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

type SaveState = 'idle' | 'saving' | 'saved';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [noteState, setNoteState] = useState<SaveState>('idle');
  const toast = useToast();
  useDocumentTitle(item ? `${item.title} — The Broken Spine` : 'The Broken Spine');

  useEffect(() => {
    if (!id) return;
    void api
      .getItem(id)
      .then((r) => {
        setItem(r.item);
        setNotes(r.item.notes ?? '');
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load.'));
  }, [id]);

  const applyPatch = async <K extends keyof Item>(patch: Pick<Item, K>) => {
    if (!item || !id) return;
    const previous = item;
    setItem({ ...item, ...patch });
    try {
      const r = await api.patchItem(id, patch);
      setItem(r.item);
    } catch {
      setItem(previous);
      toast.show('Couldn\'t save. Try again.', 'error');
    }
  };

  const saveNotes = useDebouncedCallback(async (next: string) => {
    if (!id || !item) return;
    setNoteState('saving');
    try {
      const r = await api.patchItem(id, { notes: next || undefined });
      setItem(r.item);
      setNoteState('saved');
      setTimeout(() => setNoteState((s) => (s === 'saved' ? 'idle' : s)), 1500);
    } catch {
      setNoteState('idle');
      toast.show('Couldn\'t save notes. Try again.', 'error');
    }
  }, 800);

  useEffect(() => () => saveNotes.flush(), [saveNotes]);

  if (error)
    return (
      <Page>
        <BackLink />
        <p className="mt-6 text-burgundy">{error}</p>
      </Page>
    );
  if (!item || !id)
    return (
      <Page>
        <BackLink />
        <p className="mt-6 italic text-sepia">Loading…</p>
      </Page>
    );

  const remove = async () => {
    if (!confirm('Remove this from your library?')) return;
    await api.deleteItem(id);
    navigate(item.status === 'wishlist' ? '/wishlist' : '/library', { replace: true });
  };

  const cover = (
    <div className="relative aspect-[2/3] w-40 mx-auto md:w-full md:mx-0 rounded-lg overflow-hidden shadow-[0_12px_30px_-12px_rgba(26,20,16,0.35)]">
      {item.cover_url ? (
        <img src={item.cover_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <CoverPlaceholder item={item} size="lg" />
      )}
    </div>
  );

  const meta = (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[10px]">
      <dt className="text-sepia">Type</dt><dd className="text-ink">{item.type}</dd>
      {item.isbn && (<><dt className="text-sepia">ISBN</dt><dd className="text-ink">{item.isbn}</dd></>)}
      {item.series && (
        <>
          <dt className="text-sepia">Series</dt>
          <dd className="text-ink">{item.series}{item.volume ? ` · v${item.volume}` : ''}</dd>
        </>
      )}
      <dt className="text-sepia">Added</dt><dd className="text-ink">{formatShortDate(item.date_added)}</dd>
      {item.date_finished && (
        <>
          <dt className="text-sepia">Finished</dt>
          <dd className="text-ink">{formatShortDate(item.date_finished)}</dd>
        </>
      )}
      {item.source && (
        <>
          <dt className="text-sepia">Source</dt>
          <dd className="text-ink">{item.source.replace('_', ' ')}</dd>
        </>
      )}
    </dl>
  );

  return (
    <Page>
      <BackLink />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[160px_1fr] md:gap-8 lg:grid-cols-[200px_1fr] lg:gap-10">
        <div>
          {cover}
          <div className="hidden lg:block mt-5">{meta}</div>
        </div>

        <div className="min-w-0">
          <h1 className="display text-3xl md:text-4xl text-ink leading-[1.05]">{item.title}</h1>
          {item.creator && <p className="mt-1 text-sepia italic">{item.creator}</p>}

          <div className="mt-4 flex flex-wrap gap-1.5">
            {STATUS_ORDER.map((s) => {
              const cls = STATUS_CLASSES[s];
              const active = item.status === s;
              return (
                <button
                  key={s}
                  onClick={() => void applyPatch({ status: s })}
                  disabled={active}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                    active ? cls.pillActive : cls.pillIdle
                  }`}
                >
                  {STATUS_LABEL[s]}
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-sepia mb-1.5">
              Rating
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => {
                const filled = !!item.rating && n <= item.rating;
                return (
                  <button
                    key={n}
                    onClick={() =>
                      void applyPatch({
                        rating: (item.rating === n ? null : n) as 1 | 2 | 3 | 4 | 5
                      })
                    }
                    className={filled ? 'text-burgundy' : 'text-sepia-light hover:text-sepia'}
                    aria-label={`${n} stars`}
                  >
                    <StarIcon className="h-6 w-6" filled={filled} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-sepia">
              <span>Notes</span>
              {noteState !== 'idle' && (
                <span className="display italic normal-case tracking-normal text-forest text-[11px]">
                  {noteState === 'saving' ? 'Saving…' : 'Saved'}
                </span>
              )}
            </div>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                saveNotes(e.target.value);
              }}
              rows={5}
              placeholder="A line or two for future you."
              className="w-full rounded-md border border-line bg-paper-light p-3 text-sm text-ink outline-none focus:border-burgundy"
            />
          </div>

          <div className="mt-6 lg:hidden">{meta}</div>

          <button
            onClick={remove}
            className="mt-6 text-xs italic text-sepia hover:text-burgundy"
          >
            Remove from library
          </button>
        </div>
      </div>
    </Page>
  );
}

function BackLink() {
  return (
    <Link to="/library" className="inline-flex items-center gap-1 text-sm text-sepia hover:text-burgundy">
      <ChevronLeftIcon className="h-4 w-4" /> Back
    </Link>
  );
}
