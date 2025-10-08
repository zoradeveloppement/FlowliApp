import React from 'react';
import { View, Text } from 'react-native';
import { Card, Button } from './';
import { BaseComponentProps } from '../types';

interface EmptyStateProps extends BaseComponentProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <Card className={`items-center py-8 ${className}`}>
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-h2 text-textMain mb-2 text-center">{title}</Text>
      <Text className="text-body text-textMuted text-center mb-6">
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          variant="primary"
          onPress={onAction}
        />
      )}
    </Card>
  );
};
