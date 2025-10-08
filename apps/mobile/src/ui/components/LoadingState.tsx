import React from 'react';
import { View } from 'react-native';
import { Skeleton } from './';
import { BaseComponentProps } from '../types';

interface LoadingStateProps extends BaseComponentProps {
  lines?: number;
  showHeader?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  lines = 3,
  showHeader = true,
  className = '',
}) => {
  return (
    <View className={`space-y-4 ${className}`}>
      {showHeader && <Skeleton width="60%" height={24} />}
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} width="100%" height={120} />
      ))}
    </View>
  );
};
