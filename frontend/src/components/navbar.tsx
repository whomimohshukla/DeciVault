import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';

import { cn } from '../lib/utils';
import { MenuGlyph, MenuToggle, menuToggleClass } from './menu-toggle';
import ThemeSwitcherDefault from './theme-switcher';
import ThemeSwitcher from './theme-switcher';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const ThemeSwitcherComp: any = (ThemeSwitcher as any) || ThemeSwitcherDefault;

export type NavLink = { label: string; href: string; external?: boolean; icon?: React.ReactNode; onClick?: () => void };
export type NavItem = { label: string; description?: string; href: string; icon?: React.ReactNode; active?: boolean };
export type NavGroup = { label: string; href?: string; items?: NavItem[]; columns?: 1 | 2; active?: boolean };

export function Navbar({
  logo,
  layout = 'menu',
  links = [],
  groups = [],
  actions,
  className,
}: {
  logo: React.ReactNode;
  layout?: 'menu' | 'inline';
  links?: NavLink[];
  groups?: NavGroup[];
  actions?: React.ReactNode;
  className?: string;
}) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header
      data-scrolled={scrolled || mobileOpen}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-in-out',
        'bg-transparent',
        (scrolled || mobileOpen) && 'bg-background/70 backdrop-blur-xl border-b border-border',
        className,
      )}
    >
      <nav aria-label="Main" className={cn('flex w-full items-center justify-between gap-5 px-6 py-4 sm:px-12 transition-all duration-500', scrolled && 'py-3')}>
        <div className="flex items-center gap-6">
          {logo}
          {layout === 'inline' && (
            <div className="hidden items-center gap-0.5 lg:flex">
              {groups.map((g) =>
                g.items?.length ? (
                  <NavMenu key={g.label} group={g} />
                ) : (
                  <a key={g.label} href={g.href} className={navLink} data-active={g.active || undefined} aria-current={g.active ? 'page' : undefined}>
                    {g.label}
                  </a>
                ),
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          {actions}
          <ThemeSwitcherComp />
          {layout === 'menu' ? (
            <MenuDropdown links={links} />
          ) : (
            <MenuToggle open={mobileOpen} onClick={() => setMobileOpen((v) => !v)} className="lg:hidden" />
          )}
        </div>
      </nav>
      {/* ... rest same ... */}
    </header>
  );
}
// Keep rest of the file as is
