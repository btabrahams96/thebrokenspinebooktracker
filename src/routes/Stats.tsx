import { useEffect, useState } from 'react';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import { api, type Stats as StatsT } from '../lib/api';
import { LineSkeleton } from '../components/Skeleton';

export default function Stats() {
  const [stats, setStats] = useState<StatsT | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void api
      .stats()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load.'));
  }, []);

  return (
    <Page>
      <PageHeader eyebrow="§ 04" title="Stats" subtitle="A quiet count of what you've read." />

      {error && <p className="mt-8 text-burgundy">{error}</p>}

      {!stats && !error && (
        <div className="mt-10 space-y-3">
          <LineSkeleton width="w-40" />
          <LineSkeleton width="w-56" />
          <LineSkeleton width="w-32" />
        </div>
      )}

      {stats && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card label="Total" big={stats.total} sub="items in your library" />
          <Card label={`Finished in ${stats.year}`} big={stats.finishedThisYear} sub="books closed" />
          <Card
            label="By type"
            rows={[
              ['Books', stats.byType.book ?? 0],
              ['Manga', stats.byType.manga ?? 0],
              ['Comics', stats.byType.comic ?? 0]
            ]}
          />
          <Card
            label="By status"
            rows={[
              ['Reading', stats.byStatus.reading ?? 0],
              ['Read', stats.byStatus.read ?? 0],
              ['Owned', stats.byStatus.owned ?? 0],
              ['Wishlist', stats.byStatus.wishlist ?? 0],
              ['DNF', stats.byStatus.dnf ?? 0]
            ]}
          />
        </div>
      )}
    </Page>
  );
}

function Card({
  label,
  big,
  sub,
  rows
}: {
  label: string;
  big?: number;
  sub?: string;
  rows?: [string, number][];
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper-light p-6">
      <p className="text-xs uppercase tracking-widest text-sepia">{label}</p>
      {big !== undefined && (
        <>
          <p className="display mt-2 text-5xl text-ink">{big}</p>
          {sub && <p className="mt-1 text-sm italic text-sepia">{sub}</p>}
        </>
      )}
      {rows && (
        <ul className="mt-3 space-y-1 text-sm">
          {rows.map(([k, v]) => (
            <li key={k} className="flex justify-between">
              <span className="text-ink">{k}</span>
              <span className="font-mono text-sepia">{v}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
