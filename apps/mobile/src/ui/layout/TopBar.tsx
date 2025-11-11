import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';

interface TopBarProps {
  title?: string;
  onLogout?: () => void;
  showProfile?: boolean;
  showBackButton?: boolean;
  projectName?: string;
  projectStatus?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  title = 'Flowli',
  onLogout,
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
    <View className="bg-white border-b border-gray-200 px-6 py-4 flex-row items-center justify-between">
      <View className="flex-row items-center gap-4 flex-1">
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBack}
            className="flex-row items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50"
            style={Platform.OS === 'web' ? {
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            } : undefined}
          >
            <Text style={{ fontSize: 18 }}>←</Text>
            <Text className="text-textMain font-medium">Retour aux projets</Text>
          </TouchableOpacity>
        )}
        
        {projectName && (
          <View className="flex-row items-center gap-3">
            <Text className="text-h2 text-textMain font-semibold">
              {projectName}
            </Text>
            {projectStatus && (
              <View
                className="px-3 py-1 rounded-full"
                style={[styles.statusBadge, { backgroundColor: getStatusBadgeStyle(projectStatus).backgroundColor }]}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: getStatusBadgeStyle(projectStatus).color }}
                >
                  {projectStatus}
                </Text>
              </View>
            )}
          </View>
        )}
        
        {!showBackButton && !projectName && (
          <Text className="text-h1 text-primary font-poppins font-semibold">
            {title}
          </Text>
        )}
      </View>
      
      {showProfile && (
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity
            className="px-4 py-2 border border-primary rounded-lg"
            onPress={onLogout}
            style={Platform.OS === 'web' ? {
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            } : undefined}
          >
            <Text className="text-primary font-medium">Déconnexion</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  statusBadge: {
    borderRadius: 9999,
  },
});
