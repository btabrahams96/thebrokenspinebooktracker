import { useMemo, useState } from 'react';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import CardGrid from '../components/CardGrid';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';
import { GridSkeleton } from '../components/Skeleton';
import { useItems } from '../hooks/useItems';
import type { ItemStatus, ItemType } from '../types';
import { STATUS_CLASSES } from '../lib/status';

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
      status: status === 'all' ? undefined : status
    }),
    [type, status]
  );
  const { items, error } = useItems(params);

  const visible = useMemo(
    () => (items ?? []).filter((i) => (status === 'all' ? i.status !== 'wishlist' : true)),
    [items, status]
  );

  const counter = items ? (
    <div className="font-mono text-xs text-sepia">{visible.length} items</div>
  ) : null;

  return (
    <Page>
      <PageHeader
        eyebrow="§ 01"
        title="Library"
        subtitle="Everything you own."
        right={counter}
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => (
          <TypeChip key={f.value} active={type === f.value} onClick={() => setType(f.value)}>
            {f.label}
          </TypeChip>
        ))}
        <span className="mx-1 self-center text-line">·</span>
        {STATUS_FILTERS.map((f) => (
          <StatusChip
            key={f.value}
            active={status === f.value}
            onClick={() => setStatus(f.value)}
            statusKey={f.value === 'all' ? null : f.value}
          >
            {f.label}
          </StatusChip>
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
          <CardGrid>
            {visible.map((it) => (
              <ItemCard key={it.id} item={it} />
            ))}
          </CardGrid>
        )}
      </div>
    </Page>
  );
}

function TypeChip({
  children,
  active,
  onClick
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
        active ? 'bg-burgundy text-paper-light border-burgundy' : 'bg-paper-deep text-ink border-line'
      }`}
    >
      {children}
    </button>
  );
}

function StatusChip({
  children,
  active,
  onClick,
  statusKey
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  statusKey: ItemStatus | null;
}) {
  const cls = statusKey ? STATUS_CLASSES[statusKey] : null;
  const activeCls = cls?.pillActive ?? 'bg-ink text-paper-light border-ink';
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
        active ? activeCls : 'bg-paper-deep text-ink border-line'
      }`}
    >
      {children}
    </button>
  );
}
