import { Link } from 'react-router-dom';
import type { Item } from '../types';

const STATUS_DOT: Partial<Record<Item['status'], string>> = {
  reading: 'bg-forest',
  owned: 'bg-sepia-light',
  read: 'bg-burgundy',
  wishlist: 'bg-paper-deep',
  dnf: 'bg-ink/40'
};

export default function ItemCard({ item }: { item: Item }) {
  return (
    <Link
      to={`/item/${item.id}`}
      className="group relative block aspect-[2/3] overflow-hidden rounded-md bg-paper-deep shadow-sm"
    >
      {item.cover_url ? (
        <img
          src={item.cover_url}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-burgundy to-burgundy-deep p-3 text-center">
          <span className="display text-paper-light text-sm leading-tight">{item.title}</span>
        </div>
      )}
      <span
        className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full ${STATUS_DOT[item.status] ?? 'bg-paper-light'}`}
        aria-label={item.status}
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
