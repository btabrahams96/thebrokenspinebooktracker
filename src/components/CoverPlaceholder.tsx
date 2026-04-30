import type { Item } from '../types';

const GRADIENT: Record<Item['type'], string> = {
  book: 'from-burgundy to-burgundy-deep',
  manga: 'from-forest to-forest-deep',
  comic: 'from-ink to-sepia'
};

type Props = { item: Pick<Item, 'title' | 'type'>; size?: 'sm' | 'md' | 'lg' };

export default function CoverPlaceholder({ item, size = 'sm' }: Props) {
  const text = size === 'lg' ? 'text-base' : size === 'md' ? 'text-sm' : 'text-xs';
  return (
    <div
      className={`absolute inset-0 grid place-items-center bg-gradient-to-br ${GRADIENT[item.type]} p-3 text-center`}
    >
      <span className={`display italic text-paper-light leading-tight ${text}`}>
        {item.title}
      </span>
    </div>
  );
}
