import type { Item, ItemType } from '../types';

const GRADIENTS: Record<ItemType, string> = {
  book: 'bg-gradient-to-br from-burgundy to-burgundy-deep',
  manga: 'bg-gradient-to-br from-forest to-forest-deep',
  comic: 'bg-gradient-to-br from-ink to-sepia'
};

type Props = {
  item: Pick<Item, 'title' | 'type'>;
  className?: string;
  textClass?: string;
};

export default function CoverPlaceholder({ item, className, textClass }: Props) {
  return (
    <div
      className={[
        'grid place-items-center p-3 text-center',
        GRADIENTS[item.type],
        'border border-paper-light/20',
        className ?? ''
      ].join(' ')}
    >
      <span className={['display leading-tight text-paper-light', textClass ?? 'text-sm'].join(' ')}>
        {item.title}
      </span>
    </div>
  );
}
