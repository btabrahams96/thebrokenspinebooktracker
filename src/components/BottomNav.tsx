import { NavLink } from 'react-router-dom';

type Tab = { to: string; label: string; primary?: boolean };

const tabs: Tab[] = [
  { to: '/library', label: 'Library' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/add', label: 'Add', primary: true },
  { to: '/stats', label: 'Stats' },
  { to: '/settings', label: 'Settings' }
];

export default function BottomNav() {
  return (
    <nav
      className="
        fixed bottom-0 inset-x-0 z-40 border-t border-line bg-paper/90 backdrop-blur
        md:static md:inset-auto md:h-screen md:w-64 md:flex-col md:border-t-0 md:border-r md:bg-paper-light md:backdrop-blur-none
      "
    >
      <div className="hidden md:block px-6 pt-8 pb-6">
        <div className="display text-2xl text-burgundy">
          The Broken<span className="text-forest">.</span>Spine
        </div>
        <div className="text-xs uppercase tracking-widest text-sepia mt-1">
          A library of one
        </div>
      </div>

      <ul className="flex md:flex-col md:gap-1 md:px-3 md:pt-2 justify-around items-stretch h-16 md:h-auto">
        {tabs.map((t) => (
          <li key={t.to} className="flex-1 md:flex-none">
            <NavLink
              to={t.to}
              className={({ isActive }) =>
                [
                  'flex flex-col md:flex-row md:items-center md:gap-3 md:px-4 md:py-3 md:rounded-md',
                  'items-center justify-center h-full text-[11px] md:text-sm font-medium',
                  'transition-colors',
                  isActive
                    ? 'text-burgundy md:bg-paper-deep md:text-ink'
                    : 'text-sepia hover:text-ink',
                  t.primary ? 'md:font-semibold' : ''
                ].join(' ')
              }
            >
              <span
                className={[
                  'mb-1 md:mb-0 inline-block rounded-md',
                  t.primary
                    ? 'h-9 w-9 md:h-7 md:w-7 bg-burgundy text-paper-light grid place-items-center text-base md:text-sm font-display'
                    : 'h-5 w-5 bg-sepia-light/50'
                ].join(' ')}
                aria-hidden
              >
                {t.primary ? '+' : ''}
              </span>
              <span>{t.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
