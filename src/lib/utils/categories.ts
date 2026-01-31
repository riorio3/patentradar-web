import { CategoryConfig } from '@/types';

export const CATEGORIES: CategoryConfig[] = [
  { key: 'all', displayName: 'All Categories', shortName: 'All', icon: 'All', color: '#3B82F6', apiSlug: null },
  { key: 'aeronautics', displayName: 'Aeronautics', shortName: 'Aero', icon: 'Ae', color: '#06B6D4', apiSlug: 'aerospace' },
  { key: 'communications', displayName: 'Communications', shortName: 'Comms', icon: 'Co', color: '#A855F7', apiSlug: 'communications' },
  { key: 'electronics', displayName: 'Electronics', shortName: 'Electronics', icon: 'El', color: '#6366F1', apiSlug: 'electrical%20and%20electronics' },
  { key: 'environment', displayName: 'Environment', shortName: 'Enviro', icon: 'En', color: '#22C55E', apiSlug: 'environment' },
  { key: 'health', displayName: 'Health & Biotech', shortName: 'Health', icon: 'He', color: '#EF4444', apiSlug: 'health%20medicine%20and%20biotechnology' },
  { key: 'information', displayName: 'Software & IT', shortName: 'Software', icon: 'SW', color: '#14B8A6', apiSlug: 'information%20technology%20and%20software' },
  { key: 'instrumentation', displayName: 'Instrumentation', shortName: 'Instrum', icon: 'In', color: '#F97316', apiSlug: 'instrumentation' },
  { key: 'manufacturing', displayName: 'Manufacturing', shortName: 'Mfg', icon: 'Mf', color: '#92400E', apiSlug: 'manufacturing' },
  { key: 'materials', displayName: 'Materials', shortName: 'Materials', icon: 'Ma', color: '#34D399', apiSlug: 'materials%20and%20coatings' },
  { key: 'mechanical', displayName: 'Mechanical', shortName: 'Mech', icon: 'Me', color: '#6B7280', apiSlug: 'mechanical%20and%20fluid%20systems' },
  { key: 'optics', displayName: 'Optics', shortName: 'Optics', icon: 'Op', color: '#EC4899', apiSlug: 'optics' },
  { key: 'power', displayName: 'Power Generation and Storage', shortName: 'Power', icon: 'Pw', color: '#EAB308', apiSlug: 'power%20generation%20and%20storage' },
  { key: 'propulsion', displayName: 'Propulsion', shortName: 'Propulsion', icon: 'Pr', color: '#F97316', apiSlug: 'propulsion' },
  { key: 'robotics', displayName: 'Robotics', shortName: 'Robotics', icon: 'Ro', color: '#14B8A6', apiSlug: 'robotics%20automation%20and%20control' },
  { key: 'sensors', displayName: 'Sensors', shortName: 'Sensors', icon: 'Se', color: '#A855F7', apiSlug: 'sensors' },
];

export function getCategoryIcon(category: string): string {
  const cat = category.toLowerCase();
  const match = CATEGORIES.find(c =>
    c.key !== 'all' && cat.includes(c.key.slice(0, 4))
  );
  return match?.shortName?.slice(0, 2) ?? 'Pa';
}
