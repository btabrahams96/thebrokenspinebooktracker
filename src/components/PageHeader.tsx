type Props = { eyebrow?: string; title: string; subtitle?: string };

export default function PageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <header>
      {eyebrow && (
        <div className="display italic text-burgundy text-sm mb-2">{eyebrow}</div>
      )}
      <h1 className="display text-4xl md:text-5xl text-ink">{title}</h1>
      {subtitle && (
        <p className="mt-3 text-sepia text-base md:text-lg max-w-prose">{subtitle}</p>
      )}
    </header>
  );
}
