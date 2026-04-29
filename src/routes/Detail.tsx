import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { Item, ItemStatus } from '../types';

const STATUSES: { value: ItemStatus; label: string }[] = [
  { value: 'reading', label: 'Reading' },
  { value: 'read', label: 'Read' },
  { value: 'owned', label: 'Owned' },
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'dnf', label: 'DNF' }
];

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');

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

  if (error)
    return (
      <div className="px-5 pt-8 md:px-12 md:pt-12">
        <BackLink />
        <p className="mt-6 text-burgundy">{error}</p>
      </div>
    );
  if (!item || !id)
    return (
      <div className="px-5 pt-8 md:px-12 md:pt-12">
        <BackLink />
        <p className="mt-6 italic text-sepia">Loading…</p>
      </div>
    );

  const update = async (patch: Partial<Item>) => {
    setSaving(true);
    try {
      const r = await api.patchItem(id, patch);
      setItem(r.item);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm('Remove this from your library?')) return;
    await api.deleteItem(id);
    navigate(item.status === 'wishlist' ? '/wishlist' : '/library', { replace: true });
  };

  return (
    <div className="px-5 pt-8 md:px-12 md:pt-12 pb-16">
      <BackLink />

      <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
        {item.cover_url ? (
          <img
            src={item.cover_url}
            alt=""
            className="w-40 self-center rounded-md object-cover shadow-md md:self-start"
            style={{ aspectRatio: '2/3' }}
          />
        ) : (
          <div
            className="w-40 self-center rounded-md bg-gradient-to-br from-burgundy to-burgundy-deep grid place-items-center p-4 text-center md:self-start"
            style={{ aspectRatio: '2/3' }}
          >
            <span className="display text-paper-light">{item.title}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h1 className="display text-3xl text-ink leading-tight">{item.title}</h1>
          {item.creator && <p className="mt-1 text-sepia italic">{item.creator}</p>}

          <div className="mt-4 flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => void update({ status: s.value })}
                disabled={saving || item.status === s.value}
                className={`rounded-full px-3 py-1 text-xs font-medium border ${
                  item.status === s.value
                    ? 'bg-burgundy text-paper-light border-burgundy'
                    : 'bg-paper-deep text-ink border-line'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-widest text-sepia mb-2">Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() =>
                    void update({ rating: (item.rating === n ? null : n) as 1 | 2 | 3 | 4 | 5 })
                  }
                  className={`text-2xl ${
                    item.rating && n <= item.rating ? 'text-burgundy' : 'text-sepia-light'
                  }`}
                  aria-label={`${n} stars`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-widest text-sepia mb-2">Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => {
                if ((item.notes ?? '') !== notes) void update({ notes: notes || undefined });
              }}
              rows={4}
              placeholder="A line or two for future you."
              className="w-full rounded-md border border-line bg-paper-light p-3 text-sm text-ink outline-none focus:border-burgundy"
            />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-y-2 font-mono text-xs text-sepia">
            <dt>Type</dt><dd className="text-ink">{item.type}</dd>
            {item.isbn && (<><dt>ISBN</dt><dd className="text-ink">{item.isbn}</dd></>)}
            {item.series && (<><dt>Series</dt><dd className="text-ink">{item.series}{item.volume ? ` · v${item.volume}` : ''}</dd></>)}
            <dt>Added</dt><dd className="text-ink">{item.date_added.slice(0, 10)}</dd>
            {item.date_finished && (<><dt>Finished</dt><dd className="text-ink">{item.date_finished.slice(0, 10)}</dd></>)}
            {item.source && (<><dt>Source</dt><dd className="text-ink">{item.source.replace('_', ' ')}</dd></>)}
          </dl>

          <button
            onClick={remove}
            className="mt-8 text-xs italic text-sepia hover:text-burgundy"
          >
            Remove from library
          </button>
        </div>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link to="/library" className="text-sm text-sepia hover:text-burgundy">
      ← Back
    </Link>
  );
}
