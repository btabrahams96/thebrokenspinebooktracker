import { Link } from 'react-router-dom';
import type { Item } from '../types';
import CoverPlaceholder from './CoverPlaceholder';

export default function ReadingStrip({ items }: { items: Item[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mb-8" aria-label="Currently reading">
      <p className="font-mono text-xs uppercase tracking-widest text-sepia mb-3">Reading now</p>
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-2 px-2 scrollbar-thin">
          {items.map((it) => (
            <Link
              key={it.id}
              to={`/item/${it.id}`}
              className="snap-start shrink-0 group relative block overflow-hidden rounded-md bg-paper-deep shadow-sm h-[200px] md:h-[240px] aspect-[2/3]"
            >
              {it.cover_url ? (
                <img
                  src={it.cover_url}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                />
              ) : (
                <CoverPlaceholder item={it} className="absolute inset-0 rounded-md" />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-ink/65 px-2 py-1.5">
                <p className="line-clamp-1 text-[11px] font-medium text-paper-light">{it.title}</p>
                {it.creator && (
                  <p className="line-clamp-1 text-[10px] italic text-paper-light/75">{it.creator}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-paper to-transparent" />
      </div>
    </section>
  );
}
