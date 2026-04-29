import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import CardGrid from '../components/CardGrid';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';
import { GridSkeleton } from '../components/Skeleton';
import { useItems } from '../hooks/useItems';

export default function Wishlist() {
  const { items, error } = useItems({ status: 'wishlist' });

  const counter = items ? (
    <div className="font-mono text-xs text-sepia">{items.length} items</div>
  ) : null;

  return (
    <Page>
      <PageHeader
        eyebrow="§ 02"
        title="Wishlist"
        subtitle="Things you want next."
        right={counter}
      />

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
          <CardGrid>
            {items.map((it) => (
              <ItemCard key={it.id} item={it} />
            ))}
          </CardGrid>
        )}
      </div>
    </Page>
  );
}
