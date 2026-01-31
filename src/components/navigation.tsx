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
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 flex-col bg-gray-900 border-r border-gray-800">
        {/* Collapsed sidebar (md) */}
        <div className="lg:hidden flex flex-col items-center w-16 py-6 gap-2">
          <div className="text-sm font-bold mb-4 text-blue-400">PR</div>
          {NAV_ITEMS.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                  active ? 'bg-blue-600' : 'hover:bg-gray-800'
                }`}
                title={item.label}
              >
                {item.icon}
              </Link>
            );
          })}
        </div>
        {/* Expanded sidebar (lg) */}
        <div className="hidden lg:flex flex-col w-56 py-6 px-3 gap-1">
          <Link href="/" className="flex items-center gap-2 px-3 mb-6">
            <span className="text-sm font-bold text-blue-400">PR</span>
            <span className="font-bold text-lg">PatentRadar</span>
          </Link>
          {NAV_ITEMS.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur border-t border-gray-800 safe-area-bottom">
        <div className="flex justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${
                  active ? 'text-blue-400' : 'text-gray-500'
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
