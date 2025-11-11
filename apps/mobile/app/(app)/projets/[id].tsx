import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, StyleSheet, Alert, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppLayout } from '../../../src/ui/layout';
import { SprintCard, SprintTask } from '../../../src/ui/components';
import { supabase } from '@/src/lib/supabase';
import { fetchProjects, type Project } from '../../../src/api/projects';
import { fetchTasks } from '../../../src/api/tasks';
import { get } from '@/src/utils/http';
import { TaskDetailModal } from '../../../src/ui/components/TaskDetailModal';
import { useTopBar } from '../../../src/ui/layout/TopBarContext';

type TaskItem = {
  id: string;
  title: string;
  status: string;
  progress: number | null;
  dueDate: string | null;
  projectId: string | null;
  projectName: string | null;
};

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setTopBarState } = useTopBar();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Tous');
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  const statusOptions = ['Tous', 'En cours', 'Terminé', 'À faire', 'En retard'];

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/(public)/onboarding');
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error);
      Alert.alert('Erreur', 'Impossible de se déconnecter. Veuillez réessayer.');
    }
  };

  const load = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      let { data } = await supabase.auth.getSession();
      if (!data.session) {
        await new Promise(r => setTimeout(r, 250));
        ({ data } = await supabase.auth.getSession());
      }

      // Charger tous les projets pour trouver celui avec l'ID
      const projectsData = await fetchProjects();
      const foundProject = projectsData.find(p => p.id === id);
      
      if (!foundProject) {
        Alert.alert('Erreur', 'Projet non trouvé');
        router.push('/home');
        return;
      }

      setProject(foundProject);

      // Charger les tâches du projet
      const params: Record<string, string> = {};
      params.projectId = id;
      params.statuses = 'A faire,En cours,En retard,Terminé';

      const queryParts: string[] = [];
      if (params.statuses) queryParts.push(`statuses=${encodeURIComponent(params.statuses)}`);
      if (params.projectId) queryParts.push(`projectId=${encodeURIComponent(params.projectId)}`);
      const qs = queryParts.join('&');
      
      const url = `me/tasks${qs ? `?${qs}` : ''}`;
      const resp = await get(url);

      if (!resp.ok) {
        throw new Error(resp.raw || `HTTP ${resp.status}`);
      }

      const responseData = resp.data;
      const items = Array.isArray(responseData) ? responseData : responseData?.items ?? [];
      
      setTasks(items);
    } catch (e: any) {
      console.error('Erreur lors du chargement:', e?.message);
      Alert.alert('Erreur', e?.message ?? 'Échec du chargement');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await load(); } finally { setRefreshing(false); }
  }, [load]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      
      if (!session) {
        setSessionChecked(true);
        router.replace('/(auth)/login');
        return;
      }
      
      setSessionChecked(true);
      await load();
    })();
  }, [load, router]);

  // Filtrer les tâches selon le filtre de statut
  const filteredTasks = useMemo(() => {
    if (selectedStatusFilter === 'Tous') {
      return tasks;
    }
    return tasks.filter(task => task.status === selectedStatusFilter);
  }, [tasks, selectedStatusFilter]);

  // Grouper les tâches en "sprints" (par statut pour l'instant)
  const sprints = useMemo(() => {
    const grouped = new Map<string, TaskItem[]>();
    
    filteredTasks.forEach(task => {
      const sprintKey = task.status || 'Sans statut';
      if (!grouped.has(sprintKey)) {
        grouped.set(sprintKey, []);
      }
      grouped.get(sprintKey)!.push(task);
    });

    return Array.from(grouped.entries()).map(([status, tasks]) => {
      const completedCount = tasks.filter(t => t.status === 'Terminé').length;
      const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
      
      // Trouver la date la plus récente pour le sprint
      const dates = tasks
        .map(t => t.dueDate ? new Date(t.dueDate).getTime() : 0)
        .filter(d => d > 0);
      const latestDate = dates.length > 0 ? new Date(Math.max(...dates)) : null;
      
      return {
        title: status === 'Terminé' ? 'Cartographie & Normes' : 
               status === 'En cours' ? 'Développement' :
               status === 'À faire' ? 'Planification' :
               status === 'En retard' ? 'Actions requises' : status,
        status: status,
        date: latestDate ? latestDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : undefined,
        tasks: tasks.map(t => ({
          id: t.id,
          title: t.title,
          status: t.status,
          progress: t.progress,
          dueDate: t.dueDate,
          description: undefined,
          assignedTo: undefined,
          priority: undefined,
          filesCount: undefined,
          commentsCount: undefined,
        } as SprintTask)),
        progress: progress,
      };
    });
  }, [filteredTasks]);

  // Calculer le statut global du projet
  const projectStatus = useMemo(() => {
    if (tasks.length === 0) return 'À faire';
    const completedCount = tasks.filter(t => t.status === 'Terminé').length;
    if (completedCount === tasks.length) return 'Terminé';
    if (tasks.some(t => t.status === 'En cours')) return 'En cours';
    if (tasks.some(t => t.status === 'En retard')) return 'En retard';
    return 'À faire';
  }, [tasks]);

  // Mettre à jour le TopBar avec les infos du projet
  useEffect(() => {
    setTopBarState({
      showBackButton: true,
      projectName: project?.name,
      projectStatus: projectStatus,
    });
    
    // Cleanup: réinitialiser le TopBar quand on quitte la page
    return () => {
      setTopBarState({});
    };
  }, [project, projectStatus, setTopBarState]);

  const openTaskDetail = (task: SprintTask) => {
    const fullTask = tasks.find(t => t.id === task.id);
    if (fullTask) {
      setSelectedTask(fullTask);
      setShowTaskDetail(true);
    }
  };

  const closeTaskDetail = () => {
    setShowTaskDetail(false);
    setSelectedTask(null);
  };

  const handleMarkComplete = async (taskId: string) => {
    try {
      console.log('Marquer comme terminé:', taskId);
      Alert.alert('Succès', 'Tâche marquée comme terminée');
      closeTaskDetail();
      await load();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de marquer la tâche comme terminée');
    }
  };

  const handleMarkInProgress = async (taskId: string) => {
    try {
      console.log('Marquer comme en cours:', taskId);
      Alert.alert('Succès', 'Tâche marquée comme en cours');
      closeTaskDetail();
      await load();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de marquer la tâche comme en cours');
    }
  };

  if (!sessionChecked) return null;

  return (
    <AppLayout onLogout={logout}>
      <ScrollView
        className="flex-1 bg-bgGray"
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Section principale */}
        <View style={styles.mainSection}>
          <View style={styles.header}>
            <Text style={styles.mainTitle}>Sprints & Tâches</Text>
            <Text style={styles.subtitle}>Suivez l'avancement de votre projet</Text>
          </View>

          {/* Filtres horizontaux */}
          <View style={styles.filtersContainer}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Statut</Text>
              <View style={styles.filterButtons}>
                {statusOptions.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterButton,
                      selectedStatusFilter === status && styles.filterButtonActive,
                    ]}
                    onPress={() => setSelectedStatusFilter(status)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedStatusFilter === status && styles.filterButtonTextActive,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Blocs de sprint */}
          {loading && (
            <View style={styles.loadingState}>
              <Text style={styles.loadingText}>⏳ Chargement...</Text>
            </View>
          )}

          {!loading && sprints.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aucune tâche trouvée</Text>
            </View>
          )}

          {!loading && sprints.map((sprint, index) => (
            <SprintCard
              key={`${sprint.status}-${index}`}
              title={sprint.title}
              status={sprint.status}
              date={sprint.date}
              tasks={sprint.tasks}
              progress={sprint.progress}
              onTaskPress={openTaskDetail}
            />
          ))}
        </View>
      </ScrollView>

      {/* Modal de détail de tâche */}
      {selectedTask && (
        <TaskDetailModal
          visible={showTaskDetail}
          task={selectedTask}
          onClose={closeTaskDetail}
          onMarkComplete={handleMarkComplete}
          onMarkInProgress={handleMarkInProgress}
        />
      )}
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingTop: 32,
  },
  mainSection: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  filtersContainer: {
    marginBottom: 32,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderColor: '#7C3AED',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#7C3AED',
  },
  loadingState: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    padding: 48,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

