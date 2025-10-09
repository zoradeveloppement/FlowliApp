import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, SectionList, RefreshControl, Platform, Alert, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, AppLayout } from '../../src/ui/layout';
import { Card, Progress, Badge, Button } from '../../src/ui/components';
import { TaskDetailModal } from '../../src/ui/components/TaskDetailModal';
import { TailwindTest } from '../../src/ui/components/TailwindTest';
import { supabase } from '@/src/lib/supabase';
import { registerForPushToken } from '@/src/utils/push';
import { registerDevice } from '@/src/lib/api';
import { fetchTasks } from '@/src/api/tasks';
import { authHeaders } from '@/src/lib/auth';
import { get } from '@/src/lib/http';

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

  function StatusBadge({ status }: { status: string }) {
    const getStatusClasses = () => {
      switch (status) {
        case 'Terminé':
          return 'bg-green-50 border-green-200';
        case 'En retard':
          return 'bg-red-50 border-red-200';
        case 'En cours':
          return 'bg-blue-50 border-blue-200';
        case 'A faire':
          return 'bg-purple-50 border-purple-200';
        default:
          return 'bg-gray-100 border-gray-300';
      }
    };

    const getTextClasses = () => {
      switch (status) {
        case 'Terminé':
          return 'text-green-800';
        case 'En retard':
          return 'text-red-800';
        case 'En cours':
          return 'text-blue-800';
        case 'A faire':
          return 'text-purple-800';
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
          return styles.statusBadgeInfo;
        case 'A faire':
          return styles.statusBadgeWarning;
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
          return styles.statusTextInfo;
        case 'A faire':
          return styles.statusTextWarning;
        default:
          return styles.statusTextDefault;
      }
    };

    return (
      <View className={`px-3 py-1 rounded-full border ${getStatusClasses()}`} style={[styles.statusBadge, getStatusStyle()]}>
        <Text className={`text-xs font-medium ${getTextClasses()}`} style={[styles.statusText, getTextStyle()]}>{status}</Text>
      </View>
    );
  }

