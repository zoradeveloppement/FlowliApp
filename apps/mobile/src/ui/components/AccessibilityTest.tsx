import React from 'react';
import { View, Text } from 'react-native';
import { Card, Button } from './';
import { useAccessibility } from '../hooks';

export const AccessibilityTest: React.FC = () => {
  const { 
    createButtonProps, 
    createHeadingProps, 
    announceToScreenReader,
    generateAccessibilityId 
  } = useAccessibility();

  const handleTestAnnouncement = () => {
    announceToScreenReader('Test d\'annonce pour le lecteur d\'écran');
  };

  return (
    <Card className="p-4">
      <Text 
        {...createHeadingProps(1, 'Test d\'accessibilité')}
        className="text-h1 text-textMain mb-4"
      >
        Test d'accessibilité
      </Text>
      
      <Text className="text-body text-textMuted mb-4">
        Ce composant teste les fonctionnalités d'accessibilité de l'application.
      </Text>
      
      <Button
        title="Tester l'annonce"
        variant="primary"
        onPress={handleTestAnnouncement}
        {...createButtonProps({
          label: 'Tester l\'annonce pour le lecteur d\'écran',
          hint: 'Cliquez pour tester l\'annonce d\'accessibilité',
        })}
        className="mb-3"
      />
      
      <Button
        title="Bouton secondaire"
        variant="secondary"
        onPress={() => {}}
        {...createButtonProps({
          label: 'Bouton secondaire',
          hint: 'Bouton d\'action secondaire',
        })}
      />
    </Card>
  );
};
