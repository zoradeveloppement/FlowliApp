import React from 'react';
import * as L from 'lucide-react-native';
import { ColorValue, useColorScheme } from 'react-native';

type Name =
  | 'check' | 'bell' | 'mail' | 'search' | 'shield' | 'calendar'
  | 'clock' | 'refreshCw' | 'logOut' | 'x' | 'arrowRight' | 'user'
  | 'home' | 'receipt' | 'phone' | 'building' | 'map-pin' | 'wrench' | 'chevronRight'
  | 'logIn' | 'calendarClock' | 'userRound' | 'receiptText'
  | 'chevronUp' | 'chevronDown' | 'inbox';

const map: Record<Name, React.ComponentType<L.LucideProps>> = {
  check: L.Check,
  bell: L.Bell,
  mail: L.Mail,
  search: L.Search,
  shield: L.Shield,
  calendar: L.Calendar,
  clock: L.Clock,
  refreshCw: L.RefreshCw,
  logOut: L.LogOut,
  x: L.X,
  arrowRight: L.ArrowRight,
  user: L.User,
  home: L.Home,
  receipt: L.Receipt,
  phone: L.Phone,
  building: L.Building,
  'map-pin': L.MapPin,
  wrench: L.Wrench,
  chevronRight: L.ChevronRight,
  logIn: L.LogIn,
  calendarClock: L.CalendarClock,
  userRound: L.UserRound,
  receiptText: L.ReceiptText,
  chevronUp: L.ChevronUp,
  chevronDown: L.ChevronDown,
  inbox: L.Inbox,
};

const variants: Record<string, ColorValue> = {
  default: '#111827',
  primary: '#7C3AED',
  muted: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  destructive: '#F43F5E',
};

const darkVariants: Record<string, ColorValue> = {
  default: '#F9FAFB',
  primary: '#A78BFA',
  muted: '#9CA3AF',
  success: '#34D399',
  warning: '#FBBF24',
  destructive: '#FB7185',
};

export type AppIconProps = {
  name: Name;
  size?: number;
  color?: ColorValue;
  variant?: keyof typeof variants;
  strokeWidth?: number;
  style?: any;
  themeAware?: boolean;
};

export function AppIcon({
  name, size = 20, color, variant = 'default', strokeWidth = 2, style, themeAware = true,
}: AppIconProps) {
  const Cmp = map[name];
  const colorScheme = useColorScheme();
  
  let c = color;
  if (!c && themeAware) {
    c = colorScheme === 'dark' ? darkVariants[variant] : variants[variant];
  } else if (!c) {
    c = variants[variant];
  }
  
  return <Cmp size={size} color={c} strokeWidth={strokeWidth} style={style} />;
}

export default AppIcon;


