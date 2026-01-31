import { CategoryConfig } from '@/types';

export const CATEGORIES: CategoryConfig[] = [
  { key: 'all', displayName: 'All Categories', shortName: 'All', icon: '⊞', color: '#3B82F6', apiSlug: null },
  { key: 'aeronautics', displayName: 'Aeronautics', shortName: 'Aero', icon: '✈️', color: '#06B6D4', apiSlug: 'aerospace' },
  { key: 'communications', displayName: 'Communications', shortName: 'Comms', icon: '📡', color: '#A855F7', apiSlug: 'communications' },
  { key: 'electronics', displayName: 'Electronics', shortName: 'Electronics', icon: '🔌', color: '#6366F1', apiSlug: 'electrical%20and%20electronics' },
  { key: 'environment', displayName: 'Environment', shortName: 'Enviro', icon: '🌿', color: '#22C55E', apiSlug: 'environment' },
  { key: 'health', displayName: 'Health & Biotech', shortName: 'Health', icon: '❤️', color: '#EF4444', apiSlug: 'health%20medicine%20and%20biotechnology' },
  { key: 'information', displayName: 'Software & IT', shortName: 'Software', icon: '💻', color: '#14B8A6', apiSlug: 'information%20technology%20and%20software' },
  { key: 'instrumentation', displayName: 'Instrumentation', shortName: 'Instrum', icon: '🔬', color: '#F97316', apiSlug: 'instrumentation' },
  { key: 'manufacturing', displayName: 'Manufacturing', shortName: 'Mfg', icon: '🔨', color: '#92400E', apiSlug: 'manufacturing' },
  { key: 'materials', displayName: 'Materials', shortName: 'Materials', icon: '🧊', color: '#34D399', apiSlug: 'materials%20and%20coatings' },
  { key: 'mechanical', displayName: 'Mechanical', shortName: 'Mech', icon: '⚙️', color: '#6B7280', apiSlug: 'mechanical%20and%20fluid%20systems' },
  { key: 'optics', displayName: 'Optics', shortName: 'Optics', icon: '📷', color: '#EC4899', apiSlug: 'optics' },
  { key: 'power', displayName: 'Power Generation and Storage', shortName: 'Power', icon: '⚡', color: '#EAB308', apiSlug: 'power%20generation%20and%20storage' },
  { key: 'propulsion', displayName: 'Propulsion', shortName: 'Propulsion', icon: '🔥', color: '#F97316', apiSlug: 'propulsion' },
  { key: 'robotics', displayName: 'Robotics', shortName: 'Robotics', icon: '🤖', color: '#14B8A6', apiSlug: 'robotics%20automation%20and%20control' },
  { key: 'sensors', displayName: 'Sensors', shortName: 'Sensors', icon: '📶', color: '#A855F7', apiSlug: 'sensors' },
];

export function getCategoryIcon(category: string): string {
  const cat = category.toLowerCase();
  if (cat.includes('aeronautic')) return '✈️';
  if (cat.includes('propulsion')) return '🔥';
  if (cat.includes('material')) return '🧊';
  if (cat.includes('sensor')) return '📶';
  if (cat.includes('electronic')) return '🔌';
  if (cat.includes('software') || cat.includes('information')) return '💻';
  if (cat.includes('robotic')) return '🤖';
  if (cat.includes('optic')) return '📷';
  if (cat.includes('communication')) return '📡';
  if (cat.includes('environment')) return '🌿';
  if (cat.includes('health')) return '❤️';
  if (cat.includes('manufacturing')) return '🔨';
  if (cat.includes('power')) return '⚡';
  if (cat.includes('instrument')) return '🔬';
  if (cat.includes('mechanical')) return '⚙️';
  return '⭐';
}
