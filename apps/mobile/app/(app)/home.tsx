import { useEffect, useState } from 'react';
import { View, Text, Alert, Platform } from 'react-native';
import { supabase } from '@/src/lib/supabase';
import { registerForPushToken } from '@/src/utils/push';
import { registerDevice } from '@/src/lib/api';

export default function Home() {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) return;

      const isTester = true; // for MVP, mark current account as tester
      const token = await registerForPushToken();
      if (token) {
        try {
          await registerDevice({
            jwt: session.access_token,
            userId: session.user.id,
            token,
            platform: Platform.OS as 'ios' | 'android' | 'web',
            isTester
          });
        } catch (e: any) {
          Alert.alert('Erreur enregistrement device', e?.message ?? 'unknown');
        }
      }

      // Placeholder: later we will fetch the process from the API
      setStatus(null);
    })();
  }, []);

  return (
    <View style={{ padding:16, gap: 8 }}>
      <Text style={{ fontSize:18, fontWeight:'600' }}>Bienvenue 👋</Text>
      <Text>Ton device sera enregistré pour les notifications.</Text>
      <Text>Statut du process: {status ?? '—'}</Text>
    </View>
  );
}
