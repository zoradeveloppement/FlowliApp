import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const TailwindTest: React.FC = () => {
  return (
    <View className="flex-1 bg-bgGray p-4">
      {/* Header avec style Flowli */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-textMain mb-2">
          Test <Text className="text-primary">NativeWind</Text>
        </Text>
        <Text className="text-secondary text-sm">
          Vérification de la cohérence mobile/web
        </Text>
      </View>

      {/* Cards avec style Flowli */}
      <View className="space-y-4">
        {/* Card 1 - Style Flowli */}
        <View className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card">
          <Text className="text-lg font-semibold text-textMain mb-2">
            Card avec style Flowli
          </Text>
          <Text className="text-secondary mb-4">
            Cette card utilise les couleurs et styles de votre charte graphique
          </Text>
          
          <View className="flex-row gap-3">
            <TouchableOpacity className="bg-primary px-4 py-2 rounded-full shadow-button">
              <Text className="text-white font-medium">Bouton Principal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-white border border-primary px-4 py-2 rounded-full">
              <Text className="text-primary font-medium">Bouton Secondaire</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2 - Badges */}
        <View className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card">
          <Text className="text-lg font-semibold text-textMain mb-4">
            Badges de statut
          </Text>
          
          <View className="flex-row flex-wrap gap-2">
            <View className="bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <Text className="text-green-800 text-xs font-medium">Terminé</Text>
            </View>
            
            <View className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              <Text className="text-blue-800 text-xs font-medium">En cours</Text>
            </View>
            
            <View className="bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              <Text className="text-purple-800 text-xs font-medium">À faire</Text>
            </View>
            
            <View className="bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              <Text className="text-orange-800 text-xs font-medium">En retard</Text>
            </View>
          </View>
        </View>

        {/* Card 3 - Inputs */}
        <View className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card">
          <Text className="text-lg font-semibold text-textMain mb-4">
            Champs de saisie
          </Text>
          
          <View className="space-y-3">
            <View>
              <Text className="text-sm font-medium text-textMain mb-1">Email</Text>
              <View className="border border-gray-200 rounded-lg p-3 bg-bgGray">
                <Text className="text-secondary">louis@flowli.com</Text>
              </View>
            </View>
            
            <View>
              <Text className="text-sm font-medium text-textMain mb-1">Message</Text>
              <View className="border border-gray-200 rounded-lg p-3 bg-bgGray min-h-[80px]">
                <Text className="text-secondary">Votre message ici...</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
