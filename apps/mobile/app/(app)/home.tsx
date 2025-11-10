import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, SectionList, RefreshControl, Platform, Alert, StyleSheet, Animated, LayoutAnimation, UIManager, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Screen, AppLayout } from '../../src/ui/layout';
import { AppIcon } from '@/src/ui/icons/AppIcon';
import { Card, Progress, Badge, Button } from '../../src/ui/components';
import { TaskDetailModal } from '../../src/ui/components/TaskDetailModal';
import { supabase } from '@/src/lib/supabase';
import { registerForPushToken, registerDeviceOnApi } from '@/src/utils/push';
import { fetchTasks } from '../../src/api/tasks';
import { fetchProjects, type Project } from '../../src/api/projects';
import { get } from '../../src/utils/http';
import { useFadeInDelayed } from '@/src/animations';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TaskItem = {
  id: string;
  title: string;
  status: string;
  progress: number | null;
  dueDate: string | null;
  projectId: string | null;
  projectName: string | null;
};

function fmtRel(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const abs = Math.abs(diffMs);
  const min = 60 * 1000;
  const hr = 60 * min;
  const day = 24 * hr;
  let value: number;
  let unit: Intl.RelativeTimeFormatUnit = 'day';
  if (abs < hr) {
    value = Math.round(diffMs / min);
    unit = 'minute';
  } else if (abs < day) {
    value = Math.round(diffMs / hr);
    unit = 'hour';
  } else {
    value = Math.round(diffMs / day);
    unit = 'day';
  }
  try {
    const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
    return rtf.format(value, unit);
  } catch {
    const s = Math.abs(value);
    const label = unit === 'day' ? (s > 1 ? 'jours' : 'jour') : unit === 'hour' ? (s > 1 ? 'heures' : 'heure') : (s > 1 ? 'minutes' : 'minute');
    return value < 0 ? `il y a ${s} ${label}` : `dans ${s} ${label}`;
  }
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Invalid date';
  return d.toLocaleString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit'
  });
}

  function StatusBadge({ status }: { status: string }) {
    const getStatusClasses = () => {
      switch (status) {
        case 'Terminé':
          return 'bg-emerald-50 border-emerald-200';
        case 'En retard':
          return 'bg-red-50 border-red-200';
        case 'En cours':
          return 'bg-violet-50 border-violet-200';
        case 'A faire':
          return 'bg-gray-50 border-gray-200';
        default:
          return 'bg-gray-50 border-gray-200';
      }
    };

    const getTextClasses = () => {
      switch (status) {
        case 'Terminé':
          return 'text-emerald-800';
        case 'En retard':
          return 'text-red-800';
        case 'En cours':
          return 'text-violet-800';
        case 'A faire':
          return 'text-gray-600';
        default:
          return 'text-gray-600';
      }
    };

    const getStatusStyle = () => {
      switch (status) {
        case 'Terminé':
          return styles.statusBadgeSuccess;
        case 'En retard':
          return styles.statusBadgeError;
        case 'En cours':
          return styles.statusBadgeFlowli;
        case 'A faire':
          return styles.statusBadgeDefault;
        default:
          return styles.statusBadgeDefault;
      }
    };

    const getTextStyle = () => {
      switch (status) {
        case 'Terminé':
          return styles.statusTextSuccess;
        case 'En retard':
          return styles.statusTextError;
        case 'En cours':
          return styles.statusTextFlowli;
        case 'A faire':
          return styles.statusTextDefault;
        default:
          return styles.statusTextDefault;
      }
    };

    return (
      <View className={`px-3 py-1.5 rounded-full border ${getStatusClasses()}`} style={[styles.statusBadge, getStatusStyle()]}>
        <Text className={`text-xs font-semibold ${getTextClasses()}`} style={[styles.statusText, getTextStyle()]}>{status}</Text>
      </View>
    );
  }

  function RegisterStatusBadge({ status }: { status: number | null }) {
    const getStatusInfo = () => {
      if (status === 200) {
        return {
          text: '200 OK',
          classes: 'bg-green-50 border-green-200',
          textClasses: 'text-green-800',
          style: styles.registerStatusSuccess,
          textStyle: styles.registerStatusTextSuccess
        };
      } else if (status === 401) {
        return {
          text: '401 Auth',
          classes: 'bg-red-50 border-red-200',
          textClasses: 'text-red-800',
          style: styles.registerStatusError,
          textStyle: styles.registerStatusTextError
        };
      } else if (status === 404) {
        return {
          text: '404 Not Found',
          classes: 'bg-orange-50 border-orange-200',
          textClasses: 'text-orange-800',
          style: styles.registerStatusWarning,
          textStyle: styles.registerStatusTextWarning
        };
      } else if (status === 500) {
        return {
          text: '500 Server',
          classes: 'bg-red-50 border-red-200',
          textClasses: 'text-red-800',
          style: styles.registerStatusError,
          textStyle: styles.registerStatusTextError
        };
      } else {
        return {
          text: status ? `${status} Error` : 'Unknown',
          classes: 'bg-gray-50 border-gray-200',
          textClasses: 'text-gray-800',
          style: styles.registerStatusDefault,
          textStyle: styles.registerStatusTextDefault
        };
      }
    };

    const statusInfo = getStatusInfo();

    return (
      <View className={`px-3 py-1 rounded-full border ${statusInfo.classes}`} style={[styles.registerStatusBadge, statusInfo.style]}>
        <Text className={`text-xs font-medium ${statusInfo.textClasses}`} style={[styles.registerStatusText, statusInfo.textStyle]}>
          {statusInfo.text}
        </Text>
      </View>
    );
  }

