type Props = {
  values: number[];
  height?: number;
  className?: string;
};

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export default function Sparkline({ values, height = 60, className }: Props) {
  const max = Math.max(1, ...values);
  const w = 240;
  const padX = 6;
  const stepX = (w - padX * 2) / Math.max(1, values.length - 1);
  const points = values
    .map((v, i) => {
      const x = padX + i * stepX;
      const y = height - 8 - (v / max) * (height - 16);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      className={['w-full text-forest', className ?? ''].join(' ')}
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {values.map((v, i) => {
        const x = padX + i * stepX;
        const y = height - 8 - (v / max) * (height - 16);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={1.5} fill="currentColor" />
            <text
              x={x}
              y={height - 1}
              textAnchor="middle"
              fontSize="7"
              fontFamily="JetBrains Mono, monospace"
              fill="rgba(26,20,16,0.45)"
            >
              {MONTHS[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
