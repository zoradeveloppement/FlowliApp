import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
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
    <Card className="mb-4">
      <Text className="text-h2 text-textMain mb-4">Filtres</Text>
      
      <View className="space-y-4">
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
        
        <View className="flex-row items-center justify-between">
          <Text className="text-body text-textMain">
            Inclure les tâches terminées
          </Text>
          <TouchableOpacity
            className={`w-12 h-6 rounded-full ${
              includeCompleted ? 'bg-primary' : 'bg-gray-300'
            }`}
            onPress={() => onIncludeCompletedChange(!includeCompleted)}
          >
            <View
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                includeCompleted ? 'translate-x-6' : 'translate-x-0.5'
              }`}
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
  return (
    <Card className="mb-3">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-body text-textMain font-medium mb-1">
            {task.title}
          </Text>
          <Text className="text-secondary text-textMuted">
            {task.projectName}
          </Text>
          {task.dueDate && (
            <Text className="text-secondary text-textMuted mt-1">
              Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
            </Text>
          )}
        </View>
        <Badge status={task.status} />
      </View>
      
      {task.progress > 0 && (
        <View className="mt-2">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-secondary text-textMuted">Progression</Text>
            <Text className="text-secondary text-textMuted">{task.progress}%</Text>
          </View>
          <View className="w-full bg-gray-200 rounded-full h-2">
            <View
              className="bg-primary h-2 rounded-full"
              style={{ width: `${task.progress}%` }}
            />
          </View>
        </View>
      )}
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
