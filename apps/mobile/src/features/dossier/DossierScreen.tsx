import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Screen, AppLayout } from '../../ui/layout';
import { Card, Badge, Input, Button, Skeleton } from '../../ui/components';

interface Task {
  id: string;
  title: string;
  status: 'terminé' | 'en cours' | 'à venir' | 'action requise';
  projectId: string;
  projectName: string;
  dueDate: string | null;
  progress: number;
}

interface FilterBarProps {
  search: string;
  projectId: string;
  includeCompleted: boolean;
  onSearchChange: (text: string) => void;
  onProjectIdChange: (text: string) => void;
  onIncludeCompletedChange: (value: boolean) => void;
  onReset: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  projectId,
  includeCompleted,
  onSearchChange,
  onProjectIdChange,
  onIncludeCompletedChange,
  onReset,
}) => {
  return (
    <Card className="mb-4" style={styles.filterCard}>
      <Text className="text-h2 text-textMain mb-4" style={styles.filterTitle}>Filtres</Text>
      
      <View className="space-y-4" style={styles.filterContent}>
        <Input
          label="Rechercher"
          placeholder="Nom de la tâche..."
          value={search}
          onChangeText={onSearchChange}
        />
        
        <Input
          label="ID Projet"
          placeholder="Filtrer par projet..."
          value={projectId}
          onChangeText={onProjectIdChange}
        />
        
        <View className="flex-row items-center justify-between" style={styles.toggleRow}>
          <Text className="text-body text-textMain" style={styles.toggleLabel}>
            Inclure les tâches terminées
          </Text>
          <TouchableOpacity
            className={`w-12 h-6 rounded-full ${
              includeCompleted ? 'bg-primary' : 'bg-gray-300'
            }`}
            style={[
              styles.toggle,
              includeCompleted ? styles.toggleActive : styles.toggleInactive
            ]}
            onPress={() => onIncludeCompletedChange(!includeCompleted)}
          >
            <View
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                includeCompleted ? 'translate-x-6' : 'translate-x-0.5'
              }`}
              style={[
                styles.toggleThumb,
                includeCompleted ? styles.toggleThumbActive : styles.toggleThumbInactive
              ]}
            />
          </TouchableOpacity>
        </View>
        
        <Button
          title="Réinitialiser"
          variant="ghost"
          onPress={onReset}
        />
      </View>
    </Card>
  );
};

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'terminé':
        return '#10B981';
      case 'en cours':
        return '#7C3AED';
      case 'action requise':
        return '#F59E0B';
      case 'à venir':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'terminé':
        return '✅';
      case 'en cours':
        return '🔄';
      case 'action requise':
        return '⚠️';
      case 'à venir':
        return '📋';
      default:
        return '📋';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'terminé':
        return '#10B981';
      case 'en cours':
        return '#7C3AED';
      case 'action requise':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  return (
    <Card className="mb-4" style={styles.taskCard}>
      {/* Header avec titre et statut */}
      <View className="flex-row items-start justify-between mb-4" style={styles.taskHeader}>
        <View className="flex-1 mr-3" style={styles.taskContent}>
          <Text className="text-lg font-semibold text-gray-900 mb-1" style={styles.taskTitle}>
            {task.title}
          </Text>
          {task.projectName && (
            <Text className="text-sm text-gray-600" style={styles.taskProject}>
              {task.projectName}
            </Text>
          )}
        </View>
        <View 
          className="px-3 py-1.5 rounded-full"
          style={[styles.statusBadge, { backgroundColor: `${getStatusColor(task.status)}15` }]}
        >
          <Text 
            className="text-xs font-medium"
            style={[styles.statusText, { color: getStatusColor(task.status) }]}
          >
            {getStatusIcon(task.status)} {task.status}
          </Text>
        </View>
      </View>
      
      {/* Progression minimaliste */}
      {task.progress > 0 && (
        <View className="mb-4" style={styles.progressContainer}>
          <View className="flex-row justify-between items-center mb-2" style={styles.progressHeader}>
            <Text className="text-sm text-gray-600 font-medium" style={styles.progressLabel}>
              Avancement
            </Text>
            <Text 
              className="text-sm font-semibold"
              style={[styles.progressValue, { color: getProgressColor(task.status) }]}
            >
              {task.progress}%
            </Text>
          </View>
          <View className="w-full bg-gray-200 rounded-full h-2" style={styles.progressBar}>
            <View
              className="h-2 rounded-full"
              style={[
                styles.progressFill, 
                { 
                  width: `${task.progress}%`,
                  backgroundColor: getProgressColor(task.status)
                }
              ]}
            />
          </View>
        </View>
      )}

      {/* Actions liées à la tâche */}
      <View className="pt-3 border-t border-gray-100" style={styles.actionsContainer}>
        <View className="flex-row gap-2" style={styles.actionsRow}>
          {task.status === 'à venir' && (
            <TouchableOpacity
              className="flex-1 py-2.5 px-4 rounded-lg bg-violet-50"
              style={styles.actionButton}
            >
              <Text className="text-violet-600 text-sm font-medium text-center" style={styles.actionText}>
                🚀 Commencer
              </Text>
            </TouchableOpacity>
          )}
          
          {task.status === 'en cours' && (
            <TouchableOpacity
              className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-50"
              style={styles.actionButton}
            >
              <Text className="text-emerald-600 text-sm font-medium text-center" style={styles.actionText}>
                ✅ Terminer
              </Text>
            </TouchableOpacity>
          )}
          
          {task.status === 'action requise' && (
            <TouchableOpacity
              className="flex-1 py-2.5 px-4 rounded-lg bg-amber-50"
              style={styles.actionButton}
            >
              <Text className="text-amber-600 text-sm font-medium text-center" style={styles.actionText}>
                ⚠️ Action requise
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            className="py-2.5 px-3 rounded-lg border border-gray-200"
            style={styles.secondaryActionButton}
          >
            <Text className="text-gray-600 text-sm font-medium" style={styles.secondaryActionText}>
              📋
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const EmptyState: React.FC<{ hasFilters: boolean; onClearFilters: () => void }> = ({
  hasFilters,
  onClearFilters,
}) => {
  if (hasFilters) {
    return (
      <Card className="items-center py-8">
        <Text className="text-4xl mb-4">🔍</Text>
        <Text className="text-h2 text-textMain mb-2">Aucune tâche trouvée</Text>
        <Text className="text-body text-textMuted text-center mb-4">
          Aucune tâche ne correspond à vos critères de recherche.
        </Text>
        <Button
          title="Effacer les filtres"
          variant="primary"
          onPress={onClearFilters}
        />
      </Card>
    );
  }

  return (
    <Card className="items-center py-8">
      <Text className="text-4xl mb-4">📋</Text>
      <Text className="text-h2 text-textMain mb-2">Aucune tâche</Text>
      <Text className="text-body text-textMuted text-center">
        Vous n'avez pas encore de tâches assignées.
      </Text>
    </Card>
  );
};

export const DossierScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [projectId, setProjectId] = useState('');
  const [includeCompleted, setIncludeCompleted] = useState(false);

  // Load tasks
  useEffect(() => {
    loadTasks();
  }, []);

  // Persist filters in dev
  useEffect(() => {
    if (__DEV__) {
      const savedFilters = {
        search,
        projectId,
        includeCompleted,
      };
      // In a real app, you'd save to AsyncStorage
      console.log('Filters saved:', savedFilters);
    }
  }, [search, projectId, includeCompleted]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Validation du design',
          status: 'en cours',
          projectId: 'proj-1',
          projectName: 'Projet principal',
          dueDate: '2024-01-15',
          progress: 75,
        },
        {
          id: '2',
          title: 'Récupération documents',
          status: 'action requise',
          projectId: 'proj-1',
          projectName: 'Projet principal',
          dueDate: '2024-01-10',
          progress: 0,
        },
        {
          id: '3',
          title: 'Finalisation contrat',
          status: 'terminé',
          projectId: 'proj-1',
          projectName: 'Projet principal',
          dueDate: '2024-01-05',
          progress: 100,
        },
      ];
      
      setTasks(mockTasks);
    } catch (err) {
      setError('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !search || task.title.toLowerCase().includes(search.toLowerCase());
    const matchesProject = !projectId || task.projectId.includes(projectId);
    const matchesStatus = includeCompleted || task.status !== 'terminé';
    
    return matchesSearch && matchesProject && matchesStatus;
  });

  const hasActiveFilters = search || projectId || includeCompleted;

  const resetFilters = () => {
    setSearch('');
    setProjectId('');
    setIncludeCompleted(false);
  };

  if (loading) {
    return (
      <AppLayout>
        <Screen>
          <View className="mb-4">
            <Skeleton width="100%" height={200} />
          </View>
          <View className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} width="100%" height={120} />
            ))}
          </View>
        </Screen>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <Screen>
          <Card className="items-center py-8">
            <Text className="text-4xl mb-4">❌</Text>
            <Text className="text-h2 text-textMain mb-2">Erreur</Text>
            <Text className="text-body text-textMuted text-center mb-4">
              {error}
            </Text>
            <Button
              title="Réessayer"
              variant="primary"
              onPress={loadTasks}
            />
          </Card>
        </Screen>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Screen>
        <ScrollView className="flex-1">
          <Text className="text-h1 text-textMain mb-6">Mon dossier</Text>
          
          <FilterBar
            search={search}
            projectId={projectId}
            includeCompleted={includeCompleted}
            onSearchChange={setSearch}
            onProjectIdChange={setProjectId}
            onIncludeCompletedChange={setIncludeCompleted}
            onReset={resetFilters}
          />
          
          {filteredTasks.length === 0 ? (
            <EmptyState
              hasFilters={hasActiveFilters}
              onClearFilters={resetFilters}
            />
          ) : (
            <View>
              <Text className="text-body text-textMuted mb-4">
                {filteredTasks.length} tâche{filteredTasks.length > 1 ? 's' : ''} trouvée{filteredTasks.length > 1 ? 's' : ''}
              </Text>
              
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </View>
          )}
        </ScrollView>
      </Screen>
    </AppLayout>
  );
};

// Styles de fallback pour Expo Go (quand NativeWind ne fonctionne pas)
const styles = StyleSheet.create({
  filterCard: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  filterContent: {
    gap: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  toggle: {
    width: 48,
    height: 24,
    borderRadius: 12,
  },
  toggleActive: {
    backgroundColor: '#6C63FF',
  },
  toggleInactive: {
    backgroundColor: '#D1D5DB',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    transform: [{ translateX: 24 }],
  },
  toggleThumbInactive: {
    transform: [{ translateX: 2 }],
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  taskContent: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 24,
  },
  taskProject: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    width: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    height: 8,
  },
  progressFill: {
    height: 8,
    borderRadius: 8,
  },
  actionsContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  secondaryActionButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