export default function Home() {
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [showTailwindTest, setShowTailwindTest] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<TaskItem[]>([]);
  const [logoutLoading, setLogoutLoading] = useState(false);
  
  // États pour le modal de détail
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  
  // Filter states
  const [showDone, setShowDone] = useState(false);
  const [search, setSearch] = useState('');
  const [projectId, setProjectId] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Debug states
  const [debugInfo, setDebugInfo] = useState<{apiUrl:string; email:string; count:number; hasAuth:boolean}>();
  const [error, setError] = useState<string | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [pushRegisterLoading, setPushRegisterLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const logout = async () => {
    setLogoutLoading(true);
    try {
      await supabase.auth.signOut();
      router.replace('/(auth)/login');
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error);
      Alert.alert('Erreur', 'Impossible de se déconnecter. Veuillez réessayer.');
    } finally {
      setLogoutLoading(false);
    }
  };

  const reRegisterDevice = async () => {
    setPushRegisterLoading(true);
    try {
      console.log('[DEBUG PUSH] 🔄 Re-enregistrement du device...');
      
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      
      if (!session) {
        throw new Error('Aucune session active');
      }
      
      const newToken = await registerForPushToken();
      setPushToken(newToken);
      
      if (!newToken) {
        throw new Error('Impossible d\'obtenir le token push');
      }
      
      console.log('[DEBUG PUSH] 🔑 Nouveau token (8 chars):', newToken.slice(0, 8));
      console.log('[DEBUG PUSH] 📧 Email session:', session.user.email);
      console.log('[DEBUG PUSH] 🌐 URL API:', process.env.EXPO_PUBLIC_API_URL);
      
      const result = await registerDevice({
        userId: session.user.id,
        token: newToken,
        platform: Platform.OS as 'ios' | 'android' | 'web',
        isTester: true,
      });
      
      console.log('[DEBUG PUSH] ✅ Device re-enregistré avec succès');
      console.log('[DEBUG PUSH] 📊 Status: 200 OK');
      console.log('[DEBUG PUSH] 🔗 URL:', `${process.env.EXPO_PUBLIC_API_URL}/api/devices/register`);
      
    } catch (error: any) {
      console.log('[DEBUG PUSH] ❌ Erreur re-enregistrement:', error?.message);
      console.log('[DEBUG PUSH] 📊 Status:', error?.status || 'Unknown');
      console.log('[DEBUG PUSH] 🔗 URL:', error?.url || 'Unknown');
      Alert.alert('Erreur', `Échec du re-enregistrement: ${error?.message || 'Unknown error'}`);
    } finally {
      setPushRegisterLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setProjectId('');
    setShowDone(true);
    console.log('[FILTERS] 🔄 Filtres réinitialisés');
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
    console.log('[HOME] 🔄 Début du chargement des tâches...');
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
      if (!showDone) params.statuses = 'A faire,En cours,En retard';
      if (debouncedSearch) params.search = debouncedSearch;
      if (projectId) params.projectId = projectId;

      const queryParts: string[] = [];
      if (params.statuses) queryParts.push(`statuses=${encodeURIComponent(params.statuses)}`);
      if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
      if (params.projectId) queryParts.push(`projectId=${encodeURIComponent(params.projectId)}`);
      const qs = queryParts.join('&');
      const headers = await authHeaders();
      console.log('[HOME] 🔑 Headers auth:', { hasAuth: !!headers.Authorization, tokenPreview: headers.Authorization?.slice(0, 20) + '...' });
      
      const url = `me/tasks${qs ? `?${qs}` : ''}`;
      console.log('[HOME] 🌐 Appel API:', url);
      const resp = await get(url, headers);

      const items = Array.isArray(resp) ? resp : resp.items ?? [];
      const count = Array.isArray(resp) ? resp.length : (resp.count ?? items.length);
      
      console.log('[HOME] ✅ Tâches chargées:', { count, itemsLength: items.length });

      setItems(items);
      setDebugInfo({ apiUrl: process.env.EXPO_PUBLIC_API_URL!, email, count, hasAuth: !!headers.Authorization });
    } catch (e: any) {
      console.log('[HOME] ❌ Erreur lors du chargement:', e?.message);
      setError(e.message ?? String(e));
      Alert.alert('Erreur', e?.message ?? 'Échec du chargement');
    } finally {
      setLoading(false);
    }
  }, [showDone, debouncedSearch, projectId]);

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
      const token = await registerForPushToken();
      setPushToken(token);
      
      if (token) {
        try {
          console.log('[HOME] 📱 Enregistrement du device push...');
          console.log('[HOME] 🔑 Token push (8 chars):', token.slice(0, 8));
          console.log('[HOME] 🌐 URL API:', process.env.EXPO_PUBLIC_API_URL);
          
          await registerDevice({
            userId: session.user.id,
            token,
            platform: Platform.OS as 'ios' | 'android' | 'web',
            isTester,
          });
          console.log('[HOME] ✅ Device enregistré (200 OK)');
        } catch (e: any) {
          console.log('[HOME] ❌ Erreur enregistrement device:', e?.message);
          console.log('[HOME] 📊 Status:', e?.status || 'Unknown');
          console.log('[HOME] 🔗 URL:', e?.url || 'Unknown');
          Alert.alert('Erreur enregistrement device', e?.message ?? 'unknown');
        }
      }
      
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

  const sections = useMemo(() => {
    const inProgressStatuses = new Set(['A faire', 'En cours', 'En retard']);
    const inProgress: TaskItem[] = [];
    const done: TaskItem[] = [];
    for (const t of items) {
      if (inProgressStatuses.has(t.status)) inProgress.push(t); else if (t.status === 'Terminé') done.push(t); else inProgress.push(t);
    }
    const parseDate = (s: string | null) => (s ? new Date(s) : null);
    inProgress.sort((a, b) => {
      const da = parseDate(a.dueDate); const db = parseDate(b.dueDate);
      if (da && db) return da.getTime() - db.getTime();
      if (da && !db) return -1; if (!da && db) return 1; return 0;
    });
    done.sort((a, b) => {
      const da = parseDate(a.dueDate); const db = parseDate(b.dueDate);
      if (da && db) return db.getTime() - da.getTime();
      if (da && !db) return -1; if (!da && db) return 1; return 0;
    });
    return [
      { title: 'En cours', data: inProgress },
      { title: 'Terminées', data: done },
    ];
  }, [items]);

  const renderItem = ({ item }: { item: TaskItem }) => {
    const pct = item.progress == null ? null : Math.round((item.progress <= 1 ? item.progress * 100 : item.progress));
    const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && item.status !== 'Terminé';
    const isCompleted = item.status === 'Terminé';
    
    return (
      <TouchableOpacity
        onPress={() => openTaskDetail(item)}
        activeOpacity={0.7}
        style={styles.card}
      >
        {/* Header simplifié */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title || '(Sans titre)'}
          </Text>
          <StatusBadge status={item.status} />
        </View>
        
        {/* Projet (optionnel) */}
        {item.projectName && (
          <Text style={styles.project}>{item.projectName}</Text>
        )}
        
        {/* Alerte retard minimaliste */}
        {isOverdue && (
          <View style={styles.overdueBar} />
        )}
        
        {/* Footer épuré */}
        <View style={styles.footer}>
          {/* Progression */}
          {pct !== null && (
            <View style={styles.progressWrapper}>
              <View style={[
                styles.progressDot,
                isCompleted ? styles.progressComplete : styles.progressActive
              ]}>
                <Text style={[
                  styles.progressText,
                  isCompleted ? styles.progressTextComplete : styles.progressTextActive
                ]}>
                  {pct}
                </Text>
              </View>
            </View>
          )}
          
          {/* Date */}
          {item.dueDate && (
            <Text style={[styles.date, isOverdue && styles.dateOverdue]}>
              {fmtRel(item.dueDate)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const activeFilters = useMemo(() => {
    const filters = [];
    if (!showDone) filters.push('Ouvertes seulement');
    if (debouncedSearch) filters.push(`Recherche: "${debouncedSearch}"`);
    if (projectId) filters.push(`Projet: ${projectId}`);
    return filters;
  }, [showDone, debouncedSearch, projectId]);

  if (!sessionChecked) return null;

  // Afficher le test Tailwind si activé
  if (showTailwindTest) {
    return <TailwindTest />;
  }

  return (
    <View className="flex-1 bg-bgGray" style={styles.container}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Debug UI - Style Flowli */}
        {__DEV__ && (
          <View className="mb-4" style={styles.debugContainer}>
            <View className="flex-row gap-2 mb-2" style={styles.debugButtons}>
              <TouchableOpacity 
                onPress={() => setShowDebug(!showDebug)}
                className={`px-4 py-2.5 rounded-full ${
                  showDebug 
                    ? 'bg-primary shadow-lg shadow-primary/30' 
                    : 'bg-gray-200 shadow-sm'
                }`}
                style={[
                  styles.debugButton,
                  showDebug ? styles.debugButtonActive : styles.debugButtonInactive
                ]}
              >
                <Text className={`text-xs font-semibold ${
                  showDebug ? 'text-white' : 'text-gray-500'
                }`} style={[
                  styles.debugButtonText,
                  showDebug ? styles.debugButtonTextActive : styles.debugButtonTextInactive
                ]}>
                  {showDebug ? '🔧 Masquer Debug' : '🔧 Debug'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setShowTailwindTest(!showTailwindTest)}
                className={`px-4 py-2.5 rounded-full ${
                  showTailwindTest 
                    ? 'bg-green-500 shadow-lg shadow-green-500/30' 
                    : 'bg-gray-200 shadow-sm'
                }`}
              >
                <Text className={`text-xs font-semibold ${
                  showTailwindTest ? 'text-white' : 'text-gray-500'
                }`}>
                  {showTailwindTest ? '🎨 Retour Normal' : '🎨 Test Tailwind'}
                </Text>
              </TouchableOpacity>
            </View>

            {showDebug && (
              <View className="bg-white p-4 rounded-2xl mt-3 border border-gray-200">
                <Text className="text-sm font-bold mb-3 text-textMain">🔧 Debug Info</Text>
                <View className="space-y-1.5">
                  <Text className="text-xs text-gray-500">API URL: <Text className="font-semibold text-gray-700">{process.env.EXPO_PUBLIC_API_URL}</Text></Text>
                  <Text className="text-xs text-gray-500">Email: <Text className="font-semibold text-gray-700">{debugInfo?.email ?? '—'}</Text></Text>
                  <Text className="text-xs text-gray-500">JWT envoyé: {debugInfo?.hasAuth ? '✅ oui' : '❌ non'}</Text>
                  <Text className="text-xs text-gray-500">Session: {sessionChecked ? '✅ vérifiée' : '❌ non vérifiée'}</Text>
                  <Text className="text-xs text-gray-500">Chargement: {loading ? '⏳ en cours' : '✅ terminé'}</Text>
                  {error
                    ? <Text className="text-xs text-red-600 font-medium">❌ {error}</Text>
                    : <Text className="text-xs text-green-600 font-medium">✅ {debugInfo?.count ?? 0} tâches</Text>
                  }
                </View>
                
                <View className="flex-row flex-wrap gap-2 mt-3">
                  {[
                    { label: 'Load', color: 'bg-blue-600', onPress: load },
                    { label: 'Session', color: 'bg-green-600', onPress: async () => {
                      const { data } = await supabase.auth.getSession();
                      console.log('[DEBUG] Session:', data.session ? '✅' : '❌');
                    }},
                    { label: 'X-Debug', color: 'bg-yellow-600', onPress: async () => {
                      try {
                        const base = process.env.EXPO_PUBLIC_API_URL!.replace(/\/+$/,'');
                        const authHeadersData = await authHeaders();
                        const headers: Record<string, string> = { 
                          ...(authHeadersData.Authorization ? { Authorization: authHeadersData.Authorization } : {}),
                          'X-Debug': '1' 
                        };
                        const url = `${base}/me/tasks?email=louis.lemay02@gmail.com&statuses=A faire,En cours,En retard`;
                        const resp = await fetch(url, { headers });
                        const data = await resp.json();
                        console.log('[DEBUG] X-Debug:', data);
                      } catch (error) {
                        console.log('[DEBUG] Erreur:', error);
                      }
                    }},
                    { label: 'Sans Filtres', color: 'bg-purple-600', onPress: async () => {
                      try {
                        const base = process.env.EXPO_PUBLIC_API_URL!.replace(/\/+$/,'');
                        const authHeadersData = await authHeaders();
                        const headers: Record<string, string> = { 
                          ...(authHeadersData.Authorization ? { Authorization: authHeadersData.Authorization } : {}),
                          'X-Debug': '1' 
                        };
                        const url = `${base}/me/tasks?email=louis.lemay02@gmail.com`;
                        const resp = await fetch(url, { headers });
                        const data = await resp.json();
                        console.log('[DEBUG] Sans filtres:', data);
                      } catch (error) {
                        console.log('[DEBUG] Erreur:', error);
                      }
                    }}
                  ].map((btn, i) => (
                    <TouchableOpacity 
                      key={i}
                      onPress={btn.onPress}
                      className={`${btn.color} px-3 py-1.5 rounded-full`}
                    >
                      <Text className="text-white text-xs font-semibold">{btn.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Debug Push - Style Flowli */}
        {__DEV__ && (
          <View className="bg-yellow-50 p-4 rounded-2xl mb-4 border border-yellow-200">
            <Text className="text-sm font-bold mb-3 text-yellow-800">🔔 Push Notifications</Text>
            
            <View className="space-y-2 mb-3">
              <View>
                <Text className="text-xs text-yellow-700 font-semibold mb-1">API URL</Text>
                <Text className="text-xs text-yellow-600 font-mono">{process.env.EXPO_PUBLIC_API_URL}</Text>
              </View>
              
              <View>
                <Text className="text-xs text-yellow-700 font-semibold mb-1">Email</Text>
                <Text className="text-xs text-yellow-600">{email || '—'}</Text>
              </View>
              
              <View>
                <Text className="text-xs text-yellow-700 font-semibold mb-1">Push Token</Text>
                <Text className="text-xs text-yellow-600 font-mono">
                  {pushToken ? `${pushToken.slice(0, 8)}...` : 'Non disponible'}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              onPress={reRegisterDevice}
              disabled={pushRegisterLoading}
              className={`px-4 py-2.5 rounded-full ${
                pushRegisterLoading 
                  ? 'bg-gray-400 opacity-60' 
                  : 'bg-yellow-600'
              }`}
            >
              <Text className="text-white text-sm font-semibold text-center">
                {pushRegisterLoading ? 'Re-enregistrement...' : 'Re-enregistrer device'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Header - Style Flowli */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <View>
              <Text className="text-3xl font-bold text-textMain mb-1">
                Mes <Text className="text-primary">tâches</Text>
              </Text>
              <Text className="text-secondary">{items.length} tâche{items.length > 1 ? 's' : ''} au total</Text>
            </View>
            
            <View className="flex-row gap-2">
              <TouchableOpacity 
                onPress={logout} 
                disabled={logoutLoading}
                className={`px-4 py-2 rounded-full bg-white border border-red-200 ${
                  logoutLoading ? 'opacity-60' : ''
                }`}
              >
                <Text className="font-semibold text-red-600 text-sm">
                  {logoutLoading ? '...' : 'Déco'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={load} 
                className="px-4 py-2 rounded-full bg-primary shadow-lg shadow-primary/30"
              >
                <Text className="text-white font-semibold text-sm">🔄</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Filtres - Style Flowli Card */}
        <View className="bg-white p-4 rounded-2xl mb-5 border border-gray-100 shadow-sm">
          <Text className="text-base font-bold mb-3 text-textMain">Filtres</Text>
          
          <View className="flex-row items-center mb-3 gap-2">
            <TouchableOpacity
              onPress={() => setShowDone(!showDone)}
              className={`flex-row items-center px-3.5 py-2 rounded-full flex-1 ${
                showDone ? 'bg-primary' : 'bg-gray-100'
              }`}
            >
              <Text className={`font-semibold text-sm ${
                showDone ? 'text-white' : 'text-gray-500'
              }`}>
                {showDone ? '✅ Inclure terminées' : 'Ouvertes seulement'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={resetFilters}
              className="px-3.5 py-2 rounded-full bg-gray-100"
            >
              <Text className="text-gray-500 font-semibold text-sm">Reset</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-2.5">
            <TextInput
              placeholder="🔍 Rechercher dans les tâches..."
              value={search}
              onChangeText={setSearch}
              className="border border-gray-200 rounded-xl px-3.5 py-3 text-sm bg-bgGray text-textMain"
              placeholderTextColor="#94a3b8"
            />

            <TextInput
              placeholder="🏗️ ID du projet (optionnel)"
              value={projectId}
              onChangeText={setProjectId}
              className="border border-gray-200 rounded-xl px-3.5 py-3 text-sm bg-bgGray text-textMain"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {activeFilters.length > 0 && (
            <View className="mt-3">
              <Text className="text-gray-500 text-xs mb-1.5 font-medium">Filtres actifs:</Text>
              <View className="flex-row flex-wrap gap-1.5">
                {activeFilters.map((filter, i) => (
                  <View key={i} className="bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    <Text className="text-blue-700 text-xs font-medium">{filter}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Liste des tâches */}
        <View>
          {sections.map((section) => {
            const displayData = section.title === 'Terminées' && !showDone ? [] : section.data;
            
            if (displayData.length === 0 && section.title === 'Terminées') return null;
            
            return (
              <View key={section.title} className="mb-6">
                <View className="flex-row justify-between items-center mb-3 px-1">
                  <Text className="text-lg font-bold text-textMain">
                    {section.title} ({displayData.length})
                  </Text>
                  {section.title === 'Terminées' && section.data.length > 0 && (
                    <TouchableOpacity 
                      onPress={() => setShowDone(s => !s)}
                      className="px-3 py-1.5 rounded-full bg-gray-100"
                    >
                      <Text className="text-primary font-semibold text-xs">
                        {showDone ? 'Masquer' : 'Afficher'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                {displayData.length === 0 ? (
                  <View className="bg-white p-6 rounded-2xl border border-gray-100 items-center">
                    <Text className="text-3xl mb-2">✨</Text>
                    <Text className="text-gray-500 text-sm">Aucune tâche {section.title.toLowerCase()}</Text>
                  </View>
                ) : (
                  displayData.map((item) => renderItem({ item }))
                )}
              </View>
            );
          })}
        </View>
        
        {loading && (
          <View className="bg-white p-6 rounded-2xl items-center mt-4">
            <Text className="text-primary text-sm font-medium">⏳ Chargement...</Text>
          </View>
        )}
        
        {!loading && items.length === 0 && (
          <View className="bg-white p-8 rounded-2xl items-center border border-gray-100">
            <Text className="text-5xl mb-3">📋</Text>
            <Text className="text-base font-semibold text-textMain mb-1">
              Aucune tâche
            </Text>
            <Text className="text-gray-500 text-sm text-center">
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
  },
  debugContainer: {
    marginBottom: 16,
  },
  debugButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  debugButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  debugButtonActive: {
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  debugButtonInactive: {
    backgroundColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  debugButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  debugButtonTextActive: {
    color: '#FFFFFF',
  },
  debugButtonTextInactive: {
    color: '#6B7280',
  },
  // Nouveaux styles épurés pour les cartes de tâches
  card: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F1F1',
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
    lineHeight: 22,
  },
  project: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 12,
    fontWeight: '500',
  },
  overdueBar: {
    height: 3,
    backgroundColor: '#EF4444',
    borderRadius: 2,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressComplete: {
    backgroundColor: '#ECFDF5',
  },
  progressActive: {
    backgroundColor: '#F5F3FF',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressTextComplete: {
    color: '#059669',
  },
  progressTextActive: {
    color: '#7C3AED',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  dateOverdue: {
    color: '#DC2626',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
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
  statusBadgeInfo: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  statusBadgeWarning: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  statusBadgeDefault: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextSuccess: {
    color: '#166534',
  },
  statusTextError: {
    color: '#DC2626',
  },
  statusTextInfo: {
    color: '#1E40AF',
  },
  statusTextWarning: {
    color: '#D97706',
  },
  statusTextDefault: {
    color: '#6B7280',
  },
});