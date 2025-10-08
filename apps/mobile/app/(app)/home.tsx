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
  const bg = status === 'Terminé' ? '#16a34a33' : status === 'En retard' ? '#dc262633' : '#2563eb33';
  const color = status === 'Terminé' ? '#166534' : status === 'En retard' ? '#991b1b' : '#1e40af';
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 }}>
      <Text style={{ color, fontSize: 12 }}>{status}</Text>
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
      
      // Récupérer la session actuelle
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      
      if (!session) {
        throw new Error('Aucune session active');
      }
      
      // Obtenir un nouveau token push
      const newToken = await registerForPushToken();
      setPushToken(newToken);
      
      if (!newToken) {
        throw new Error('Impossible d\'obtenir le token push');
      }
      
      console.log('[DEBUG PUSH] 🔑 Nouveau token (8 chars):', newToken.slice(0, 8));
      console.log('[DEBUG PUSH] 📧 Email session:', session.user.email);
      console.log('[DEBUG PUSH] 🌐 URL API:', process.env.EXPO_PUBLIC_API_URL);
      
      // Enregistrer le device
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
    setShowDone(true); // Activer "Inclure terminées"
    console.log('[FILTERS] 🔄 Filtres réinitialisés');
  };

  const load = useCallback(async () => {
    console.log('[HOME] 🔄 Début du chargement des tâches...');
    setLoading(true);
    setError(null);
    try {
      // Attendre que la session soit prête (utile sur Web)
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

      // Construire l'URL manuellement pour éviter les problèmes d'encoding
      const queryParts: string[] = [];
      if (params.statuses) queryParts.push(`statuses=${encodeURIComponent(params.statuses)}`);
      if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
      if (params.projectId) queryParts.push(`projectId=${encodeURIComponent(params.projectId)}`);
      const qs = queryParts.join('&');
      const headers = await authHeaders(); // <-- ajoute Authorization
      console.log('[HOME] 🔑 Headers auth:', { hasAuth: !!headers.Authorization, tokenPreview: headers.Authorization?.slice(0, 20) + '...' });
      
      const url = `me/tasks${qs ? `?${qs}` : ''}`;
      console.log('[HOME] 🌐 Appel API:', url);
      const resp = await get(url, headers);

      // Support objet {items,count} ou tableau:
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
      <View style={{ paddingVertical: 10, borderBottomColor: '#e5e7eb', borderBottomWidth: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', flex: 1 }}>{item.title || '(Sans titre)'}</Text>
          <StatusBadge status={item.status} />
        </View>
        <Text style={{ color: '#6b7280', marginTop: 2 }}>{item.projectName || '—'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 12 }}>
          <Text style={{ color: '#374151' }}>{pct == null ? '—' : `${pct}%`}</Text>
          <Text style={{ color: '#6b7280' }}>{fmtRel(item.dueDate)}</Text>
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
    <View style={{ flex: 1, padding: 16 }}>
      {/* Debug UI temporaire */}
      {__DEV__ && (
        <View>
          {/* Bouton de contrôle pour afficher/masquer le debug */}
          <TouchableOpacity 
          onPress={() => setShowDebug(!showDebug)}
          style={{ 
            backgroundColor: showDebug ? '#dc2626' : '#6b7280', 
            paddingHorizontal: 12, 
            paddingVertical: 8, 
            borderRadius: 6, 
            marginBottom: 16,
            alignSelf: 'flex-start'
          }}
        >
          <Text style={{ color: 'white', fontSize: 12, fontWeight: '500' }}>
            {showDebug ? '🔧 Masquer Debug' : '🔧 Afficher Debug'}
          </Text>
        </TouchableOpacity>

        {/* Section debug conditionnelle */}
        {showDebug && (
          <View style={{ backgroundColor: '#f3f4f6', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>🔧 Debug Info</Text>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>API URL: {process.env.EXPO_PUBLIC_API_URL}</Text>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Email: {debugInfo?.email ?? '—'}</Text>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>JWT envoyé: {debugInfo?.hasAuth ? '✅ oui' : '❌ non'}</Text>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Session vérifiée: {sessionChecked ? '✅ oui' : '❌ non'}</Text>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Chargement: {loading ? '⏳ en cours' : '✅ terminé'}</Text>
            {error
              ? <Text style={{ fontSize: 12, color: '#dc2626' }}>Dernier fetch tasks: ❌ {error}</Text>
              : <Text style={{ fontSize: 12, color: '#16a34a' }}>Dernier fetch tasks: ✅ {debugInfo?.count ?? 0} tâches chargées</Text>
            }
          
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <TouchableOpacity 
              onPress={() => {
                console.log('[DEBUG] 🔄 Test de chargement manuel...');
                load();
              }}
              style={{ backgroundColor: '#2563eb', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}
            >
              <Text style={{ color: 'white', fontSize: 12 }}>Test Load</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={async () => {
                console.log('[DEBUG] 🔍 Test de session...');
                const { data } = await supabase.auth.getSession();
                console.log('[DEBUG] Session:', data.session ? '✅ présente' : '❌ absente');
                if (data.session) {
                  console.log('[DEBUG] Email:', data.session.user.email);
                  console.log('[DEBUG] Token:', data.session.access_token?.slice(0, 20) + '...');
                }
              }}
              style={{ backgroundColor: '#16a34a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}
            >
              <Text style={{ color: 'white', fontSize: 12 }}>Test Session</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={async () => {
                console.log('[DEBUG] 🧪 Test avec X-Debug...');
                try {
                  const base = process.env.EXPO_PUBLIC_API_URL!.replace(/\/+$/,'');
                  const authHeadersData = await authHeaders();
                  const headers: Record<string, string> = { 
                    ...(authHeadersData.Authorization ? { Authorization: authHeadersData.Authorization } : {}),
                    'X-Debug': '1' 
                  };
                  const url = `${base}/me/tasks?email=louis.lemay02@gmail.com&statuses=A faire,En cours,En retard`;
                  console.log('[DEBUG] URL:', url);
                  const resp = await fetch(url, { headers });
                  const data = await resp.json();
                  console.log('[DEBUG] Réponse X-Debug:', data);
                } catch (error) {
                  console.log('[DEBUG] Erreur X-Debug:', error);
                }
              }}
              style={{ backgroundColor: '#f59e0b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}
            >
              <Text style={{ color: 'white', fontSize: 12 }}>Test X-Debug</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={async () => {
                console.log('[DEBUG] 🔍 Test sans filtres de statut...');
                try {
                  const base = process.env.EXPO_PUBLIC_API_URL!.replace(/\/+$/,'');
                  const authHeadersData = await authHeaders();
                  const headers: Record<string, string> = { 
                    ...(authHeadersData.Authorization ? { Authorization: authHeadersData.Authorization } : {}),
                    'X-Debug': '1' 
                  };
                  const url = `${base}/me/tasks?email=louis.lemay02@gmail.com`;
                  console.log('[DEBUG] URL sans filtres:', url);
                  const resp = await fetch(url, { headers });
                  const data = await resp.json();
                  console.log('[DEBUG] Réponse sans filtres:', data);
                  if (data.items && data.items.length > 0) {
                    console.log('[DEBUG] Statut de la tâche:', data.items[0].status);
                    console.log('[DEBUG] Titre de la tâche:', data.items[0].title);
                  }
                } catch (error) {
                  console.log('[DEBUG] Erreur sans filtres:', error);
                }
              }}
              style={{ backgroundColor: '#8b5cf6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}
            >
              <Text style={{ color: 'white', fontSize: 12 }}>Test Sans Filtres</Text>
            </TouchableOpacity>
          </View>
          </View>
        )}
        </View>
      )}

      {/* Debug Push Panel */}
      {__DEV__ && (
        <View style={{ backgroundColor: '#fef3c7', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#f59e0b' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#92400e' }}>🔔 Debug Push Notifications</Text>
          
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 12, color: '#92400e', fontWeight: '500' }}>API URL:</Text>
            <Text style={{ fontSize: 11, color: '#a16207', fontFamily: 'monospace' }}>{process.env.EXPO_PUBLIC_API_URL}</Text>
          </View>
          
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 12, color: '#92400e', fontWeight: '500' }}>Email session:</Text>
            <Text style={{ fontSize: 11, color: '#a16207' }}>{email || '—'}</Text>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#92400e', fontWeight: '500' }}>Expo Push Token:</Text>
            <Text style={{ fontSize: 11, color: '#a16207', fontFamily: 'monospace' }}>
              {pushToken ? `${pushToken.slice(0, 8)}...` : 'Non disponible'}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={reRegisterDevice}
            disabled={pushRegisterLoading}
            style={{
              backgroundColor: pushRegisterLoading ? '#9ca3af' : '#f59e0b',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 6,
              opacity: pushRegisterLoading ? 0.6 : 1
            }}
          >
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '500', textAlign: 'center' }}>
              {pushRegisterLoading ? 'Re-enregistrement...' : 'Re-enregistrer device'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Mes tâches</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity 
            onPress={logout} 
            disabled={logoutLoading}
            style={{ 
              padding: 8,
              opacity: logoutLoading ? 0.6 : 1,
              backgroundColor: logoutLoading ? '#f3f4f6' : 'transparent',
              borderRadius: 4
            }}
          >
            <Text style={{ fontWeight: '600', color: logoutLoading ? '#6b7280' : '#dc2626' }}>
              {logoutLoading ? 'Déconnexion...' : 'Déconnexion'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={load} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#111827', borderRadius: 6 }}>
            <Text style={{ color: 'white' }}>Recharger</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barre de filtres */}
      <View style={{ backgroundColor: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#1f2937' }}>Filtres</Text>
        
        {/* Toggle Inclure terminées */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <TouchableOpacity
            onPress={() => setShowDone(!showDone)}
            style={{ 
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12, 
              paddingVertical: 8, 
              backgroundColor: showDone ? '#2563eb' : '#f3f4f6', 
              borderRadius: 6,
              marginRight: 12
            }}
          >
            <Text style={{ color: showDone ? 'white' : '#374151', fontWeight: '500' }}>
              {showDone ? '✅ Inclure terminées' : '❌ Inclure terminées'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={resetFilters}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: '#6b7280',
              borderRadius: 6
            }}
          >
            <Text style={{ color: 'white', fontWeight: '500' }}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs de recherche */}
        <View style={{ gap: 12 }}>
          <TextInput
            placeholder="Rechercher dans les tâches..."
            value={search}
            onChangeText={setSearch}
            style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 6,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
              backgroundColor: 'white'
            }}
          />

          <TextInput
            placeholder="ID du projet (optionnel)"
            value={projectId}
            onChangeText={setProjectId}
            style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 6,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
              backgroundColor: 'white'
            }}
          />
        </View>

        {activeFilters.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            <Text style={{ color: '#6b7280', fontSize: 14 }}>Filtres actifs:</Text>
            {activeFilters.map((filter, i) => (
              <View key={i} style={{ backgroundColor: '#e5e7eb', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                <Text style={{ color: '#374151', fontSize: 12 }}>{filter}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <SectionList
        sections={sections.map(s => s.title === 'Terminées' ? { ...s, data: showDone ? s.data : [] } : s)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title, data } }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{title} ({data.length})</Text>
            {title === 'Terminées' && (
              <TouchableOpacity onPress={() => setShowDone(s => !s)}>
                <Text style={{ color: '#2563eb' }}>{showDone ? 'Masquer' : 'Afficher'}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          !loading ? (
            <Text style={{ color: '#6b7280' }}>Aucune tâche.</Text>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}
