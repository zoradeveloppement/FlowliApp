import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Alert, Platform, SectionList, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
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
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<TaskItem[]>([]);
  
  // Filter states
  const [showDone, setShowDone] = useState(false);
  const [search, setSearch] = useState('');
  const [projectId, setProjectId] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Debug states
  const [debugInfo, setDebugInfo] = useState<{apiUrl:string; email:string; count:number; hasAuth:boolean}>();
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Attendre que la session soit prête (utile sur Web)
      let { data } = await supabase.auth.getSession();
      if (!data.session) {
        await new Promise(r => setTimeout(r, 250));
        ({ data } = await supabase.auth.getSession());
      }
      const email = data.session?.user?.email ?? '';

      const params: Record<string, string> = {};
      if (!showDone) params.statuses = 'A faire,En cours,En retard';
      if (debouncedSearch) params.search = debouncedSearch;
      if (projectId) params.projectId = projectId;

      const qs = new URLSearchParams(params).toString();
      const headers = await authHeaders(); // <-- ajoute Authorization
      const resp = await get(`me/tasks${qs ? `?${qs}` : ''}`, headers);

      // Support objet {items,count} ou tableau:
      const items = Array.isArray(resp) ? resp : resp.items ?? [];
      const count = Array.isArray(resp) ? resp.length : (resp.count ?? items.length);

      setItems(items);
      setDebugInfo({ apiUrl: process.env.EXPO_PUBLIC_API_URL!, email, count, hasAuth: !!headers.Authorization });
    } catch (e: any) {
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
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        setSessionChecked(true);
        router.replace('/(auth)/login');
        return;
      }
      setEmail(session.user.email ?? null);

      const isTester = true;
      const token = await registerForPushToken();
      if (token) {
        try {
          await registerDevice({
            jwt: session.access_token,
            userId: session.user.id,
            token,
            platform: Platform.OS as 'ios' | 'android' | 'web',
            isTester,
          });
        } catch (e: any) {
          Alert.alert('Erreur enregistrement device', e?.message ?? 'unknown');
        }
      }
      setSessionChecked(true);
    })();
  }, [router]);

  useEffect(() => { if (sessionChecked) load(); }, [sessionChecked, load]);

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
        <View style={{ backgroundColor: '#f3f4f6', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>🔧 Debug Info</Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>API URL: {process.env.EXPO_PUBLIC_API_URL}</Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>Email: {debugInfo?.email ?? '—'}</Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>JWT envoyé: {debugInfo?.hasAuth ? '✅ oui' : '❌ non'}</Text>
          {error
            ? <Text style={{ fontSize: 12, color: '#dc2626' }}>Dernier fetch tasks: ❌ {error}</Text>
            : <Text style={{ fontSize: 12, color: '#16a34a' }}>Dernier fetch tasks: ✅ {debugInfo?.count ?? 0} tâches chargées</Text>
          }
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Mes tâches</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={logout} style={{ padding: 8 }}>
            <Text style={{ fontWeight: '600' }}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={load} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#111827', borderRadius: 6 }}>
            <Text style={{ color: 'white' }}>Recharger</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={{ marginBottom: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity 
            onPress={() => setShowDone(!showDone)}
            style={{ 
              paddingHorizontal: 12, 
              paddingVertical: 6, 
              backgroundColor: showDone ? '#2563eb' : '#f3f4f6', 
              borderRadius: 6 
            }}
          >
            <Text style={{ color: showDone ? 'white' : '#374151' }}>Afficher terminées</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Rechercher dans les tâches..."
          value={search}
          onChangeText={setSearch}
          style={{
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 6,
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontSize: 16,
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
            paddingVertical: 8,
            fontSize: 16,
          }}
        />

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