export default function Home() {
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<TaskItem[]>([]);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [showDone, setShowDone] = useState(false);
  
  // Animation refs for accordion arrows
  const arrowAnimations = useRef<Map<string, Animated.Value>>(new Map());
  
  // Function to get or create arrow animation for a project
  const getArrowAnimation = (projectId: string) => {
    if (!arrowAnimations.current.has(projectId)) {
      arrowAnimations.current.set(projectId, new Animated.Value(0));
    }
    return arrowAnimations.current.get(projectId)!;
  };
  
  // Function to toggle accordion with animation
  const toggleAccordion = (projectId: string) => {
    const isExpanded = expandedProjects.has(projectId);
    const arrowAnim = getArrowAnimation(projectId);
    
    // Haptic feedback iOS
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Configure LayoutAnimation for smooth expand/collapse
    LayoutAnimation.configureNext({
      duration: 200,
      create: { type: 'easeOut', property: 'opacity' },
      update: { type: 'easeOut', property: 'opacity' },
      delete: { type: 'easeOut', property: 'opacity' }
    });
    
    // Animate arrow rotation
    Animated.timing(arrowAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    
    // Update expanded state
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };
  
  // Animations d'apparition
  const headerAnim = useFadeInDelayed({ delay: 0 });
  const statsAnim = useFadeInDelayed({ delay: 200 });
  const tasksAnim = useFadeInDelayed({ delay: 400 });
  
  // États pour le modal de détail
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  
  
  const [error, setError] = useState<string | null>(null);
  const [lastRegisterStatus, setLastRegisterStatus] = useState<{
    timestamp: string;
    status: number | null;
    message: string;
    success: boolean;
  } | null>(null);


  const logout = async () => {
    setLogoutLoading(true);
    try {
      await supabase.auth.signOut();
      router.replace('/(public)/onboarding');
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error);
      Alert.alert('Erreur', 'Impossible de se déconnecter. Veuillez réessayer.');
    } finally {
      setLogoutLoading(false);
    }
  };



  // Fonctions pour le modal de détail
  const openTaskDetail = (task: TaskItem) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  const closeTaskDetail = () => {
    setShowTaskDetail(false);
    setSelectedTask(null);
  };

  const handleMarkComplete = async (taskId: string) => {
    try {
      // TODO: Implémenter l'API pour marquer comme terminé
      console.log('Marquer comme terminé:', taskId);
      Alert.alert('Succès', 'Tâche marquée comme terminée');
      closeTaskDetail();
      // Recharger les tâches
      await load();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de marquer la tâche comme terminée');
    }
  };

  const handleMarkInProgress = async (taskId: string) => {
    try {
      // TODO: Implémenter l'API pour marquer comme en cours
      console.log('Marquer comme en cours:', taskId);
      Alert.alert('Succès', 'Tâche marquée comme en cours');
      closeTaskDetail();
      // Recharger les tâches
      await load();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de marquer la tâche comme en cours');
    }
  };

  const load = useCallback(async () => {
    console.log('[HOME] 🔄 Début du chargement des projets et tâches...');
    setLoading(true);
    setError(null);
    try {
      let { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.log('[HOME] ⏳ Session non disponible, attente...');
        await new Promise(r => setTimeout(r, 250));
        ({ data } = await supabase.auth.getSession());
      }
      const email = data.session?.user?.email ?? '';
      console.log('[HOME] 📧 Email de session:', email);

      const params: Record<string, string> = {};
      params.statuses = 'A faire,En cours,En retard';

      const queryParts: string[] = [];
      if (params.statuses) queryParts.push(`statuses=${encodeURIComponent(params.statuses)}`);
      const qs = queryParts.join('&');
      
      const url = `me/tasks${qs ? `?${qs}` : ''}`;
      console.log('[HOME] 🌐 Appel API projets et tâches...');
      
      // Charger projets ET tâches en parallèle
      const [projectsData, resp] = await Promise.all([
        fetchProjects(),
        get(url)
      ]);

      if (!resp.ok) {
        throw new Error(resp.raw || `HTTP ${resp.status}`);
      }

      const responseData = resp.data;
      const items = Array.isArray(responseData) ? responseData : responseData?.items ?? [];
      const count = Array.isArray(responseData) ? responseData.length : (responseData?.count ?? items.length);
      
      console.log('[HOME] ✅ Données chargées:', { 
        projectsCount: projectsData.length,
        tasksCount: count, 
        itemsLength: items.length 
      });

      setProjects(projectsData);
      setItems(items);
    } catch (e: any) {
      console.log('[HOME] ❌ Erreur lors du chargement:', e?.message);
      setError(e.message ?? String(e));
      Alert.alert('Erreur', e?.message ?? 'Échec du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await load(); } finally { setRefreshing(false); }
  }, [load]);

  useEffect(() => {
    (async () => {
      console.log('[HOME] 🔍 Vérification de la session...');
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      
      if (!session) {
        console.log('[HOME] ❌ Aucune session trouvée, redirection vers login');
        setSessionChecked(true);
        router.replace('/(auth)/login');
        return;
      }
      
      console.log('[HOME] ✅ Session trouvée:', {
        email: session.user.email,
        userId: session.user.id,
        hasToken: !!session.access_token
      });
      
      setEmail(session.user.email ?? null);

      const isTester = true;
      await registerForPushToken();
      
      console.log('[HOME] 🚀 Session vérifiée, chargement des tâches...');
      setSessionChecked(true);
    })();
  }, [router]);

  useEffect(() => { 
    console.log('[HOME] 🎯 useEffect sessionChecked:', sessionChecked);
    if (sessionChecked) {
      console.log('[HOME] 🚀 Déclenchement du chargement automatique');
      load(); 
    }
  }, [sessionChecked, load]);

  const projectGroups = useMemo(() => {
    const groups = new Map<string, TaskItem[]>();
    const noProject: TaskItem[] = [];
    
    for (const task of items) {
      if (task.projectId) {
        if (!groups.has(task.projectId)) groups.set(task.projectId, []);
        groups.get(task.projectId)!.push(task);
      } else {
        noProject.push(task);
      }
    }
    
    // Trier les tâches dans chaque groupe par date
    const parseDate = (s: string | null) => (s ? new Date(s) : null);
    for (const tasks of groups.values()) {
      tasks.sort((a, b) => {
        const da = parseDate(a.dueDate); 
        const db = parseDate(b.dueDate);
        if (da && db) return da.getTime() - db.getTime();
        if (da && !db) return -1; 
        if (!da && db) return 1; 
        return 0;
      });
    }
    
    noProject.sort((a, b) => {
      const da = parseDate(a.dueDate); 
      const db = parseDate(b.dueDate);
      if (da && db) return da.getTime() - db.getTime();
      if (da && !db) return -1; 
      if (!da && db) return 1; 
      return 0;
    });
    
    return { groups, noProject };
  }, [items]);

  const renderItem = ({ item }: { item: TaskItem }) => {
    const pct = item.progress == null ? null : Math.round((item.progress <= 1 ? item.progress * 100 : item.progress));
    const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && item.status !== 'Terminé';
    const isCompleted = item.status === 'Terminé';
    
    return (
      <TouchableOpacity
        onPress={() => openTaskDetail(item)}
        activeOpacity={0.8}
        style={styles.card}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-3"
      >
        {/* Header avec titre et badge */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title || '(Sans titre)'}
          </Text>
          <StatusBadge status={item.status} />
        </View>
        
        
        
        {/* Footer avec progression et date */}
        <View style={styles.footer}>
          {/* Barre de progression avec design Flowli */}
          {pct !== null && (
            <View style={styles.progressWrapper}>
              <View style={styles.progressBarContainer}>
                  <View style={[
                    styles.progressBar,
                    { width: `${Math.max(Math.min(pct, 100), 0)}%` },
                    isCompleted ? styles.progressBarComplete : styles.progressBarActive
                  ]} />
              </View>
              <Text style={[
                styles.progressText,
                isCompleted ? styles.progressTextComplete : styles.progressTextActive
              ]}>
                {pct}%
              </Text>
            </View>
          )}
          
          {/* Date avec icône - toujours réserver l'espace */}
          <View style={styles.dateContainer}>
            {item.dueDate ? (
              <>
                <AppIcon name="calendar" size={12} variant="muted" />
                <Text style={[styles.date, isOverdue && styles.dateOverdue]}>
                  {fmtRel(item.dueDate)}
                </Text>
              </>
            ) : (
              <View style={styles.datePlaceholder} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };


  if (!sessionChecked) return null;


  return (
    <View className="flex-1 bg-bgGray" style={styles.container}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >


        {/* Header - Style Flowli */}
        <Animated.View style={[styles.headerSection, headerAnim]} className="mb-6">
          <View className="flex-row justify-between items-center mb-2" style={styles.headerRow}>
            <View>
              <Text className="text-3xl font-bold text-textMain mb-1" style={styles.headerTitle}>
                Mes <Text className="text-primary" style={styles.headerTitleAccent}>projets</Text>
              </Text>
              <Text className="text-secondary" style={styles.headerSubtitle}>
                {projects.length} projet{projects.length > 1 ? 's' : ''} • {items.length} tâche{items.length > 1 ? 's' : ''} au total
              </Text>
            </View>
            
            <View className="flex-row gap-2" style={styles.headerActions}>
              <TouchableOpacity 
                onPress={logout} 
                disabled={logoutLoading}
                className={`px-4 py-2 rounded-full bg-white border border-red-200 ${
                  logoutLoading ? 'opacity-60' : ''
                }`}
                style={[
                  styles.logoutButton,
                  logoutLoading && styles.logoutButtonDisabled
                ]}
              >
                <Text className="font-semibold text-red-600 text-sm" style={[
                  styles.logoutButtonText,
                  logoutLoading && styles.logoutButtonTextDisabled
                ]}>
                  {logoutLoading ? '...' : 'Déco'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={load} 
                className="px-4 py-2 rounded-full bg-primary shadow-lg shadow-primary/30"
                style={styles.refreshButton}
              >
                <Text className="text-white font-semibold text-sm" style={styles.refreshButtonText}>↻</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>


        {/* Liste des projets avec accordéon amélioré */}
        <Animated.View style={tasksAnim}>
          {projects.map((project) => {
            const tasks = projectGroups.groups.get(project.id) || [];
            const isExpanded = expandedProjects.has(project.id);
            const arrowAnim = getArrowAnimation(project.id);
            
            // Create rotation interpolation for arrow
            const rotateInterpolate = arrowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg'],
            });
            
            return (
              <View key={project.id} style={styles.projectSection}>
                <TouchableOpacity 
                  onPress={() => toggleAccordion(project.id)}
                  activeOpacity={0.7}
                  style={[
                    styles.accordionHeader,
                    isExpanded && styles.accordionHeaderExpanded
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.accordionTitle}>
                        {project.name}
                      </Text>
                      <Text style={styles.accordionSubtitle}>
                        {tasks.length} tâche{tasks.length > 1 ? 's' : ''}
                      </Text>
                    </View>
                    
                    <Animated.View style={[styles.accordionArrowContainer, { transform: [{ rotate: rotateInterpolate }] }]}>
                      <AppIcon 
                        name="chevronDown" 
                        size={20} 
                        variant="default"
                        style={styles.accordionArrow}
                      />
                    </Animated.View>
                  </View>
                </TouchableOpacity>
                
                {isExpanded && (
                  <View style={styles.accordionContent}>
                    {tasks.length === 0 ? (
                      <View style={styles.emptyProjectState}>
                        <AppIcon name="inbox" size={24} variant="muted" />
                        <Text style={styles.emptyProjectText}>
                          Aucune tâche dans ce projet
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.tasksContainer}>
                        {tasks.map((task, index) => (
                          <View key={task.id} style={[styles.taskItem, index === 0 && styles.firstTaskItem]}>
                            {renderItem({ item: task })}
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })}
          
          {/* Section Sans Projet (fallback) - Style cohérent */}
          {projectGroups.noProject.length > 0 && (
            <View style={styles.noProjectSection}>
              <View style={styles.noProjectHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.noProjectTitle}>
                      Sans projet
                    </Text>
                    <Text style={styles.noProjectSubtitle}>
                      {projectGroups.noProject.length} tâche{projectGroups.noProject.length > 1 ? 's' : ''} non assignée{projectGroups.noProject.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.noProjectTasks}>
                {projectGroups.noProject.map((task, index) => (
                  <View key={task.id} style={[styles.taskItem, index === 0 && styles.firstTaskItem]}>
                    {renderItem({ item: task })}
                  </View>
                ))}
              </View>
            </View>
          )}
        </Animated.View>
        
        {loading && (
          <View className="bg-white p-6 rounded-2xl items-center mt-4" style={styles.loadingState}>
            <Text className="text-primary text-sm font-medium" style={styles.loadingText}>⏳ Chargement...</Text>
          </View>
        )}
        
        {!loading && items.length === 0 && (
          <View className="bg-white p-8 rounded-2xl items-center border border-gray-100" style={styles.noTasksState}>
            <AppIcon name="receipt" size={40} variant="muted" />
            <Text className="text-base font-semibold text-textMain mb-1" style={styles.noTasksTitle}>
              Aucune tâche
            </Text>
            <Text className="text-gray-500 text-sm text-center" style={styles.noTasksSubtitle}>
              Vous n'avez pas encore de tâches assignées
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de détail de tâche */}
      <TaskDetailModal
        visible={showTaskDetail}
        task={selectedTask}
        onClose={closeTaskDetail}
        onMarkComplete={handleMarkComplete}
        onMarkInProgress={handleMarkInProgress}
      />
    </View>
  );
}

// Styles de fallback pour Expo Go (quand NativeWind ne fonctionne pas)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 60, // Encore plus d'espace en haut
  },
  // Styles Flowli pour les cartes de tâches
  card: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
    fontFamily: '-apple-system, "system-ui", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  progressBarContainer: {
    width: '70%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
    minWidth: 2,
  },
  progressBarComplete: {
    backgroundColor: '#10B981',
  },
  progressBarActive: {
    backgroundColor: '#7C3AED',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressTextComplete: {
    color: '#10B981',
  },
  progressTextActive: {
    color: '#7C3AED',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 80,
  },
  datePlaceholder: {
    width: 80,
    height: 20,
  },
  dateIcon: {
    fontSize: 12,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  dateOverdue: {
    color: '#EF4444',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusBadgeSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  statusBadgeError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  statusBadgeFlowli: {
    backgroundColor: '#F5F3FF',
    borderColor: '#C4B5FD',
  },
  statusBadgeDefault: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  statusTextSuccess: {
    color: '#166534',
  },
  statusTextError: {
    color: '#DC2626',
  },
  statusTextFlowli: {
    color: '#7C3AED',
  },
  statusTextDefault: {
    color: '#6B7280',
  },
  // Nouveaux styles pour le header
  headerSection: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerTitleAccent: {
    color: '#7C3AED',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6E6E6E',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#DC2626',
  },
  logoutButtonTextDisabled: {
    color: '#9CA3AF',
  },
  refreshButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  // Nouveaux styles pour les sections
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  sectionToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  sectionToggleText: {
    color: '#7C3AED',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyStateText: {
    color: '#6B7280',
    fontSize: 14,
  },
  loadingState: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  loadingText: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '500',
  },
  noTasksState: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  noTasksIcon: {
    fontSize: 80,
    marginBottom: 12,
  },
  noTasksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  noTasksSubtitle: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  // Register status badge styles
  registerStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  registerStatusSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  registerStatusError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  registerStatusWarning: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  registerStatusDefault: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  registerStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  registerStatusTextSuccess: {
    color: '#166534',
  },
  registerStatusTextError: {
    color: '#DC2626',
  },
  registerStatusTextWarning: {
    color: '#EA580C',
  },
  registerStatusTextDefault: {
    color: '#6B7280',
  },
  // Enhanced Accordion styles
  projectSection: {
    marginBottom: 12,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  accordionHeaderExpanded: {
    borderColor: '#E8E8E8',
    backgroundColor: '#FAFAFA',
  },
  accordionTitle: {
    fontSize: Platform.OS === 'ios' ? 17 : 16,
    fontWeight: '600',
    color: '#1C1C1E',
    letterSpacing: Platform.OS === 'ios' ? -0.4 : 0,
    marginBottom: 2,
  },
  accordionSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
  },
  accordionArrowContainer: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    padding: 8,
    marginLeft: 8,
  },
  accordionArrow: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  accordionContent: {
    paddingLeft: 16,           // Indentation
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 8,
    borderLeftWidth: 4,        // Bordure gauche épaisse
    borderLeftColor: '#7C3AED', // Violet Flowli
    backgroundColor: '#FAFBFF',  // Fond très légèrement teinté
    borderRadius: 12,
    marginLeft: 4,
    marginBottom: 8,
  },
  tasksContainer: {
    gap: 6,
  },
  taskItem: {
    marginBottom: 6,
  },
  firstTaskItem: {
    marginTop: 4,
  },
  emptyProjectState: {
    backgroundColor: '#F9F9F9',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyProjectText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  // No Project section styles
  noProjectSection: {
    marginBottom: 16,
  },
  noProjectHeader: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 16,
  },
  noProjectTitle: {
    fontSize: Platform.OS === 'ios' ? 17 : 16,
    fontWeight: '600',
    color: '#1C1C1E',
    letterSpacing: Platform.OS === 'ios' ? -0.4 : 0,
    marginBottom: 2,
  },
  noProjectSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
  },
  noProjectTasks: {
    gap: 6,
  },
});