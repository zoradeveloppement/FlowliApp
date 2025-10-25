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
          {/* Légende */}
          <View style={styles.legendContainer}>
            <Text style={styles.legendText}>Détail de la tâche</Text>
          </View>
          
          {/* Bouton fermer */}
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          {/* Titre de la tâche */}
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.taskTitle}>
                {task.title || '(Sans titre)'}
              </Text>
              
              {/* Badge de statut */}
              <View 
                style={[styles.statusBadge, { backgroundColor: `${getStatusColor(task.status)}15` }]}
              >
                <View style={styles.statusBadgeContent}>
                  <View style={{ marginRight: 6 }}>{renderStatusIcon(task.status)}</View>
                  <Text 
                    style={[styles.statusText, { color: getStatusColor(task.status) }]}
                  >
                    {task.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6 bg-gray-50" showsVerticalScrollIndicator={false}>
          {/* Informations principales */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm" style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Informations</Text>
            
            <View className="space-y-4">
              {/* Projet */}
              {task.projectName && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Projet</Text>
                  <Text style={styles.infoValue}>{task.projectName}</Text>
                </View>
              )}

              {/* Date d'échéance */}
              {task.dueDate && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Date d'échéance</Text>
                  <Text 
                    style={[
                      styles.infoValue,
                      isOverdue(task.dueDate) && { color: '#EF4444' }
                    ]}
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
              <Text style={styles.sectionTitle}>Progression</Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Avancement</Text>
                  <Text 
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
            <Text style={styles.sectionTitle}>Actions</Text>
            
            <View style={styles.actionsContainer}>
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
    position: 'absolute',
    top: 44,
    right: tokens.spacing[6],
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 20,
  },
  closeButtonText: {
    color: tokens.colors.foregroundLight,
    fontSize: tokens.font.sizes.lg,
  },
  legendContainer: {
    alignItems: 'center',
    marginBottom: tokens.spacing[2],
  },
  legendText: {
    fontSize: tokens.font.sizes.sm,
    color: tokens.colors.mutedForegroundLight,
    fontWeight: tokens.font.weights.medium,
  },
  titleContainer: {
    marginTop: tokens.spacing[12],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: tokens.spacing[4],
  },
  taskTitle: {
    color: tokens.colors.foregroundLight,
    fontSize: tokens.font.sizes.xl,
    fontWeight: tokens.font.weights.bold,
    lineHeight: 32,
    flex: 1,
    marginRight: tokens.spacing[3],
  },
  statusBadge: {
    paddingHorizontal: tokens.spacing[3],
    paddingVertical: tokens.spacing[1] + 2,
    borderRadius: tokens.radius.full,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  statusBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  sectionTitle: {
    fontSize: tokens.font.sizes.md,
    fontWeight: tokens.font.weights.bold,
    color: tokens.colors.foregroundLight,
    marginBottom: 20,
    lineHeight: 24,
  },
  infoItem: {
    marginBottom: tokens.spacing[6],
  },
  infoLabel: {
    fontSize: tokens.font.sizes.sm,
    color: tokens.colors.mutedForegroundLight,
    fontWeight: tokens.font.weights.medium,
    marginBottom: tokens.spacing[3],
  },
  infoValue: {
    fontSize: tokens.font.sizes.md,
    color: tokens.colors.foregroundLight,
    fontWeight: tokens.font.weights.semibold,
    lineHeight: 24,
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
    lineHeight: 20,
  },
  progressContainer: {
    gap: tokens.spacing[4],
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  actionsContainer: {
    marginTop: tokens.spacing[2],
    gap: tokens.spacing[3],
  },
});
