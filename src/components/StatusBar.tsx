import type { ItemStatus } from '../types';
import { STATUS_CLASSES, STATUS_LABEL, STATUS_ORDER } from '../lib/status';

type Props = {
  counts: Partial<Record<ItemStatus, number>>;
};

export default function StatusBar({ counts }: Props) {
  const total = STATUS_ORDER.reduce((acc, s) => acc + (counts[s] ?? 0), 0);
  if (total === 0) return null;
  return (
    <div>
      <div
        className="flex h-6 w-full overflow-hidden rounded-full border border-line bg-paper-deep"
        role="img"
        aria-label="Library breakdown by status"
      >
        {STATUS_ORDER.map((s) => {
          const n = counts[s] ?? 0;
          if (n === 0) return null;
          const pct = (n / total) * 100;
          return (
            <div
              key={s}
              title={`${STATUS_LABEL[s]}: ${n}`}
              style={{ width: `${pct}%` }}
              className={STATUS_CLASSES[s].bar}
            />
          );
        })}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-sepia">
        {STATUS_ORDER.map((s) => {
          const n = counts[s] ?? 0;
          if (n === 0) return null;
          return (
            <li key={s} className="inline-flex items-center gap-2">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${STATUS_CLASSES[s].dot}`} />
              <span className="text-ink">{STATUS_LABEL[s]}</span>
              <span className="font-mono">{n}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
