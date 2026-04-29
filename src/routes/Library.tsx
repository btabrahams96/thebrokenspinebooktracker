import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';
import { GridSkeleton } from '../components/Skeleton';
import { useItems } from '../hooks/useItems';
import type { ItemStatus, ItemType } from '../types';

const TYPE_FILTERS: { value: ItemType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'book', label: 'Books' },
  { value: 'manga', label: 'Manga' },
  { value: 'comic', label: 'Comics' }
];

const STATUS_FILTERS: { value: ItemStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Any status' },
  { value: 'reading', label: 'Reading' },
  { value: 'owned', label: 'Owned' },
  { value: 'read', label: 'Read' },
  { value: 'dnf', label: 'DNF' }
];

export default function Library() {
  const [type, setType] = useState<ItemType | 'all'>('all');
  const [status, setStatus] = useState<ItemStatus | 'all'>('all');
  const params = useMemo(
    () => ({
      type: type === 'all' ? undefined : type,
      // Library shows everything except wishlist by default; wishlist has its own page.
      status: status === 'all' ? undefined : status
    }),
    [type, status]
  );
  const { items, error } = useItems(params);

  const visible = useMemo(
    () => (items ?? []).filter((i) => (status === 'all' ? i.status !== 'wishlist' : true)),
    [items, status]
  );

  return (
    <div className="px-5 pt-8 md:px-12 md:pt-12 pb-12">
      <div className="flex items-end justify-between gap-4">
        <PageHeader eyebrow="§ 01" title="Library" subtitle="Everything you own." />
        {items && (
          <div className="font-mono text-xs text-sepia pb-2">{visible.length} items</div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => (
          <Chip key={f.value} active={type === f.value} onClick={() => setType(f.value)} tone="burgundy">
            {f.label}
          </Chip>
        ))}
        <span className="mx-1 self-center text-line">·</span>
        {STATUS_FILTERS.map((f) => (
          <Chip key={f.value} active={status === f.value} onClick={() => setStatus(f.value)} tone="forest">
            {f.label}
          </Chip>
        ))}
      </div>

      <div className="mt-8">
        {error && <p className="text-burgundy">{error}</p>}
        {!items && !error && <GridSkeleton />}
        {items && visible.length === 0 && (
          <EmptyState
            title="Nothing here yet."
            hint="Scan something."
            cta={{ to: '/add', label: 'Add a book' }}
          />
        )}
        {visible.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {visible.map((it) => (
              <ItemCard key={it.id} item={it} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
  tone
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  tone: 'burgundy' | 'forest';
}) {
  const activeCls = tone === 'burgundy' ? 'bg-burgundy text-paper-light border-burgundy' : 'bg-forest text-paper-light border-forest';
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium border ${
        active ? activeCls : 'bg-paper-deep text-ink border-line'
      }`}
    >
      {children}
    </button>
  );
}
