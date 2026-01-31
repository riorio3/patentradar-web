import { CategoryConfig } from '@/types';
import {
  GridIcon, AirplaneIcon, AntennaIcon, CpuIcon, LeafIcon, HeartIcon,
  DesktopIcon, GaugeIcon, HammerIcon, CubeIcon, GearIcon, CameraIcon,
  BoltIcon, FlameIcon, GearDoubleIcon, SensorIcon,
} from '@/components/icons';

export const CATEGORIES: CategoryConfig[] = [
  { key: 'all', displayName: 'All Categories', shortName: 'All', icon: <GridIcon size={20} />, color: '#3B82F6', apiSlug: null },
  { key: 'aeronautics', displayName: 'Aeronautics', shortName: 'Aero', icon: <AirplaneIcon size={20} />, color: '#06B6D4', apiSlug: 'aerospace' },
  { key: 'communications', displayName: 'Communications', shortName: 'Comms', icon: <AntennaIcon size={20} />, color: '#A855F7', apiSlug: 'communications' },
  { key: 'electronics', displayName: 'Electronics', shortName: 'Electronics', icon: <CpuIcon size={20} />, color: '#6366F1', apiSlug: 'electrical%20and%20electronics' },
  { key: 'environment', displayName: 'Environment', shortName: 'Enviro', icon: <LeafIcon size={20} />, color: '#22C55E', apiSlug: 'environment' },
  { key: 'health', displayName: 'Health & Biotech', shortName: 'Health', icon: <HeartIcon size={20} />, color: '#EF4444', apiSlug: 'health%20medicine%20and%20biotechnology' },
  { key: 'information', displayName: 'Software & IT', shortName: 'Software', icon: <DesktopIcon size={20} />, color: '#14B8A6', apiSlug: 'information%20technology%20and%20software' },
  { key: 'instrumentation', displayName: 'Instrumentation', shortName: 'Instrum', icon: <GaugeIcon size={20} />, color: '#F97316', apiSlug: 'instrumentation' },
  { key: 'manufacturing', displayName: 'Manufacturing', shortName: 'Mfg', icon: <HammerIcon size={20} />, color: '#92400E', apiSlug: 'manufacturing' },
  { key: 'materials', displayName: 'Materials', shortName: 'Materials', icon: <CubeIcon size={20} />, color: '#34D399', apiSlug: 'materials%20and%20coatings' },
  { key: 'mechanical', displayName: 'Mechanical', shortName: 'Mech', icon: <GearIcon size={20} />, color: '#6B7280', apiSlug: 'mechanical%20and%20fluid%20systems' },
  { key: 'optics', displayName: 'Optics', shortName: 'Optics', icon: <CameraIcon size={20} />, color: '#EC4899', apiSlug: 'optics' },
  { key: 'power', displayName: 'Power Generation and Storage', shortName: 'Power', icon: <BoltIcon size={20} />, color: '#EAB308', apiSlug: 'power%20generation%20and%20storage' },
  { key: 'propulsion', displayName: 'Propulsion', shortName: 'Propulsion', icon: <FlameIcon size={20} />, color: '#F97316', apiSlug: 'propulsion' },
  { key: 'robotics', displayName: 'Robotics', shortName: 'Robotics', icon: <GearDoubleIcon size={20} />, color: '#14B8A6', apiSlug: 'robotics%20automation%20and%20control' },
  { key: 'sensors', displayName: 'Sensors', shortName: 'Sensors', icon: <SensorIcon size={20} />, color: '#A855F7', apiSlug: 'sensors' },
];
