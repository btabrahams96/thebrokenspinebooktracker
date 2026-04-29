import { Link } from 'react-router-dom';

type Props = {
  title: string;
  hint?: string;
  cta?: { to: string; label: string };
};

export default function EmptyState({ title, hint, cta }: Props) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-line bg-paper-light text-center px-6 py-16 md:py-24">
      <svg
        viewBox="0 0 40 40"
        className="mx-auto h-10 w-10 text-sepia"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M5 8h12a3 3 0 013 3v22a2 2 0 00-2-2H5z" />
        <path d="M35 8H23a3 3 0 00-3 3v22a2 2 0 012-2h13z" />
        <path d="M9 14h7M9 19h7M9 24h5" />
        <path d="M24 14h7M24 19h7M24 24h5" />
      </svg>
      <p className="display mt-5 text-xl md:text-2xl text-ink">{title}</p>
      {hint && <p className="mt-2 text-sm italic text-sepia max-w-xs mx-auto">{hint}</p>}
      {cta && (
        <Link
          to={cta.to}
          className="mt-6 inline-block rounded-md bg-burgundy px-4 py-2 text-sm font-semibold text-paper-light"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
