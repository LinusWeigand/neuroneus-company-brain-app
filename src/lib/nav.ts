import { Atom, CalendarRange, House, Inbox, Layers, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = { to: string; label: string; Icon: LucideIcon };

/** Sidebar order and icons, matching the product mockups. */
export const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', Icon: House },
  { to: '/inbox', label: 'Inbox', Icon: Inbox },
  { to: '/goals', label: 'Goals & Tasks', Icon: Layers },
  { to: '/team', label: 'Team', Icon: Users },
  { to: '/calendar', label: 'Calendar', Icon: CalendarRange },
  { to: '/ora', label: 'Ora', Icon: Atom },
];

/** The product wordmark above the workspace name. This is branding, not
 *  customer data, so it is the one label here that stays in the bundle. */
export const PRODUCT_NAME = 'Orakis';
