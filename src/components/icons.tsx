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
      <rect x="4" y="4" width="3" height="16" rx="0.5" />
      <rect x="9" y="4" width="3" height="16" rx="0.5" />
      <path d="M16 4.5l3 .9-3 14.4-3-.9z" />
    </svg>
  );
}

export function WishlistIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M6 4h12v16l-6-4-6 4z" />
    </svg>
  );
}

export function PlusIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function StatsIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M5 19V11M12 19V5M19 19v-6" />
    </svg>
  );
}

export function SettingsIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h12M20 17h0" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="18" cy="17" r="2" />
    </svg>
  );
}

export function SearchIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5" />
    </svg>
  );
}

export function ScanIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M4 8V5a1 1 0 011-1h3M20 8V5a1 1 0 00-1-1h-3M4 16v3a1 1 0 001 1h3M20 16v3a1 1 0 01-1 1h-3M7 12h10" />
    </svg>
  );
}

export function StarIcon({ className, filled, ...rest }: IconProps & { filled?: boolean }) {
  return (
    <svg
      {...base}
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      {...rest}
    >
      <path d="M12 3.5l2.7 5.5 6 .9-4.4 4.3 1 6-5.3-2.8-5.3 2.8 1-6L3.3 9.9l6-.9z" />
    </svg>
  );
}

export function ChevronLeftIcon({ className, ...rest }: IconProps) {
  return (
    <svg {...base} className={className} {...rest}>
      <path d="M14 6l-6 6 6 6" />
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
