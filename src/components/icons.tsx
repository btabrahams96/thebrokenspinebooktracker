import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
};

export function LibraryIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M4 4v16M8 4v16M12 4v16M16 4v16M20 4v16" />
    </svg>
  );
}

export function WishlistIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M6 3h12v18l-6-4-6 4z" />
    </svg>
  );
}

export function PlusIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} strokeWidth={1.8} {...rest}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function StatsIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M5 20V10M12 20V4M19 20v-7" />
    </svg>
  );
}

export function SettingsIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M4 6h10M4 12h16M4 18h7" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="9" cy="18" r="2" />
    </svg>
  );
}

export function SearchIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </svg>
  );
}

export function ScanIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M3 8V5a2 2 0 012-2h3M16 3h3a2 2 0 012 2v3M21 16v3a2 2 0 01-2 2h-3M8 21H5a2 2 0 01-2-2v-3" />
    </svg>
  );
}

export function StarIcon({ className, filled, ...rest }: IconProps & { filled?: boolean }) {
  return (
    <svg
      {...base}
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      {...rest}
    >
      <path d="M12 3.5l2.7 5.5 6 .9-4.4 4.3 1 6-5.3-2.8-5.3 2.8 1-6L3.3 9.9l6-.9z" />
    </svg>
  );
}

export function ChevronLeftIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function BookOpenIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M3 5h7a2 2 0 012 2v12a2 2 0 00-2-2H3z" />
      <path d="M21 5h-7a2 2 0 00-2 2v12a2 2 0 012-2h7z" />
    </svg>
  );
}
