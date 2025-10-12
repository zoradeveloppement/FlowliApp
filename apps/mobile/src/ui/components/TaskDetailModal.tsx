import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Badge, Button, Progress } from './index';
import { Task } from '../../api/parseTasks';

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
        return '#6C63FF';
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
        {/* Header avec gradient violet Flowli - Style moderne */}
        <LinearGradient
          colors={['#6C63FF', '#7C3AED', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-12 pb-8 px-6"
          style={styles.headerGradient}
        >
          {/* Top bar avec actions */}
          <View className="flex-row items-center justify-between mb-6" style={styles.headerRow}>
            <TouchableOpacity
              onPress={onClose}
              className="w-12 h-12 rounded-full bg-white/20 items-center justify-center"
              style={styles.closeButton}
            >
              <Text className="text-white text-xl font-bold" style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            <View className="flex-row gap-3" style={styles.headerActions}>
              {task.status === 'A faire' && onMarkInProgress && (
                <TouchableOpacity
                  onPress={() => onMarkInProgress(task.id)}
                  className="px-5 py-3 rounded-full bg-white/20"
                  style={styles.actionButton}
                >
                  <Text className="text-white text-sm font-semibold" style={styles.actionButtonText}>Commencer</Text>
                </TouchableOpacity>
              )}
              {task.status === 'En cours' && onMarkComplete && (
                <TouchableOpacity
                  onPress={() => onMarkComplete(task.id)}
                  className="px-5 py-3 rounded-full bg-white shadow-lg"
                  style={styles.actionButtonActive}
                >
                  <Text className="text-primary text-sm font-semibold" style={styles.actionButtonTextActive}>Terminer</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Titre principal avec icône et statut */}
          <View className="flex-row items-start gap-4 mb-6" style={styles.titleRow}>
            <View 
              className="w-16 h-16 rounded-2xl items-center justify-center"
              style={styles.statusIconContainer}
            >
              <Text className="text-3xl" style={styles.statusIcon}>{getStatusIcon(task.status)}</Text>
            </View>
            
            <View className="flex-1" style={styles.titleContainer}>
              <Text className="text-white text-2xl font-bold mb-3 leading-tight" style={styles.taskTitle}>
                {task.title || '(Sans titre)'}
              </Text>
              
              <View className="flex-row items-center gap-3 flex-wrap" style={styles.statusRow}>
                <View 
                  className="px-4 py-2 rounded-full"
                  style={styles.statusBadge}
                >
                  <Text className="text-white text-sm font-semibold" style={styles.statusText}>{task.status}</Text>
                </View>
                
                {isOverdue(task.dueDate) && (
                  <View className="px-4 py-2 rounded-full bg-red-500 shadow-lg" style={styles.overdueBadge}>
                    <Text className="text-white text-sm font-semibold" style={styles.overdueText}>⚠️ En retard</Text>
                  </View>
                )}
                
                {task.progress !== null && (
                  <View className="px-4 py-2 rounded-full bg-white/20" style={styles.progressBadge}>
                    <Text className="text-white text-sm font-semibold" style={styles.progressText}>
                      {Math.round(task.progress <= 1 ? task.progress * 100 : task.progress)}%
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </LinearGradient>

        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          {/* Informations principales - Style Flowli */}
          <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm" style={styles.infoCard}>
            <View className="flex-row items-center gap-3 mb-5">
              <Text className="text-2xl">📋</Text>
              <Text className="text-lg font-bold text-textMain" style={styles.sectionTitle}>Informations</Text>
            </View>
            
            <View className="space-y-5">
              {/* Projet */}
              {task.projectName && (
                <View className="flex-row items-center gap-4 p-4 bg-gray-50 rounded-xl" style={styles.infoItem}>
                  <Text className="text-2xl">🏗️</Text>
                  <View className="flex-1">
                    <Text className="text-sm text-textMuted mb-1 font-medium" style={styles.infoLabel}>Projet</Text>
                    <Text className="text-base font-semibold text-textMain" style={styles.infoValue}>{task.projectName}</Text>
                  </View>
                </View>
              )}

              {/* Date d'échéance */}
              <View className={`flex-row items-center gap-4 p-4 rounded-xl ${
                isOverdue(task.dueDate) ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
              }`} style={styles.infoItem}>
                <Text className="text-2xl">📅</Text>
                <View className="flex-1">
                  <Text className="text-sm text-textMuted mb-1 font-medium" style={styles.infoLabel}>Date d'échéance</Text>
                  <Text className={`text-base font-semibold ${
                    isOverdue(task.dueDate) ? 'text-red-600' : 'text-textMain'
                  }`} style={styles.infoValue}>
                    {formatDate(task.dueDate)}
                  </Text>
                </View>
              </View>

              {/* ID de la tâche */}
              <View className="flex-row items-center gap-4 p-4 bg-gray-50 rounded-xl" style={styles.infoItem}>
                <Text className="text-2xl">🔑</Text>
                <View className="flex-1">
                  <Text className="text-sm text-textMuted mb-1 font-medium" style={styles.infoLabel}>ID de la tâche</Text>
                  <Text className="text-base font-medium text-textMain font-mono" style={styles.infoValue}>{task.id}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Progression - Style Flowli */}
          {task.progress !== null && (
            <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm" style={styles.progressCard}>
              <View className="flex-row items-center gap-3 mb-5">
                <Text className="text-2xl">📊</Text>
                <Text className="text-lg font-bold text-textMain" style={styles.sectionTitle}>Progression</Text>
              </View>
              
              <View className="space-y-5">
                {/* Barre de progression Flowli */}
                <View className="bg-gray-100 rounded-full h-3 overflow-hidden" style={styles.progressBarContainer}>
                  <View 
                    className="h-full rounded-full"
                    style={[
                      styles.progressBar,
                      { 
                        width: `${Math.round(task.progress <= 1 ? task.progress * 100 : task.progress)}%`,
                        backgroundColor: task.status === 'Terminé' ? '#10B981' : '#6C63FF'
                      }
                    ]}
                  />
                </View>
                
                <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <Text className="text-sm text-textMuted font-medium" style={styles.progressLabel}>Avancement</Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-2xl font-bold" style={{ color: '#6C63FF' }}>
                      {Math.round(task.progress <= 1 ? task.progress * 100 : task.progress)}%
                    </Text>
                    <View className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6C63FF' }} />
                  </View>
                </View>
              </View>
            </View>©
          )}

          {/* Statut détaillé - Style Flowli */}
          <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm" style={styles.statusCard}>
            <View className="flex-row items-center gap-3 mb-5">
              <Text className="text-2xl">📈</Text>
              <Text className="text-lg font-bold text-textMain" style={styles.sectionTitle}>Statut</Text>
            </View>
            
            <View className="flex-row items-center gap-5 p-4 bg-gray-50 rounded-xl">
              <View 
                className="w-16 h-16 rounded-2xl items-center justify-center shadow-sm"
                style={[styles.statusIconContainer, { backgroundColor: `${getStatusColor(task.status)}20` }]}
              >
                <Text className="text-2xl">{getStatusIcon(task.status)}</Text>
              </View>
              
              <View className="flex-1">
                <Text className="text-lg font-bold text-textMain mb-2" style={styles.statusTitle}>{task.status}</Text>
                <Text className="text-sm text-textMuted leading-relaxed" style={styles.statusDescription}>
                  {task.status === 'Terminé' && '✅ Tâche terminée avec succès'}
                  {task.status === 'En cours' && '🔄 Tâche en cours d\'exécution'}
                  {task.status === 'En retard' && '⚠️ Tâche en retard par rapport à l\'échéance'}
                  {task.status === 'A faire' && '📋 Tâche en attente de démarrage'}
                </Text>
              </View>
            </View>
          </View>

          {/* Actions rapides - Style Flowli */}
          <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm" style={styles.actionsCard}>
            <View className="flex-row items-center gap-3 mb-5">
              <Text className="text-2xl">⚡</Text>
              <Text className="text-lg font-bold text-textMain" style={styles.sectionTitle}>Actions</Text>
            </View>
            
            <View className="space-y-4">
              {task.status === 'A faire' && (
                <TouchableOpacity
                  onPress={() => onMarkInProgress?.(task.id)}
                  className="w-full py-4 px-6 rounded-xl bg-primary shadow-lg shadow-primary/30"
                  style={styles.primaryActionButton}
                >
                  <Text className="text-white text-base font-semibold text-center" style={styles.primaryActionText}>
                    🚀 Commencer cette tâche
                  </Text>
                </TouchableOpacity>
              )}
              
              {task.status === 'En cours' && (
                <TouchableOpacity
                  onPress={() => onMarkComplete?.(task.id)}
                  className="w-full py-4 px-6 rounded-xl bg-primary shadow-lg shadow-primary/30"
                  style={styles.primaryActionButton}
                >
                  <Text className="text-white text-base font-semibold text-center" style={styles.primaryActionText}>
                    ✅ Marquer comme terminé
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                onPress={() => {
                  // TODO: Implémenter le partage
                  console.log('Partager la tâche:', task.id);
                }}
                className="w-full py-3 px-6 rounded-xl border border-gray-200 bg-white"
                style={styles.secondaryActionButton}
              >
                <Text className="text-gray-600 text-base font-medium text-center" style={styles.secondaryActionText}>
                  📤 Partager cette tâche
                </Text>
              </TouchableOpacity>
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

// Styles Flowli pour le modal de détail
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  headerGradient: {
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonActive: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 24,
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    fontSize: 32,
  },
  titleContainer: {
    flex: 1,
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 32,
    fontFamily: 'Inter',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  overdueBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  overdueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  progressBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  // Nouveaux styles pour les cartes
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  debugCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FDE68A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    fontFamily: 'Inter',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  infoValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  progressBarContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    height: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  statusDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  primaryActionButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  secondaryActionButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryActionText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
});
