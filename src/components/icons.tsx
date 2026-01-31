const cn = (base: string, className?: string) => className ? `${base} ${className}` : base;

type IconProps = { className?: string; size?: number };

function svg(props: IconProps, d: string, viewBox = '0 0 24 24') {
  const s = props.size ?? 20;
  return (
    <svg width={s} height={s} viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d={d} />
    </svg>
  );
}

// Navigation
export function SearchIcon(p: IconProps = {}) { return svg(p, 'M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z'); }
export function LightbulbIcon(p: IconProps = {}) { return svg(p, 'M9 21h6M12 3a6 6 0 00-4 10.47V17h8v-3.53A6 6 0 0012 3z'); }
export function BookmarkIcon(p: IconProps = {}) { return svg(p, 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'); }
export function GearIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001.08 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z"/></svg>); }

// Content
export function SatelliteIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M13 7L9 3 3 9l4 4"/><path d="M17 11l4 4-6 6-4-4"/><path d="M8 12l4 4"/><path d="M7 17a5 5 0 01-5-5"/><path d="M2 22l5-5"/></svg>); }
export function SparklesIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>); }
export function WarningIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>); }
export function ClockIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>); }
export function KeyIcon(p: IconProps = {}) { return svg(p, 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.78 7.78 5.5 5.5 0 017.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4'); }
export function EyeIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>); }
export function EyeOffIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 01-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>); }
export function StarIcon(p: IconProps = {}) { return svg(p, 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'); }
export function CheckIcon(p: IconProps = {}) { return svg(p, 'M20 6L9 17l-5-5'); }
export function ArrowRightIcon(p: IconProps = {}) { return svg(p, 'M5 12h14M12 5l7 7-7 7'); }
export function DocumentIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>); }
export function GlobeIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>); }
export function MicroscopeIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 100-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 01-2-2V6h6v4a2 2 0 01-2 2z"/><path d="M12 6V3a1 1 0 00-1-1H9a1 1 0 00-1 1v3"/></svg>); }
export function BuildingIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"/></svg>); }
export function TargetIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>); }
export function DollarIcon(p: IconProps = {}) { return svg(p, 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'); }
export function ChartIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>); }
export function UsersIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>); }
export function MapIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>); }
export function HammerIcon(p: IconProps = {}) { return svg(p, 'M15 12l-8.5 8.5a2.12 2.12 0 01-3-3L12 9M17.64 4.36a2 2 0 013 3L15 13'); }
export function FactoryIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M2 20h20V8l-6 4V8l-6 4V4H2z"/></svg>); }
export function MegaphoneIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>); }
export function GridIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>); }
export function HourglassIcon(p: IconProps = {}) { return (<svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M5 2h14M5 22h14M12 12L7 4h10l-5 8zm0 0l5 8H7l5-8z"/></svg>); }

// Category icons - simple colored circles with first letter
export function CategoryIcon({ letter, className }: { letter: string; className?: string }) {
  return <span className={cn('font-semibold text-sm', className)}>{letter}</span>;
}
