import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Badge, Button, Progress } from './index';
import { AppIcon } from '@/src/ui/icons/AppIcon';
import { Task } from '../../api/parseTasks';
import { tokens } from '@/src/theme/tokens';

interface TaskDetailModalProps {
  visible: boolean;
  task: Task | null;
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

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'Terminé':
        return <AppIcon name="check" size={16} variant="success" />;
      case 'En cours':
        return <AppIcon name="clock" size={16} variant="primary" />;
      case 'En retard':
        return <AppIcon name="x" size={16} color="#EF4444" />;
      case 'A faire':
        return <AppIcon name="calendar" size={16} variant="muted" />;
      default:
        return <AppIcon name="calendar" size={16} variant="muted" />;
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
      <View className="flex-1 bg-white" style={styles.container}>
        {/* Header simplifié blanc */}
        <View className="pt-12 pb-6 px-6 bg-white border-b border-gray-100" style={styles.header}>
          {/* Bouton fermer */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-12 left-6 w-10 h-10 items-center justify-center"
            style={styles.closeButton}
          >
            <Text className="text-gray-900 text-xl" style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          {/* Titre de la tâche */}
          <View className="mt-12" style={styles.titleContainer}>
            <Text className="text-gray-900 text-2xl font-bold mb-3 leading-tight" style={styles.taskTitle}>
              {task.title || '(Sans titre)'}
            </Text>
            
            {/* Badge de statut */}
            <View 
              className="px-3 py-1.5 rounded-full self-start"
              style={[styles.statusBadge, { backgroundColor: `${getStatusColor(task.status)}15` }]}
            >
              <View className="flex-row items-center">
                <View style={{ marginRight: 6 }}>{renderStatusIcon(task.status)}</View>
                <Text 
                  className="text-sm font-semibold"
                  style={[styles.statusText, { color: getStatusColor(task.status) }]}
                >
                  {task.status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6 bg-gray-50" showsVerticalScrollIndicator={false}>
          {/* Informations principales */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm" style={styles.infoCard}>
            <Text className="text-base font-bold text-gray-900 mb-4" style={styles.sectionTitle}>Informations</Text>
            
            <View className="space-y-4">
              {/* Projet */}
              {task.projectName && (
                <View style={styles.infoItem}>
                  <Text className="text-sm text-gray-600 mb-1 font-medium" style={styles.infoLabel}>Projet</Text>
                  <Text className="text-base font-semibold text-gray-900" style={styles.infoValue}>{task.projectName}</Text>
                </View>
              )}

              {/* Date d'échéance */}
              {task.dueDate && (
                <View style={styles.infoItem}>
                  <Text className="text-sm text-gray-600 mb-1 font-medium" style={styles.infoLabel}>Date d'échéance</Text>
                  <Text 
                    className={`text-base font-semibold ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-900'}`}
                    style={styles.infoValue}
                  >
                    {formatDate(task.dueDate)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Progression */}
          {task.progress !== null && (
            <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm" style={styles.progressCard}>
              <Text className="text-base font-bold text-gray-900 mb-4" style={styles.sectionTitle}>Progression</Text>
              
              <View className="space-y-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-gray-600 font-medium" style={styles.progressLabel}>Avancement</Text>
                  <Text 
                    className="text-sm font-bold"
                    style={[styles.progressValue, { color: getStatusColor(task.status) }]}
                  >
                    {Math.round(task.progress <= 1 ? task.progress * 100 : task.progress)}%
                  </Text>
                </View>
                
                {/* Barre de progression */}
                <View className="bg-gray-200 rounded-full h-2 overflow-hidden" style={styles.progressBarContainer}>
                  <View 
                    className="h-full rounded-full"
                    style={[
                      styles.progressBar,
                      { 
                        width: `${Math.round(task.progress <= 1 ? task.progress * 100 : task.progress)}%`,
                        backgroundColor: getStatusColor(task.status)
                      }
                    ]}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Actions */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm" style={styles.actionsCard}>
            <Text className="text-base font-bold text-gray-900 mb-4" style={styles.sectionTitle}>Actions</Text>
            
            <View className="space-y-3">
              {task.status === 'A faire' && onMarkInProgress && (
                <TouchableOpacity
                  onPress={() => onMarkInProgress(task.id)}
                  className="w-full py-3.5 px-5 rounded-xl bg-primary shadow-sm"
                  style={styles.primaryActionButton}
                >
                  <Text className="text-white text-base font-semibold text-center" style={styles.primaryActionText}>
                    Commencer cette tâche
                  </Text>
                </TouchableOpacity>
              )}
              
              {task.status === 'En cours' && onMarkComplete && (
                <TouchableOpacity
                  onPress={() => onMarkComplete(task.id)}
                  className="w-full py-3.5 px-5 rounded-xl bg-primary shadow-sm"
                  style={styles.primaryActionButton}
                >
                  <Text className="text-white text-base font-semibold text-center" style={styles.primaryActionText}>
                    Marquer comme terminé
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Informations techniques (debug) - Style Flowli */}
          {__DEV__ && (
            <View className="bg-yellow-50 rounded-2xl p-6 mb-6 border border-yellow-200 shadow-sm" style={styles.debugCard}>
              <View className="flex-row items-center gap-3 mb-5">
                <Text className="text-2xl">🔧</Text>
                <Text className="text-lg font-bold text-yellow-800" style={styles.sectionTitle}>Debug</Text>
              </View>
              
              <View className="space-y-3">
                <View className="flex-row justify-between items-center p-3 bg-yellow-100 rounded-lg">
                  <Text className="text-sm font-semibold text-yellow-800">ID:</Text>
                  <Text className="text-sm text-yellow-700 font-mono">{task.id}</Text>
                </View>
                <View className="flex-row justify-between items-center p-3 bg-yellow-100 rounded-lg">
                  <Text className="text-sm font-semibold text-yellow-800">Projet ID:</Text>
                  <Text className="text-sm text-yellow-700">{task.projectId || 'N/A'}</Text>
                </View>
                <View className="flex-row justify-between items-center p-3 bg-yellow-100 rounded-lg">
                  <Text className="text-sm font-semibold text-yellow-800">Progression brute:</Text>
                  <Text className="text-sm text-yellow-700">{task.progress}</Text>
                </View>
                <View className="flex-row justify-between items-center p-3 bg-yellow-100 rounded-lg">
                  <Text className="text-sm font-semibold text-yellow-800">Date brute:</Text>
                  <Text className="text-sm text-yellow-700">{task.dueDate || 'N/A'}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

// Styles harmonisés avec la DA de l'onboarding
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.backgroundLight,
  },
  header: {
    paddingTop: tokens.spacing[12],
    paddingBottom: tokens.spacing[6],
    paddingHorizontal: tokens.spacing[6],
    backgroundColor: tokens.colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.borderLight,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: tokens.colors.foregroundLight,
    fontSize: tokens.font.sizes.lg,
  },
  titleContainer: {
    marginTop: tokens.spacing[12],
  },
  taskTitle: {
    color: tokens.colors.foregroundLight,
    fontSize: tokens.font.sizes.xl,
    fontWeight: tokens.font.weights.bold,
    marginBottom: tokens.spacing[3],
    lineHeight: 32,
  },
  statusBadge: {
    paddingHorizontal: tokens.spacing[3],
    paddingVertical: tokens.spacing[1] + 2,
    borderRadius: tokens.radius.full,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: tokens.font.sizes.sm,
    fontWeight: tokens.font.weights.semibold,
  },
  infoCard: {
    backgroundColor: tokens.colors.backgroundLight,
    borderRadius: tokens.radius['2xl'],
    padding: tokens.spacing[6],
    marginBottom: tokens.spacing[4],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  progressCard: {
    backgroundColor: tokens.colors.backgroundLight,
    borderRadius: tokens.radius['2xl'],
    padding: tokens.spacing[6],
    marginBottom: tokens.spacing[4],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionsCard: {
    backgroundColor: tokens.colors.backgroundLight,
    borderRadius: tokens.radius['2xl'],
    padding: tokens.spacing[6],
    marginBottom: tokens.spacing[4],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  debugCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: tokens.radius['2xl'],
    padding: tokens.spacing[6],
    marginBottom: tokens.spacing[6],
    borderWidth: 1,
    borderColor: '#FDE68A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: tokens.font.sizes.md,
    fontWeight: tokens.font.weights.bold,
    color: tokens.colors.foregroundLight,
  },
  infoItem: {
    marginBottom: tokens.spacing[4],
  },
  infoLabel: {
    fontSize: tokens.font.sizes.sm,
    color: tokens.colors.mutedForegroundLight,
    fontWeight: tokens.font.weights.medium,
    marginBottom: tokens.spacing[1],
  },
  infoValue: {
    fontSize: tokens.font.sizes.md,
    color: tokens.colors.foregroundLight,
    fontWeight: tokens.font.weights.semibold,
  },
  progressBarContainer: {
    backgroundColor: tokens.colors.borderLight,
    borderRadius: tokens.radius.lg,
    height: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: tokens.radius.lg,
  },
  progressLabel: {
    fontSize: tokens.font.sizes.sm,
    color: tokens.colors.mutedForegroundLight,
    fontWeight: tokens.font.weights.medium,
  },
  progressValue: {
    fontSize: tokens.font.sizes.sm,
    fontWeight: tokens.font.weights.bold,
  },
  primaryActionButton: {
    backgroundColor: tokens.colors.primary,
    paddingVertical: tokens.spacing[3] + 2,
    paddingHorizontal: tokens.spacing[6],
    borderRadius: tokens.radius.xl,
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryActionText: {
    color: tokens.colors.primaryForeground,
    fontSize: tokens.font.sizes.md,
    fontWeight: tokens.font.weights.semibold,
    textAlign: 'center',
  },
});
