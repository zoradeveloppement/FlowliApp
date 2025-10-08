import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, Button } from './';
import { useResponsive } from '../hooks';

export const ResponsiveTest: React.FC = () => {
  const {
    deviceType,
    isLarge,
    isTablet,
    isMobile,
    maxContentWidth,
    horizontalPadding,
    verticalSpacing,
    gridColumns,
    showSidebar,
    showBottomTabs,
    getResponsiveClassName,
  } = useResponsive();

  return (
    <ScrollView className="flex-1">
      <Card className="p-4 mb-4">
        <Text className="text-h1 text-textMain mb-4">Test de responsivité</Text>
        
        <View className="space-y-3">
          <Text className="text-body text-textMain">
            Type d'appareil: <Text className="font-semibold">{deviceType}</Text>
          </Text>
          
          <Text className="text-body text-textMain">
            Écran large: <Text className="font-semibold">{isLarge ? 'Oui' : 'Non'}</Text>
          </Text>
          
          <Text className="text-body text-textMain">
            Tablette: <Text className="font-semibold">{isTablet ? 'Oui' : 'Non'}</Text>
          </Text>
          
          <Text className="text-body text-textMain">
            Mobile: <Text className="font-semibold">{isMobile ? 'Oui' : 'Non'}</Text>
          </Text>
          
          <Text className="text-body text-textMain">
            Largeur max contenu: <Text className="font-semibold">{maxContentWidth}px</Text>
          </Text>
          
          <Text className="text-body text-textMain">
            Padding horizontal: <Text className="font-semibold">{horizontalPadding}px</Text>
          </Text>
          
          <Text className="text-body text-textMain">
            Espacement vertical: <Text className="font-semibold">{verticalSpacing}px</Text>
          </Text>
          
          <Text className="text-body text-textMain">
            Colonnes grille: <Text className="font-semibold">{gridColumns}</Text>
          </Text>
          
          <Text className="text-body text-textMain">
            Afficher sidebar: <Text className="font-semibold">{showSidebar ? 'Oui' : 'Non'}</Text>
          </Text>
          
          <Text className="text-body text-textMain">
            Afficher bottom tabs: <Text className="font-semibold">{showBottomTabs ? 'Oui' : 'Non'}</Text>
          </Text>
        </View>
      </Card>
      
      {/* Test de grille responsive */}
      <View className={getResponsiveClassName({
        mobile: 'flex-col space-y-3',
        tablet: 'flex-row space-x-3',
        desktop: 'grid grid-cols-3 gap-4',
      })}>
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-3">
            <Text className="text-body text-textMain">Élément {i}</Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};
