import PageHeader from '../components/PageHeader';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';
import { GridSkeleton } from '../components/Skeleton';
import { useItems } from '../hooks/useItems';

export default function Wishlist() {
  const { items, error } = useItems({ status: 'wishlist' });

  return (
    <div className="px-5 pt-8 md:px-12 md:pt-12 pb-12">
      <div className="flex items-end justify-between gap-4">
        <PageHeader eyebrow="§ 02" title="Wishlist" subtitle="Things you want next." />
        {items && <div className="font-mono text-xs text-sepia pb-2">{items.length} items</div>}
      </div>

      <div className="mt-8">
        {error && <p className="text-burgundy">{error}</p>}
        {!items && !error && <GridSkeleton count={6} />}
        {items && items.length === 0 && (
          <EmptyState
            title="Empty for now."
            hint="Add a title from the search screen."
            cta={{ to: '/add', label: 'Add to wishlist' }}
          />
        )}
        {items && items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {items.map((it) => (
              <ItemCard key={it.id} item={it} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
