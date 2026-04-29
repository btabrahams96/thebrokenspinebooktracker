import { useEffect, useState } from 'react';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import StatusBar from '../components/StatusBar';
import Sparkline from '../components/Sparkline';
import { api, type Stats as StatsT } from '../lib/api';
import { LineSkeleton } from '../components/Skeleton';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { Item } from '../types';

export default function Stats() {
  const [stats, setStats] = useState<StatsT | null>(null);
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useDocumentTitle('The Broken Spine — Stats');

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.stats(), api.listItems({})])
      .then(([s, list]) => {
        if (cancelled) return;
        setStats(s);
        setItems(list.items);
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : 'Failed to load.'));
    return () => {
      cancelled = true;
    };
  }, []);

  const monthly = (() => {
    if (!stats || !items) return null;
    const arr = Array(12).fill(0) as number[];
    for (const it of items) {
      if (it.status !== 'read' || !it.date_finished) continue;
      const d = new Date(it.date_finished);
      if (Number.isNaN(d.getTime())) continue;
      if (d.getFullYear() !== stats.year) continue;
      arr[d.getMonth()] += 1;
    }
    return arr;
  })();

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
        <>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-line bg-paper-light p-6">
              <p className="text-xs uppercase tracking-widest text-sepia mb-4">Library by status</p>
              <StatusBar counts={stats.byStatus} />
            </div>
            <div className="rounded-2xl border border-line bg-paper-light p-6">
              <p className="text-xs uppercase tracking-widest text-sepia mb-2">
                Finished by month · {stats.year}
              </p>
              {monthly ? (
                <Sparkline values={monthly} />
              ) : (
                <LineSkeleton width="w-full" />
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </>
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
