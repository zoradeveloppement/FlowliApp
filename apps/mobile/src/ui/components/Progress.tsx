import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BaseComponentProps } from '../types';

interface ProgressProps extends BaseComponentProps {
  value: number; // 0-100
  showPercentage?: boolean;
  height?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  showPercentage = true,
  height = 'md',
  animated = true,
  className = '',
}) => {
  const getHeightClasses = () => {
    switch (height) {
      case 'sm':
        return 'h-1';
      case 'md':
        return 'h-2';
      case 'lg':
        return 'h-3';
      default:
        return 'h-2';
    }
  };

  const clampedValue = Math.max(0, Math.min(100, value));
  const progressWidth = `${clampedValue}%`;

  return (
    <View className={`${className}`}>
      <View className={`bg-gray-200 rounded-full overflow-hidden ${getHeightClasses()}`}>
        <LinearGradient
          colors={['#6C63FF', '#B3B0FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-full rounded-full"
          style={{
            width: progressWidth,
            transition: animated ? 'width 0.3s ease-in-out' : 'none',
          }}
        />
      </View>
      
      {showPercentage && (
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-secondary text-textMuted">
            Progression
          </Text>
          <Text className="text-body text-textMain font-medium">
            {Math.round(clampedValue)}%
          </Text>
        </View>
      )}
    </View>
  );
};
