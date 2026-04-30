import type { ItemStatus } from '../types';

export const STATUS_LABEL: Record<ItemStatus, string> = {
  reading: 'Reading',
  read: 'Read',
  owned: 'Owned',
  wishlist: 'Wishlist',
  dnf: 'DNF'
};

export const STATUS_ORDER: ItemStatus[] = ['reading', 'read', 'owned', 'wishlist', 'dnf'];

// Type filters get burgundy regardless — they're not statuses.
export const TYPE_FILTER_ACTIVE = 'bg-burgundy text-paper-light border-burgundy';
export const TYPE_FILTER_IDLE = 'bg-paper-deep text-ink border-line';

export const STATUS_CLASSES: Record<
  ItemStatus,
  { dot: string; pillActive: string; pillIdle: string; text: string; bar: string }
> = {
  reading: {
    dot: 'bg-forest',
    pillActive: 'bg-forest text-paper-light border-forest',
    pillIdle: 'bg-paper-deep text-ink border-line',
    text: 'text-forest',
    bar: 'bg-forest'
  },
  read: {
    dot: 'bg-burgundy',
    pillActive: 'bg-burgundy text-paper-light border-burgundy',
    pillIdle: 'bg-paper-deep text-ink border-line',
    text: 'text-burgundy',
    bar: 'bg-burgundy'
  },
  owned: {
    dot: 'bg-sepia',
    pillActive: 'bg-sepia text-paper-light border-sepia',
    pillIdle: 'bg-paper-deep text-ink border-line',
    text: 'text-sepia',
    bar: 'bg-sepia'
  },
  wishlist: {
    dot: 'bg-paper-deep border border-line',
    pillActive: 'bg-ink text-paper-light border-ink',
    pillIdle: 'bg-paper-deep text-ink border-line',
    text: 'text-ink',
    bar: 'bg-ink'
  },
  dnf: {
    dot: 'bg-ink/40',
    pillActive: 'bg-ink/70 text-paper-light border-ink/70',
    pillIdle: 'bg-paper-deep text-ink border-line',
    text: 'text-ink/70',
    bar: 'bg-ink/40'
  }
};
