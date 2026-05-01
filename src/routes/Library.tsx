import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import CardGrid from '../components/CardGrid';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';
import ReadingStrip from '../components/ReadingStrip';
import SearchBar, { type SearchBarHandle } from '../components/SearchBar';
import { GridSkeleton } from '../components/Skeleton';
import DensitySlider from '../components/DensitySlider';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useItems } from '../hooks/useItems';
import type { Item, ItemStatus, ItemType } from '../types';
import { STATUS_CLASSES, TYPE_FILTER_ACTIVE, TYPE_FILTER_IDLE } from '../lib/status';

type SortKey = 'recent' | 'title' | 'rating' | 'finished';
const SORTS: { value: SortKey; label: string }[] = [
  { value: 'recent', label: 'Recently added' },
  { value: 'title', label: 'Title' },
  { value: 'rating', label: 'Rating' },
  { value: 'finished', label: 'Recently finished' }
];

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

const isType = (v: string | null): v is ItemType =>
  v === 'book' || v === 'manga' || v === 'comic';
const isStatus = (v: string | null): v is ItemStatus =>
  v === 'wishlist' || v === 'owned' || v === 'reading' || v === 'read' || v === 'dnf';
const isSort = (v: string | null): v is SortKey =>
  v === 'recent' || v === 'title' || v === 'rating' || v === 'finished';

export default function Library() {
  useDocumentTitle('The Broken Spine — Library');
  const [params, setParams] = useSearchParams();

  const type: ItemType | 'all' = isType(params.get('type')) ? (params.get('type') as ItemType) : 'all';
  const status: ItemStatus | 'all' = isStatus(params.get('status'))
    ? (params.get('status') as ItemStatus)
    : 'all';
  const sort: SortKey = isSort(params.get('sort')) ? (params.get('sort') as SortKey) : 'recent';
  const urlQuery = params.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  const searchRef = useRef<SearchBarHandle>(null);

  // Debounce URL writes for the search query so we don't shred history.
  useEffect(() => {
    const t = setTimeout(() => updateParams({ q: query.trim() || null }), 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const updateParams = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (v == null || v === '' || v === 'all' || (k === 'sort' && v === 'recent')) next.delete(k);
      else next.set(k, v);
    }
    setParams(next, { replace: true });
  };

  const fetchParams = useMemo(
    () => ({
      type: type === 'all' ? undefined : type,
      status: status === 'all' ? undefined : status
    }),
    [type, status]
  );
  const { items, error } = useItems(fetchParams);

  const reading = useMemo(
    () => (items ?? []).filter((i) => i.status === 'reading'),
    [items]
  );

  const visible = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    let out = items.filter((i) => (status === 'all' ? i.status !== 'wishlist' : true));
    if (q) {
      out = out.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.creator?.toLowerCase().includes(q) ?? false)
      );
    }
    out = [...out].sort((a, b) => sortFn(sort, a, b));
    return out;
  }, [items, query, status, sort]);

  // Keyboard shortcuts: '/' focuses search, Escape clears it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const inField = tag === 'input' || tag === 'textarea' || target?.isContentEditable;
      if (e.key === '/' && !inField) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'Escape' && tag === 'input' && query) {
        setQuery('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [query]);

  const counter = items ? (
    <div className="font-mono text-xs text-sepia">{visible.length} items</div>
  ) : null;

  return (
    <Page>
      <PageHeader eyebrow="§ 01" title="Library" subtitle="Everything you own." right={counter} />

      {/* Search + sort row, immediately under the header. */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[180px] lg:max-w-md">
          <SearchBar
            ref={searchRef}
            placeholder="Search your library"
            liveValue={query}
            onChange={setQuery}
            onSubmit={() => undefined}
          />
        </div>
        <select
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="bg-paper-deep border border-line rounded-md px-3 py-1.5 text-sm font-medium text-ink shrink-0"
          aria-label="Sort"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <DensitySlider className="shrink-0" />
      </div>

      {/* Filter chips. Two rows on mobile (types, then statuses);
          one wrapping line on lg with a divider between the groups. */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {TYPE_FILTERS.map((f) => (
          <TypeChip
            key={f.value}
            active={type === f.value}
            onClick={() => updateParams({ type: f.value })}
          >
            {f.label}
          </TypeChip>
        ))}
        <span className="hidden lg:inline self-center text-sepia-light px-1">·</span>
        <span className="basis-full lg:hidden h-0" aria-hidden />
        {STATUS_FILTERS.map((f) => (
          <StatusChip
            key={f.value}
            active={status === f.value}
            onClick={() => updateParams({ status: f.value })}
            statusKey={f.value === 'all' ? null : f.value}
          >
            {f.label}
          </StatusChip>
        ))}
      </div>

      {items && <ReadingStrip items={reading} />}

      <div className="mt-8">
        {error && <p className="text-burgundy">{error}</p>}
        {!items && !error && <GridSkeleton />}
        {items && visible.length === 0 && (
          <EmptyState
            title={query ? 'Nothing matched.' : 'Nothing here yet.'}
            hint={query ? 'Try a different search.' : 'Scan something.'}
            cta={query ? undefined : { to: '/add', label: 'Add a book' }}
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

function sortFn(sort: SortKey, a: Item, b: Item): number {
  switch (sort) {
    case 'title':
      return a.title.localeCompare(b.title);
    case 'rating': {
      const ar = a.rating ?? -1;
      const br = b.rating ?? -1;
      if (ar !== br) return br - ar;
      return a.date_added < b.date_added ? 1 : -1;
    }
    case 'finished': {
      const af = a.date_finished ?? '';
      const bf = b.date_finished ?? '';
      if (af === bf) return 0;
      if (!af) return 1;
      if (!bf) return -1;
      return af < bf ? 1 : -1;
    }
    case 'recent':
    default:
      return a.date_added < b.date_added ? 1 : -1;
  }
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
        active ? TYPE_FILTER_ACTIVE : TYPE_FILTER_IDLE
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
