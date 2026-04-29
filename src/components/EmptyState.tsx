import { Link } from 'react-router-dom';

type Props = {
  title: string;
  hint?: string;
  cta?: { to: string; label: string };
};

export default function EmptyState({ title, hint, cta }: Props) {
  return (
    <div className="rounded-2xl border border-line bg-paper-light p-8 text-center max-w-md">
      <p className="display text-xl text-ink">{title}</p>
      {hint && <p className="mt-2 text-sm italic text-sepia">{hint}</p>}
      {cta && (
        <Link
          to={cta.to}
          className="mt-5 inline-block rounded-md bg-burgundy px-4 py-2 text-sm font-semibold text-paper-light"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
