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
      <View className="flex-1 bg-bgGray" style={styles.container}>
        {/* Header avec gradient violet Flowli */}
        <LinearGradient
          colors={['#7C3AED', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-12 pb-6 px-6"
          style={styles.headerGradient}
        >
          <View className="flex-row items-center justify-between mb-4" style={styles.headerRow}>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              style={styles.closeButton}
            >
              <Text className="text-white text-lg font-bold" style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            <View className="flex-row gap-2" style={styles.headerActions}>
              {task.status === 'A faire' && onMarkInProgress && (
                <TouchableOpacity
                  onPress={() => onMarkInProgress(task.id)}
                  className="px-4 py-2 rounded-full bg-white/20"
                  style={styles.actionButton}
                >
                  <Text className="text-white text-sm font-semibold" style={styles.actionButtonText}>Commencer</Text>
                </TouchableOpacity>
              )}
              {task.status === 'En cours' && onMarkComplete && (
                <TouchableOpacity
                  onPress={() => onMarkComplete(task.id)}
                  className="px-4 py-2 rounded-full bg-white"
                  style={styles.actionButtonActive}
                >
                  <Text className="text-primary text-sm font-semibold" style={styles.actionButtonTextActive}>Terminer</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View className="flex-row items-center gap-3 mb-4" style={styles.titleRow}>
            <Text className="text-3xl" style={styles.statusIcon}>{getStatusIcon(task.status)}</Text>
            <View className="flex-1" style={styles.titleContainer}>
              <Text className="text-white text-2xl font-bold mb-1" style={styles.taskTitle}>
                {task.title || '(Sans titre)'}
              </Text>
              <View className="flex-row items-center gap-2" style={styles.statusRow}>
                <View 
                  className="px-3 py-1 rounded-full"
                  style={styles.statusBadge}
                >
                  <Text className="text-white text-sm font-medium" style={styles.statusText}>{task.status}</Text>
                </View>
                {isOverdue(task.dueDate) && (
                  <View className="px-3 py-1 rounded-full bg-red-500" style={styles.overdueBadge}>
                    <Text className="text-white text-sm font-medium" style={styles.overdueText}>En retard</Text>
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

// Styles de fallback pour Expo Go (quand NativeWind ne fonctionne pas)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  headerGradient: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonActive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonTextActive: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  statusIcon: {
    fontSize: 48,
  },
  titleContainer: {
    flex: 1,
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  overdueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#EF4444',
  },
  overdueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
