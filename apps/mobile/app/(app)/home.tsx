import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, SectionList, RefreshControl, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, AppLayout } from '../../src/ui/layout';
import { Card, Progress, Badge, Button } from '../../src/ui/components';
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
  // Style Flowli: pills arrondis avec couleurs douces
  const configs = {
    'Terminé': { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
    'En retard': { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
    'En cours': { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
    'A faire': { bg: '#f5f3ff', color: '#5b21b6', border: '#ddd6fe' },
  };
  const config = configs[status as keyof typeof configs] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' };
  
  return (
    <View style={{ 
      backgroundColor: config.bg, 
      paddingHorizontal: 12, 
      paddingVertical: 4, 
      borderRadius: 999,
      borderWidth: 1,
      borderColor: config.border
    }}>
      <Text style={{ color: config.color, fontSize: 12, fontWeight: '500' }}>{status}</Text>
    </View>
  );
}

export default function Home() {
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<TaskItem[]>([]);
  const [logoutLoading, setLogoutLoading] = useState(false);
  
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
    return (
      <View style={{ 
        backgroundColor: 'white',
        marginBottom: 12,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', flex: 1, marginRight: 8, color: '#111827' }}>
            {item.title || '(Sans titre)'}
          </Text>
          <StatusBadge status={item.status} />
        </View>
        
        {item.projectName && (
          <View style={{ 
            backgroundColor: '#f8fafc', 
            alignSelf: 'flex-start',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            marginBottom: 8
          }}>
            <Text style={{ color: '#64748b', fontSize: 12, fontWeight: '500' }}>{item.projectName}</Text>
          </View>
        )}
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {pct !== null && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ 
                width: 32, 
                height: 32, 
                borderRadius: 999, 
                backgroundColor: pct === 100 ? '#f0fdf4' : '#eff6ff',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: pct === 100 ? '#bbf7d0' : '#bfdbfe'
              }}>
                <Text style={{ 
                  fontSize: 11, 
                  fontWeight: '700',
                  color: pct === 100 ? '#166534' : '#1e40af'
                }}>
                  {pct}%
                </Text>
              </View>
            </View>
          )}
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 16 }}>📅</Text>
            <Text style={{ color: '#64748b', fontSize: 13, fontWeight: '500' }}>{fmtRel(item.dueDate)}</Text>
          </View>
        </View>
      </View>
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

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Debug UI - Style Flowli */}
        {__DEV__ && (
          <View style={{ marginBottom: 16 }}>
            <TouchableOpacity 
              onPress={() => setShowDebug(!showDebug)}
              style={{ 
                backgroundColor: showDebug ? '#7c3aed' : '#e2e8f0', 
                paddingHorizontal: 16, 
                paddingVertical: 10, 
                borderRadius: 999,
                alignSelf: 'flex-start',
                shadowColor: showDebug ? '#7c3aed' : '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: showDebug ? 0.3 : 0.05,
                shadowRadius: 4,
                elevation: 2
              }}
            >
              <Text style={{ color: showDebug ? 'white' : '#64748b', fontSize: 13, fontWeight: '600' }}>
                {showDebug ? '🔧 Masquer Debug' : '🔧 Debug'}
              </Text>
            </TouchableOpacity>

            {showDebug && (
              <View style={{ 
                backgroundColor: 'white', 
                padding: 16, 
                borderRadius: 16, 
                marginTop: 12,
                borderWidth: 1,
                borderColor: '#e2e8f0'
              }}>
                <Text style={{ fontSize: 15, fontWeight: '700', marginBottom: 12, color: '#111827' }}>🔧 Debug Info</Text>
                <View style={{ gap: 6 }}>
                  <Text style={{ fontSize: 12, color: '#64748b' }}>API URL: <Text style={{ fontWeight: '600', color: '#374151' }}>{process.env.EXPO_PUBLIC_API_URL}</Text></Text>
                  <Text style={{ fontSize: 12, color: '#64748b' }}>Email: <Text style={{ fontWeight: '600', color: '#374151' }}>{debugInfo?.email ?? '—'}</Text></Text>
                  <Text style={{ fontSize: 12, color: '#64748b' }}>JWT envoyé: {debugInfo?.hasAuth ? '✅ oui' : '❌ non'}</Text>
                  <Text style={{ fontSize: 12, color: '#64748b' }}>Session: {sessionChecked ? '✅ vérifiée' : '❌ non vérifiée'}</Text>
                  <Text style={{ fontSize: 12, color: '#64748b' }}>Chargement: {loading ? '⏳ en cours' : '✅ terminé'}</Text>
                  {error
                    ? <Text style={{ fontSize: 12, color: '#dc2626', fontWeight: '500' }}>❌ {error}</Text>
                    : <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '500' }}>✅ {debugInfo?.count ?? 0} tâches</Text>
                  }
                </View>
                
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                  {[
                    { label: 'Load', color: '#2563eb', onPress: load },
                    { label: 'Session', color: '#16a34a', onPress: async () => {
                      const { data } = await supabase.auth.getSession();
                      console.log('[DEBUG] Session:', data.session ? '✅' : '❌');
                    }},
                    { label: 'X-Debug', color: '#f59e0b', onPress: async () => {
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
                    { label: 'Sans Filtres', color: '#8b5cf6', onPress: async () => {
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
                      style={{ 
                        backgroundColor: btn.color, 
                        paddingHorizontal: 12, 
                        paddingVertical: 6, 
                        borderRadius: 999 
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: 11, fontWeight: '600' }}>{btn.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Debug Push - Style Flowli */}
        {__DEV__ && (
          <View style={{ 
            backgroundColor: '#fffbeb', 
            padding: 16, 
            borderRadius: 16, 
            marginBottom: 16, 
            borderWidth: 1, 
            borderColor: '#fef3c7' 
          }}>
            <Text style={{ fontSize: 15, fontWeight: '700', marginBottom: 12, color: '#78350f' }}>🔔 Push Notifications</Text>
            
            <View style={{ gap: 8, marginBottom: 12 }}>
              <View>
                <Text style={{ fontSize: 11, color: '#92400e', fontWeight: '600', marginBottom: 2 }}>API URL</Text>
                <Text style={{ fontSize: 10, color: '#a16207', fontFamily: 'monospace' }}>{process.env.EXPO_PUBLIC_API_URL}</Text>
              </View>
              
              <View>
                <Text style={{ fontSize: 11, color: '#92400e', fontWeight: '600', marginBottom: 2 }}>Email</Text>
                <Text style={{ fontSize: 11, color: '#a16207' }}>{email || '—'}</Text>
              </View>
              
              <View>
                <Text style={{ fontSize: 11, color: '#92400e', fontWeight: '600', marginBottom: 2 }}>Push Token</Text>
                <Text style={{ fontSize: 10, color: '#a16207', fontFamily: 'monospace' }}>
                  {pushToken ? `${pushToken.slice(0, 8)}...` : 'Non disponible'}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              onPress={reRegisterDevice}
              disabled={pushRegisterLoading}
              style={{
                backgroundColor: pushRegisterLoading ? '#d1d5db' : '#f59e0b',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 999,
                opacity: pushRegisterLoading ? 0.6 : 1
              }}
            >
              <Text style={{ color: 'white', fontSize: 13, fontWeight: '600', textAlign: 'center' }}>
                {pushRegisterLoading ? 'Re-enregistrement...' : 'Re-enregistrer device'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Header - Style Flowli */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <View>
              <Text style={{ fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 4 }}>
                Mes <Text style={{ color: '#7c3aed' }}>tâches</Text>
              </Text>
              <Text style={{ fontSize: 14, color: '#64748b' }}>{items.length} tâche{items.length > 1 ? 's' : ''} au total</Text>
            </View>
            
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity 
                onPress={logout} 
                disabled={logoutLoading}
                style={{ 
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#fecaca',
                  opacity: logoutLoading ? 0.6 : 1
                }}
              >
                <Text style={{ fontWeight: '600', color: '#dc2626', fontSize: 13 }}>
                  {logoutLoading ? '...' : 'Déco'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={load} 
                style={{ 
                  paddingHorizontal: 16, 
                  paddingVertical: 8, 
                  backgroundColor: '#7c3aed', 
                  borderRadius: 999,
                  shadowColor: '#7c3aed',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>🔄</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Filtres - Style Flowli Card */}
        <View style={{ 
          backgroundColor: 'white', 
          padding: 16, 
          borderRadius: 20, 
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#f1f5f9',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2
        }}>
          <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#111827' }}>Filtres</Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
            <TouchableOpacity
              onPress={() => setShowDone(!showDone)}
              style={{ 
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14, 
                paddingVertical: 8, 
                backgroundColor: showDone ? '#7c3aed' : '#f1f5f9', 
                borderRadius: 999,
                flex: 1
              }}
            >
              <Text style={{ color: showDone ? 'white' : '#64748b', fontWeight: '600', fontSize: 13 }}>
                {showDone ? '✅ Inclure terminées' : 'Ouvertes seulement'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={resetFilters}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                backgroundColor: '#f1f5f9',
                borderRadius: 999
              }}
            >
              <Text style={{ color: '#64748b', fontWeight: '600', fontSize: 13 }}>Reset</Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 10 }}>
            <TextInput
              placeholder="🔍 Rechercher dans les tâches..."
              value={search}
              onChangeText={setSearch}
              style={{
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                backgroundColor: '#f8fafc',
                color: '#111827'
              }}
              placeholderTextColor="#94a3b8"
            />

            <TextInput
              placeholder="🏗️ ID du projet (optionnel)"
              value={projectId}
              onChangeText={setProjectId}
              style={{
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 14,
                backgroundColor: '#f8fafc',
                color: '#111827'
              }}
              placeholderTextColor="#94a3b8"
            />
          </View>

          {activeFilters.length > 0 && (
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 6, fontWeight: '500' }}>Filtres actifs:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {activeFilters.map((filter, i) => (
                  <View key={i} style={{ 
                    backgroundColor: '#f0f9ff', 
                    paddingHorizontal: 10, 
                    paddingVertical: 4, 
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: '#bae6fd'
                  }}>
                    <Text style={{ color: '#0369a1', fontSize: 11, fontWeight: '500' }}>{filter}</Text>
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
              <View key={section.title} style={{ marginBottom: 24 }}>
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: 12,
                  paddingHorizontal: 4
                }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
                    {section.title} ({displayData.length})
                  </Text>
                  {section.title === 'Terminées' && section.data.length > 0 && (
                    <TouchableOpacity 
                      onPress={() => setShowDone(s => !s)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 999,
                        backgroundColor: '#f1f5f9'
                      }}
                    >
                      <Text style={{ color: '#7c3aed', fontWeight: '600', fontSize: 12 }}>
                        {showDone ? 'Masquer' : 'Afficher'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                {displayData.length === 0 ? (
                  <View style={{ 
                    backgroundColor: 'white',
                    padding: 24,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#f1f5f9',
                    alignItems: 'center'
                  }}>
                    <Text style={{ fontSize: 32, marginBottom: 8 }}>✨</Text>
                    <Text style={{ color: '#64748b', fontSize: 14 }}>Aucune tâche {section.title.toLowerCase()}</Text>
                  </View>
                ) : (
                  displayData.map((item) => renderItem({ item }))
                )}
              </View>
            );
          })}
        </View>
        
        {loading && (
          <View style={{ 
            backgroundColor: 'white',
            padding: 24,
            borderRadius: 16,
            alignItems: 'center',
            marginTop: 16
          }}>
            <Text style={{ color: '#7c3aed', fontSize: 14, fontWeight: '500' }}>⏳ Chargement...</Text>
          </View>
        )}
        
        {!loading && items.length === 0 && (
          <View style={{ 
            backgroundColor: 'white',
            padding: 32,
            borderRadius: 20,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#f1f5f9'
          }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>📋</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
              Aucune tâche
            </Text>
            <Text style={{ color: '#64748b', fontSize: 14, textAlign: 'center' }}>
              Vous n'avez pas encore de tâches assignées
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}