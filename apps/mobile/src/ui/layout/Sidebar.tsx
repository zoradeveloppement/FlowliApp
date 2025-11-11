import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';
import { NotificationBadge } from '../components';
import { useNotificationStore } from '../store/notificationStore';
import { supabase } from '@/src/lib/supabase';
import { AppIcon } from '../icons/AppIcon';
import { LinearGradient } from 'expo-linear-gradient';

interface SidebarProps {
  onLogout?: () => void;
}

const navigationItems = [
  { name: 'Projets', href: '/home', iconName: 'home' as const },
  { name: 'Documents', href: '/documents', iconName: 'receipt' as const },
  { name: 'Facturation', href: '/factures', iconName: 'receiptText' as const },
  { name: 'Profil', href: '/profile', iconName: 'userRound' as const },
];

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isWeb } = useTheme();
  const { hasNewTasks, hasNewInvoices, hasNewMessages } = useNotificationStore();
  const [userInitial, setUserInitial] = useState<string>('F');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const getUserInitial = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const email = data.session?.user?.email;
        if (email) {
          // Prendre la première lettre de l'email en majuscule
          const initial = email.charAt(0).toUpperCase();
          setUserInitial(initial);
        }
      } catch (error) {
        console.error('Error getting user initial:', error);
      }
    };
    getUserInitial();
  }, []);

  if (!isWeb) return null;

  return (
    <View style={styles.sidebar}>
      {/* Avatar circulaire */}
      <View style={styles.avatarContainer}>
        <LinearGradient
          colors={['#A78BFA', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{userInitial}</Text>
        </LinearGradient>
      </View>

      {/* Titre de section */}
      <Text style={styles.sectionTitle}>Navigation</Text>

      {/* Liste des liens */}
      <View style={styles.navigationList}>
        {navigationItems.map((item) => {
          // Vérifier si la route est active
          const isActive = pathname === item.href || 
            (item.href === '/home' && (pathname === '/home' || pathname.startsWith('/projets')));
          const isFacturesTab = item.href === '/factures';
          
          // Déterminer s'il y a des notifications
          const hasNotifications = isFacturesTab && hasNewInvoices;
          
          return (
            <TouchableOpacity
              key={item.href}
              style={[
                styles.navItem,
                isActive && styles.navItemActive,
                hoveredItem === item.href && !isActive && styles.navItemHover,
                Platform.OS === 'web' && {
                  cursor: 'pointer',
                },
              ]}
              onPress={() => router.push(item.href)}
              activeOpacity={0.7}
              {...(Platform.OS === 'web' ? {
                onMouseEnter: () => setHoveredItem(item.href),
                onMouseLeave: () => setHoveredItem(null),
              } : {})}
            >
              {/* Highlight latéral gauche pour l'état actif */}
              {isActive && <View style={styles.activeIndicator} />}
              
              <View style={styles.navItemContent}>
                <View style={styles.iconContainer}>
                  <AppIcon 
                    name={item.iconName} 
                    size={18} 
                    variant={isActive ? 'primary' : 'muted'}
                    color={isActive ? '#8B5CF6' : '#6B7280'}
                  />
                  {hasNotifications && (
                    <View style={styles.badgeContainer}>
                      <NotificationBadge size="sm" />
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.navItemText,
                  isActive && styles.navItemTextActive
                ]}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    flexShrink: 0,
    backgroundColor: '#FFFFFF',
    paddingTop: 24,
    paddingHorizontal: 24,
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: '100%',
    ...(Platform.OS === 'web' ? {
      boxShadow: '1px 0 4px rgba(0, 0, 0, 0.04)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 0 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  avatarContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 0 12px rgba(139, 92, 246, 0.3)',
    } : {
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 4,
    }),
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : undefined,
  },
  sectionTitle: {
    marginTop: 32,
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  navigationList: {
    width: '100%',
    flex: 1,
  },
  navItem: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 8,
    borderRadius: 12,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  navItemHover: {
    backgroundColor: '#F9FAFB',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
  },
  navItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    position: 'relative',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  navItemText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : undefined,
  },
  navItemTextActive: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
});
