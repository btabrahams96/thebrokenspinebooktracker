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
        fixed bottom-0 inset-x-0 z-40 h-16 border-t border-line bg-paper/90 backdrop-blur
        pb-[env(safe-area-inset-bottom)]
        md:static md:inset-auto md:h-screen md:w-16 md:flex-col md:border-t-0 md:border-r md:bg-paper-light md:backdrop-blur-none md:py-6 md:pb-6
        lg:w-[220px] lg:px-[18px] lg:py-7
      "
    >
      <div className="hidden lg:block mb-7">
        <div className="display text-[1.625rem] leading-none tracking-tight text-burgundy">
          The Broken<span className="text-forest">.</span>Spine
        </div>
        <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-sepia">
          A library of one
        </div>
      </div>

      <ul className="flex md:flex-col md:gap-1 md:items-center lg:items-stretch h-full md:h-auto justify-around">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <li key={t.to}>
              <NavLink
                to={t.to}
                title={t.label}
                end={t.to === '/library'}
                className={({ isActive }) =>
                  [
                    'group relative flex items-center justify-center',
                    'flex-col md:flex-row gap-0.5 md:gap-2.5',
                    'md:h-11 md:w-11 lg:w-auto lg:h-auto md:rounded-[10px] lg:rounded-md lg:px-3 lg:py-[9px]',
                    'text-[9.5px] lg:text-[13px] font-medium transition-colors',
                    isActive
                      ? 'text-burgundy md:bg-paper-deep lg:text-ink lg:before:content-[""] lg:before:absolute lg:before:left-[-18px] lg:before:top-2 lg:before:bottom-2 lg:before:w-[3px] lg:before:bg-burgundy lg:before:rounded-r-sm md:before:content-[""] md:before:absolute md:before:left-[-16px] md:before:top-2 md:before:bottom-2 md:before:w-[3px] md:before:bg-burgundy md:before:rounded-r-sm lg:before:left-[-18px]'
                      : 'text-sepia hover:text-ink'
                  ].join(' ')
                }
              >
                {t.primary ? (
                  <span className="grid h-[38px] w-[38px] md:h-[38px] md:w-[38px] place-items-center rounded-xl bg-burgundy text-paper-light shadow-[0_4px_12px_-3px_rgba(107,31,46,0.4)] mt-1 mb-0.5 md:mt-0 md:mb-0 lg:hidden">
                    <Icon className="h-5 w-5" />
                  </span>
                ) : null}
                {!t.primary && <Icon className="h-5 w-5" />}
                {t.primary && (
                  <Icon className="hidden lg:block h-4 w-4 text-burgundy" />
                )}
                <span className={t.primary ? 'lg:inline md:hidden' : 'md:hidden lg:inline'}>
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
