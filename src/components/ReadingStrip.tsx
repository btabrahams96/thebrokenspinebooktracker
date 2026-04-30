import { Link } from 'react-router-dom';
import type { Item } from '../types';
import CoverPlaceholder from './CoverPlaceholder';
import { STATUS_CLASSES } from '../lib/status';

export default function ReadingStrip({ items }: { items: Item[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-5 mb-2" aria-label="Currently reading">
      <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-sepia">
        <span className="h-1.5 w-1.5 rounded-full bg-forest shadow-[0_0_0_4px_rgba(45,74,62,0.15)]" />
        Reading now · {items.length}
      </div>
      <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory pb-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {items.map((it) => (
          <Link
            key={it.id}
            to={`/item/${it.id}`}
            className="snap-start flex-none w-[110px] md:w-[130px] aspect-[2/3] relative overflow-hidden rounded-lg shadow-[0_6px_16px_-8px_rgba(26,20,16,0.3)]"
          >
            {it.cover_url ? (
              <img
                src={it.cover_url}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <CoverPlaceholder item={it} size="md" />
            )}
            <span
              className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full ring-2 ring-ink/20 ${STATUS_CLASSES.reading.dot}`}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
