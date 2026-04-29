import { NavLink } from 'react-router-dom';
import type { ComponentType, SVGProps } from 'react';
import {
  LibraryIcon,
  WishlistIcon,
  PlusIcon,
  StatsIcon,
  SettingsIcon
} from './icons';

type Tab = {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
  primary?: boolean;
};

const tabs: Tab[] = [
  { to: '/library', label: 'Library', icon: LibraryIcon },
  { to: '/wishlist', label: 'Wishlist', icon: WishlistIcon },
  { to: '/add', label: 'Add', icon: PlusIcon, primary: true },
  { to: '/stats', label: 'Stats', icon: StatsIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon }
];

export default function BottomNav() {
  return (
    <nav
      className="
        fixed bottom-0 inset-x-0 z-40 border-t border-line bg-paper/90 backdrop-blur
        pb-[env(safe-area-inset-bottom)]
        md:static md:inset-auto md:h-screen md:w-[72px] md:flex-col md:border-t-0 md:border-r md:bg-paper-light md:backdrop-blur-none md:pb-0
        lg:w-64
      "
    >
      <div className="hidden lg:block px-6 pt-8 pb-6">
        <div className="display text-[1.625rem] leading-tight text-burgundy">
          The Broken<span className="text-forest">.</span>Spine
        </div>
        <div className="text-xs uppercase tracking-widest text-sepia mt-1">
          A library of one
        </div>
      </div>

      <ul className="flex md:flex-col md:gap-1 md:px-2 md:pt-3 lg:px-3 justify-around items-stretch h-16 md:h-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <li key={t.to} className="flex-1 md:flex-none">
              <NavLink
                to={t.to}
                title={t.label}
                end={t.to === '/library'}
                className={({ isActive }) =>
                  [
                    'group relative flex items-center justify-center md:justify-start',
                    'flex-col md:flex-row gap-1 md:gap-3',
                    'h-full md:h-auto md:px-3 md:py-3 md:rounded-md',
                    'text-[11px] lg:text-sm font-medium transition-colors',
                    isActive
                      ? 'text-burgundy md:bg-paper-deep md:text-ink md:border-l-[3px] md:border-burgundy md:pl-[calc(0.75rem-3px)]'
                      : 'text-sepia hover:text-ink'
                  ].join(' ')
                }
              >
                {t.primary ? (
                  <span className="grid h-11 w-11 md:h-9 md:w-9 lg:h-8 lg:w-8 place-items-center rounded-full md:rounded-md bg-burgundy text-paper-light shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                ) : (
                  <Icon className="h-5 w-5 md:h-[22px] md:w-[22px]" />
                )}
                <span className={t.primary ? 'md:hidden lg:inline' : 'md:hidden lg:inline'}>
                  {t.label}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
