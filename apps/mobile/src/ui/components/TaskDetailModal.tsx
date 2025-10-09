import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Badge, Button, Progress } from './index';
import { TaskItem } from '../../api/parseTasks';

interface TaskDetailModalProps {
  visible: boolean;
  task: TaskItem | null;
  onClose: () => void;
  onMarkComplete?: (taskId: string) => void;
  onMarkInProgress?: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  visible,
  task,
  onClose,
  onMarkComplete,
  onMarkInProgress,
}) => {
  if (!task) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Aucune date';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terminé':
        return '#10B981';
      case 'En cours':
        return '#7C3AED';
      case 'En retard':
        return '#EF4444';
      case 'A faire':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Terminé':
        return '✅';
      case 'En cours':
        return '🔄';
      case 'En retard':
        return '⚠️';
      case 'A faire':
        return '📋';
      default:
        return '📋';
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task.status !== 'Terminé';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-bgGray">
        {/* Header avec gradient violet Flowli */}
        <LinearGradient
          colors={['#7C3AED', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-12 pb-6 px-6"
        >
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            >
              <Text className="text-white text-lg font-bold">✕</Text>
            </TouchableOpacity>
            
            <View className="flex-row gap-2">
              {task.status === 'A faire' && onMarkInProgress && (
                <TouchableOpacity
                  onPress={() => onMarkInProgress(task.id)}
                  className="px-4 py-2 rounded-full bg-white/20"
                >
                  <Text className="text-white text-sm font-semibold">Commencer</Text>
                </TouchableOpacity>
              )}
              {task.status === 'En cours' && onMarkComplete && (
                <TouchableOpacity
                  onPress={() => onMarkComplete(task.id)}
                  className="px-4 py-2 rounded-full bg-white"
                >
                  <Text className="text-primary text-sm font-semibold">Terminer</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View className="flex-row items-center gap-3 mb-4">
            <Text className="text-3xl">{getStatusIcon(task.status)}</Text>
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold mb-1">
                {task.title || '(Sans titre)'}
              </Text>
              <View className="flex-row items-center gap-2">
                <View 
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <Text className="text-white text-sm font-medium">{task.status}</Text>
                </View>
                {isOverdue(task.dueDate) && (
                  <View className="px-3 py-1 rounded-full bg-red-500">
                    <Text className="text-white text-sm font-medium">En retard</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </LinearGradient>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Informations principales */}
          <Card className="mb-6" padding="lg">
            <Text className="text-lg font-bold text-textMain mb-4">📋 Informations</Text>
            
            <View className="space-y-4">
              {/* Projet */}
              {task.projectName && (
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">🏗️</Text>
                  <View className="flex-1">
                    <Text className="text-sm text-textMuted mb-1">Projet</Text>
                    <Text className="text-base font-medium text-textMain">{task.projectName}</Text>
                  </View>
                </View>
              )}

              {/* Date d'échéance */}
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">📅</Text>
                <View className="flex-1">
                  <Text className="text-sm text-textMuted mb-1">Date d'échéance</Text>
                  <Text className={`text-base font-medium ${
                    isOverdue(task.dueDate) ? 'text-red-600' : 'text-textMain'
                  }`}>
                    {formatDate(task.dueDate)}
                  </Text>
                </View>
              </View>

              {/* ID de la tâche */}
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">🔑</Text>
                <View className="flex-1">
                  <Text className="text-sm text-textMuted mb-1">ID de la tâche</Text>
                  <Text className="text-base font-medium text-textMain font-mono">{task.id}</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Progression */}
          {task.progress !== null && (
            <Card className="mb-6" padding="lg">
              <Text className="text-lg font-bold text-textMain mb-4">📊 Progression</Text>
              
              <View className="space-y-4">
                <Progress 
                  value={task.progress <= 1 ? task.progress * 100 : task.progress}
                  height="lg"
                  showPercentage={true}
                />
                
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-textMuted">Avancement</Text>
                  <Text className="text-base font-bold text-primary">
                    {Math.round(task.progress <= 1 ? task.progress * 100 : task.progress)}%
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* Statut détaillé */}
          <Card className="mb-6" padding="lg">
            <Text className="text-lg font-bold text-textMain mb-4">📈 Statut</Text>
            
            <View className="flex-row items-center gap-4">
              <View 
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: `${getStatusColor(task.status)}20` }}
              >
                <Text className="text-2xl">{getStatusIcon(task.status)}</Text>
              </View>
              
              <View className="flex-1">
                <Text className="text-base font-semibold text-textMain mb-1">{task.status}</Text>
                <Text className="text-sm text-textMuted">
                  {task.status === 'Terminé' && 'Tâche terminée avec succès'}
                  {task.status === 'En cours' && 'Tâche en cours d\'exécution'}
                  {task.status === 'En retard' && 'Tâche en retard par rapport à l\'échéance'}
                  {task.status === 'A faire' && 'Tâche en attente de démarrage'}
                </Text>
              </View>
            </View>
          </Card>

          {/* Actions rapides */}
          <Card className="mb-6" padding="lg">
            <Text className="text-lg font-bold text-textMain mb-4">⚡ Actions</Text>
            
            <View className="space-y-3">
              {task.status === 'A faire' && (
                <Button
                  title="Commencer cette tâche"
                  variant="primary"
                  onPress={() => onMarkInProgress?.(task.id)}
                  className="w-full"
                />
              )}
              
              {task.status === 'En cours' && (
                <Button
                  title="Marquer comme terminé"
                  variant="primary"
                  onPress={() => onMarkComplete?.(task.id)}
                  className="w-full"
                />
              )}
              
              <Button
                title="Partager cette tâche"
                variant="ghost"
                onPress={() => {
                  // TODO: Implémenter le partage
                  console.log('Partager la tâche:', task.id);
                }}
                className="w-full"
              />
            </View>
          </Card>

          {/* Informations techniques (debug) */}
          {__DEV__ && (
            <Card className="mb-6" padding="lg">
              <Text className="text-lg font-bold text-textMain mb-4">🔧 Debug</Text>
              
              <View className="space-y-2">
                <Text className="text-sm text-textMuted">
                  <Text className="font-semibold">ID:</Text> {task.id}
                </Text>
                <Text className="text-sm text-textMuted">
                  <Text className="font-semibold">Projet ID:</Text> {task.projectId || 'N/A'}
                </Text>
                <Text className="text-sm text-textMuted">
                  <Text className="font-semibold">Progression brute:</Text> {task.progress}
                </Text>
                <Text className="text-sm text-textMuted">
                  <Text className="font-semibold">Date brute:</Text> {task.dueDate || 'N/A'}
                </Text>
              </View>
            </Card>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};
