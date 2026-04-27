import type { LookupResult } from '../lib/lookup';

type Props = {
  result: LookupResult;
  onAdd: (status: 'owned' | 'wishlist') => void;
  onDismiss?: () => void;
  pending?: boolean;
};

export default function ResultPreview({ result, onAdd, onDismiss, pending }: Props) {
  return (
    <div className="rounded-2xl border border-line bg-paper-light p-5 max-w-md">
      <div className="flex gap-4">
        {result.cover_url ? (
          <img
            src={result.cover_url}
            alt=""
            className="h-32 w-22 rounded-md object-cover bg-paper-deep"
            style={{ aspectRatio: '2/3', width: '5.5rem' }}
          />
        ) : (
          <div className="h-32 w-22 rounded-md bg-paper-deep" style={{ width: '5.5rem' }} />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="display text-lg leading-tight text-ink">{result.title}</h3>
          {result.creator && <p className="mt-1 text-sm italic text-sepia">{result.creator}</p>}
          <div className="mt-2 space-y-0.5 font-mono text-[11px] text-sepia">
            {result.isbn && <div>isbn · {result.isbn}</div>}
            {result.source && <div>source · {result.source.replace('_', ' ')}</div>}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onAdd('owned')}
          disabled={pending}
          className="flex-1 rounded-md bg-burgundy px-3 py-2 text-sm font-semibold text-paper-light disabled:opacity-60"
        >
          Add to Library
        </button>
        <button
          onClick={() => onAdd('wishlist')}
          disabled={pending}
          className="flex-1 rounded-md border border-line bg-paper-deep px-3 py-2 text-sm font-semibold text-ink disabled:opacity-60"
        >
          Wishlist
        </button>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="mt-2 w-full text-center text-xs italic text-sepia hover:text-ink"
        >
          Not this one — try again
        </button>
      )}
    </div>
  );
}
