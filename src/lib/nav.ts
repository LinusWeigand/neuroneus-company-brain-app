import { Atom, CalendarRange, FolderOpen, House, Inbox, Layers, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = { to: string; label: string; Icon: LucideIcon };

/** Sidebar order and icons, matching the product mockups. */
export const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', Icon: House },
  { to: '/inbox', label: 'Inbox', Icon: Inbox },
  { to: '/goals', label: 'Goals & Tasks', Icon: Layers },
  { to: '/team', label: 'Team', Icon: Users },
  { to: '/docs', label: 'Docs', Icon: FolderOpen },
  { to: '/calendar', label: 'Calendar', Icon: CalendarRange },
  { to: '/ora', label: 'Ora', Icon: Atom },
];

/** The signed-in user and workspace. Hard-coded until auth exists. */
export const WORKSPACE = { org: 'Orakis', name: 'Meridian' };
export const USER = { initials: 'AM', name: 'Alex Morgan', email: 'alex@meridian.co' };
