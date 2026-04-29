import { Link } from 'react-router-dom';
import type { Item } from '../types';
import { STATUS_CLASSES, STATUS_LABEL } from '../lib/status';
import CoverPlaceholder from './CoverPlaceholder';

export default function ItemCard({ item }: { item: Item }) {
  const status = STATUS_CLASSES[item.status];
  return (
    <Link
      to={`/item/${item.id}`}
      className="group relative block aspect-[2/3] overflow-hidden rounded-md bg-paper-deep shadow-sm transition-transform active:scale-[0.98] hover:shadow-md"
    >
      {item.cover_url ? (
        <img
          src={item.cover_url}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
        />
      ) : (
        <CoverPlaceholder
          item={item}
          className="absolute inset-0 rounded-md"
        />
      )}
      <span
        className={`absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full ring-1 ring-paper-light/40 ${status.dot}`}
        title={STATUS_LABEL[item.status]}
      />
      <div className="absolute inset-x-0 bottom-0 bg-ink/65 px-2 py-1.5">
        <p className="line-clamp-1 text-[11px] font-medium text-paper-light">{item.title}</p>
        {item.creator && (
          <p className="line-clamp-1 text-[10px] italic text-paper-light/75">{item.creator}</p>
        )}
      </div>
    </Link>
  );
}
