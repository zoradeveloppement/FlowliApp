/**
 * AppIcon - Centralized icon component using Lucide React Native
 */
import React from 'react';
import {
  Calendar,
  Check,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Menu,
  X,
  ChevronDown,
  User,
  Search,
} from 'lucide-react-native';
import { useTheme } from '../../ui/theme/ThemeProvider';

export const iconMap = {
  calendar: Calendar,
  check: Check,
  checkCircle: CheckCircle,
  clock: Clock,
  trendingUp: TrendingUp,
  shield: Shield,
  zap: Zap,
  menu: Menu,
  x: X,
  chevronDown: ChevronDown,
  user: User,
  search: Search,
} as const;

export type IconName = keyof typeof iconMap;

export interface AppIconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ 
  name, 
  size = 24, 
  color, 
  strokeWidth = 2,
}) => {
  const { colors } = useTheme();
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }
  
  return (
    <IconComponent 
      size={size} 
      color={color || colors.foreground}
      strokeWidth={strokeWidth}
    />
  );
};

