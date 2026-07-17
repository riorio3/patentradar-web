'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchIcon, LightbulbIcon, BookmarkIcon, GearIcon } from '@/components/icons';

const NAV_ITEMS = [
  { href: '/', label: 'Discover', icon: <SearchIcon size={18} /> },
  { href: '/solve', label: 'Problem Solver', icon: <LightbulbIcon size={18} /> },
  { href: '/saved', label: 'Saved', icon: <BookmarkIcon size={18} /> },
  { href: '/settings', label: 'Settings', icon: <GearIcon size={18} /> },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
        {/* Collapsed sidebar (md) */}
        <div className="lg:hidden flex flex-col items-center w-16 py-6 gap-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6">
            <span className="text-white font-bold text-sm">PR</span>
          </div>
          {NAV_ITEMS.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]'
                }`}
                title={item.label}
              >
                {item.icon}
              </Link>
            );
          })}
        </div>
        {/* Expanded sidebar (lg) */}
        <div className="hidden lg:flex flex-col w-60 py-6 px-3 gap-0.5">
          <Link href="/" className="flex items-center gap-2.5 px-3 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-xs">PR</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">PatentRadar</span>
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] px-3 mb-2 font-medium">Menu</p>
          {NAV_ITEMS.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                    : 'text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-[var(--border)] safe-area-bottom">
        <div className="flex justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                  active ? 'text-blue-400' : 'text-[var(--muted)]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
