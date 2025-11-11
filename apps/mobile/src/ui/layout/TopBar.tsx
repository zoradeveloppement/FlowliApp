import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';

interface TopBarProps {
  title?: string;
  onLogout?: () => void;
  onRefresh?: () => void;
  showProfile?: boolean;
  showBackButton?: boolean;
  projectName?: string;
  projectStatus?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  title = 'Flowli',
  onLogout,
  onRefresh,
  showProfile = true,
  showBackButton = false,
  projectName,
  projectStatus,
}) => {
  const { isWeb } = useTheme();
  const router = useRouter();

  if (!isWeb) return null;

  const handleBack = () => {
    router.push('/home');
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Terminé':
        return { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' };
      case 'En cours':
        return { backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' };
      case 'En retard':
        return { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' };
      case 'À faire':
        return { backgroundColor: 'rgba(107, 114, 128, 0.1)', color: '#6B7280' };
      default:
        return { backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
            {...(Platform.OS === 'web' ? {
              onMouseEnter: (e: any) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
              },
              onMouseLeave: (e: any) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              },
            } : {})}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Retour aux projets</Text>
          </TouchableOpacity>
        )}
        
        {projectName && (
          <View style={styles.projectSection}>
            <Text style={styles.projectName}>
              {projectName}
            </Text>
            {projectStatus && (
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusBadgeStyle(projectStatus).backgroundColor }
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusBadgeStyle(projectStatus).color }
                  ]}
                >
                  {projectStatus}
                </Text>
              </View>
            )}
          </View>
        )}
        
        {!showBackButton && !projectName && (
          <Text style={styles.title}>
            {title}
          </Text>
        )}
      </View>
      
      {Platform.OS === 'web' && (
        <View style={styles.rightSection}>
          {onRefresh && (
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={onRefresh}
              activeOpacity={0.7}
              {...(Platform.OS === 'web' ? {
                onMouseEnter: (e: any) => {
                  e.currentTarget.style.backgroundColor = '#F5F3FF';
                },
                onMouseLeave: (e: any) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                },
              } : {})}
            >
              <Text style={styles.refreshButtonText}>↻</Text>
            </TouchableOpacity>
          )}
          {onLogout && (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={onLogout}
              activeOpacity={0.7}
              {...(Platform.OS === 'web' ? {
                onMouseEnter: (e: any) => {
                  e.currentTarget.style.backgroundColor = '#FEF2F2';
                },
                onMouseLeave: (e: any) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                },
              } : {})}
            >
              <Text style={styles.logoutText}>Déco</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    } : {}),
  },
  backArrow: {
    fontSize: 18,
    color: '#111827',
  },
  backText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  projectSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  projectName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#7C3AED',
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : undefined,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  refreshButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    } : {}),
  },
  refreshButtonText: {
    color: '#7C3AED',
    fontWeight: '600',
    fontSize: 18,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    } : {}),
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 14,
  },
});
