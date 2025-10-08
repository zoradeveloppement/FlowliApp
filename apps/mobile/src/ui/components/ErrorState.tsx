import React from 'react';
import { View, Text } from 'react-native';
import { Card, Button } from './';
import { BaseComponentProps } from '../types';

interface ErrorStateProps extends BaseComponentProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Erreur',
  message,
  onRetry,
  retryLabel = 'Réessayer',
  className = '',
}) => {
  return (
    <Card className={`items-center py-8 ${className}`}>
      <Text className="text-4xl mb-4">❌</Text>
      <Text className="text-h2 text-danger mb-2">{title}</Text>
      <Text className="text-body text-textMuted text-center mb-6">
        {message}
      </Text>
      {onRetry && (
        <Button
          title={retryLabel}
          variant="primary"
          onPress={onRetry}
        />
      )}
    </Card>
  );
};
