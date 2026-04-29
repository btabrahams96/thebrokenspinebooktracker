import type { ReactNode } from 'react';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

export default function PageHeader({ eyebrow, title, subtitle, right }: Props) {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
      <div className="min-w-0">
        {eyebrow && (
          <>
            <div className="hidden lg:block w-12 border-t border-line mb-3" />
            <div className="display italic text-burgundy text-sm mb-2">{eyebrow}</div>
          </>
        )}
        <h1 className="display text-3xl md:text-4xl lg:text-5xl text-ink leading-[1.05]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-sepia text-base md:text-lg max-w-prose">{subtitle}</p>
        )}
      </div>
      {right && <div className="md:pb-2 md:shrink-0">{right}</div>}
    </header>
  );
}
