import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface TopBarProps {
  title?: string;
  onLogout?: () => void;
  showProfile?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  title = 'Flowli',
  onLogout,
  showProfile = true,
}) => {
  const { isWeb } = useTheme();

  if (!isWeb) return null;

  return (
    <View className="bg-white border-b border-gray-200 px-6 py-4 flex-row items-center justify-between">
      <Text className="text-h1 text-primary font-poppins font-semibold">
        {title}
      </Text>
      
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
