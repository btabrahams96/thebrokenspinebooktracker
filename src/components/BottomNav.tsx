import { NavLink } from 'react-router-dom';
import type { ComponentType, SVGProps } from 'react';
import {
  LibraryIcon,
  WishlistIcon,
  PlusIcon,
  StatsIcon,
  SettingsIcon
} from './icons';

type IconC = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
type Tab = { to: string; label: string; icon: IconC; primary?: boolean };

const tabs: Tab[] = [
  { to: '/library', label: 'Library', icon: LibraryIcon },
  { to: '/wishlist', label: 'Wishlist', icon: WishlistIcon },
  { to: '/add', label: 'Add', icon: PlusIcon, primary: true },
  { to: '/stats', label: 'Stats', icon: StatsIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon }
];

export default function BottomNav() {
  return (
    <>
      {/* Mobile bottom bar (< md) */}
      <nav
        className="
          fixed bottom-0 inset-x-0 z-40 h-16 border-t border-line
          bg-paper/90 backdrop-blur pb-[env(safe-area-inset-bottom)]
          flex md:hidden
        "
      >
        {tabs.map((t) => (
          <MobileTab key={t.to} tab={t} />
        ))}
      </nav>

      {/* Tablet rail (md only) */}
      <aside
        className="
          hidden md:flex lg:hidden
          fixed inset-y-0 left-0 z-40 w-16 flex-col items-center
          border-r border-line bg-paper-light py-6 gap-1
        "
      >
        {tabs.map((t) => (
          <RailItem key={t.to} tab={t} />
        ))}
      </aside>

      {/* Desktop sidebar (lg+) */}
      <aside
        className="
          hidden lg:flex
          fixed inset-y-0 left-0 z-40 w-[220px] flex-col
          border-r border-line bg-paper-light px-[18px] py-7
        "
      >
        <div className="mb-7">
          <div className="display text-[1.625rem] leading-none tracking-tight text-burgundy">
            The Broken<span className="text-forest">.</span>Spine
          </div>
          <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-sepia">
            A library of one
          </div>
        </div>
        <nav className="flex flex-col gap-0.5">
          {tabs.map((t) => (
            <SidebarItem key={t.to} tab={t} />
          ))}
        </nav>
      </aside>
    </>
  );
}

function MobileTab({ tab }: { tab: Tab }) {
  const { icon: Icon, primary } = tab;
  return (
    <NavLink
      to={tab.to}
      end={tab.to === '/library'}
      className={({ isActive }) =>
        [
          'flex-1 flex flex-col items-center gap-0.5',
          primary ? 'justify-start pt-0' : 'justify-center pt-1.5',
          'text-[9.5px] font-medium transition-colors',
          isActive ? 'text-burgundy' : 'text-sepia hover:text-ink'
        ].join(' ')
      }
    >
      {primary ? (
        <span className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-burgundy text-paper-light shadow-[0_4px_12px_-3px_rgba(107,31,46,0.4)] mt-1 mb-0.5">
          <Icon className="h-5 w-5" />
        </span>
      ) : (
        <Icon className="h-5 w-5" />
      )}
      <span>{tab.label}</span>
    </NavLink>
  );
}

function RailItem({ tab }: { tab: Tab }) {
  const { icon: Icon, primary } = tab;
  return (
    <NavLink
      to={tab.to}
      end={tab.to === '/library'}
      title={tab.label}
      className={({ isActive }) =>
        [
          'relative grid h-11 w-11 place-items-center rounded-[10px] transition-colors',
          primary
            ? 'bg-burgundy text-paper-light my-2 shadow-[0_4px_12px_-3px_rgba(107,31,46,0.4)]'
            : isActive
              ? 'bg-paper-deep text-burgundy before:content-[""] before:absolute before:left-[-16px] before:top-2 before:bottom-2 before:w-[3px] before:bg-burgundy before:rounded-r-sm'
              : 'text-sepia hover:text-ink'
        ].join(' ')
      }
    >
      <Icon className="h-5 w-5" />
    </NavLink>
  );
}

function SidebarItem({ tab }: { tab: Tab }) {
  const { icon: Icon, primary } = tab;
  return (
    <NavLink
      to={tab.to}
      end={tab.to === '/library'}
      className={({ isActive }) =>
        [
          'relative flex items-center gap-2.5 px-3 py-[9px] rounded-md',
          'text-[13px] font-medium transition-colors',
          primary && !isActive
            ? 'text-burgundy font-semibold'
            : isActive
              ? 'bg-paper-deep text-ink before:content-[""] before:absolute before:left-[-18px] before:top-2 before:bottom-2 before:w-[3px] before:bg-burgundy before:rounded-r-sm'
              : 'text-sepia hover:text-ink'
        ].join(' ')
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{tab.label}</span>
    </NavLink>
  );
}
