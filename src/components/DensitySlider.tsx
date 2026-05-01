import { useGridDensity } from '../hooks/useGridDensity';

export default function DensitySlider({ className }: { className?: string }) {
  const { density, setDensity, min, max } = useGridDensity();

  return (
    <label
      className={[
        'inline-flex items-center gap-2 rounded-md border border-line bg-paper-deep px-2.5 py-1.5',
        className ?? ''
      ].join(' ')}
      title="Cover size"
      aria-label="Cover size"
    >
      <BigGridIcon className="h-3.5 w-3.5 text-sepia" />
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={density}
        onChange={(e) => setDensity(Number(e.currentTarget.value))}
        className="tbs-density-range w-24 md:w-28 accent-burgundy"
      />
      <SmallGridIcon className="h-3.5 w-3.5 text-sepia" />
    </label>
  );
}

function BigGridIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden>
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </svg>
  );
}

function SmallGridIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.25} className={className} aria-hidden>
      <rect x="2" y="2" width="3" height="3" rx="0.5" />
      <rect x="6.5" y="2" width="3" height="3" rx="0.5" />
      <rect x="11" y="2" width="3" height="3" rx="0.5" />
      <rect x="2" y="6.5" width="3" height="3" rx="0.5" />
      <rect x="6.5" y="6.5" width="3" height="3" rx="0.5" />
      <rect x="11" y="6.5" width="3" height="3" rx="0.5" />
      <rect x="2" y="11" width="3" height="3" rx="0.5" />
      <rect x="6.5" y="11" width="3" height="3" rx="0.5" />
      <rect x="11" y="11" width="3" height="3" rx="0.5" />
    </svg>
  );
}
