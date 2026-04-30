type Props = {
  values: number[];
  className?: string;
};

export default function Sparkline({ values, className }: Props) {
  if (values.length === 0) return null;
  const w = 220;
  const h = 40;
  const max = Math.max(1, ...values);
  const step = w / Math.max(1, values.length - 1);
  const pts = values.map((v, i) => `${(i * step).toFixed(1)},${(h - 8 - (v / max) * (h - 12)).toFixed(1)}`);
  const line = `M ${pts.join(' L ')}`;
  const area = `${line} L ${w},${h} L 0,${h} Z`;
  const lastIdx = values.length - 1;
  const lastX = lastIdx * step;
  const lastY = h - 8 - (values[lastIdx] / max) * (h - 12);
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={['w-full text-forest', className ?? ''].join(' ')}
    >
      <path d={area} fill="rgba(45, 74, 62, 0.08)" />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={2.5} fill="currentColor" />
    </svg>
  );
}
