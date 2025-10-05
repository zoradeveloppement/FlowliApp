import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Alert, Platform, SectionList, RefreshControl, TouchableOpacity, TextInput, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { registerForPushToken } from '@/src/utils/push';
import { registerDevice } from '@/src/lib/api';
import { apiJson } from '@/src/lib/http';

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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const openStatuses = 'A faire,En cours,En retard';
      const qs = new URLSearchParams();
      if (!showDone) qs.set('statuses', openStatuses);
      if (debouncedSearch) qs.set('search', debouncedSearch);
      if (projectId) qs.set('projectId', projectId);
      
      const json = await apiJson(`/me/tasks?${qs.toString()}`);
      setItems(Array.isArray(json.items) ? json.items : []);
    } catch (e: any) {
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Mes tâches</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={load} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#111827', borderRadius: 6 }}>
            <Text style={{ color: 'white' }}>Recharger</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Controls */}
      <View style={{ marginBottom: 16, gap: 12 }}>
        {/* Count and Active Filters */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            {items.length} tâche{items.length !== 1 ? 's' : ''}
            {activeFilters.length > 0 && ` • ${activeFilters.join(', ')}`}
          </Text>
        </View>

        {/* Filter Controls */}
        <View style={{ gap: 12 }}>
          {/* Show Done Toggle */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>Afficher terminées</Text>
            <Switch
              value={showDone}
              onValueChange={setShowDone}
              trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
              thumbColor={showDone ? '#ffffff' : '#f3f4f6'}
            />
          </View>

          {/* Search Input */}
          <View>
            <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>Recherche</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                fontSize: 16,
                backgroundColor: '#ffffff'
              }}
              placeholder="Rechercher dans les tâches..."
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Project ID Input */}
          <View>
            <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>ID Projet (optionnel)</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                fontSize: 16,
                backgroundColor: '#ffffff'
              }}
              placeholder="Filtrer par ID de projet..."
              value={projectId}
              onChangeText={setProjectId}
            />
          </View>
        </View>
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