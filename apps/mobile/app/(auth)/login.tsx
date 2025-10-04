import { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');

  const sendMagicLink = async () => {
    if (!email) return Alert.alert('Email requis');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // URL de redirection explicite
        emailRedirectTo: 'http://localhost:8081'
      }
    });
    if (error) Alert.alert('Erreur', error.message);
    else Alert.alert('Vérifie tes mails', 'Lien de connexion envoyé. Cliquez sur le lien dans votre email pour vous connecter.');
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 8 }}>Connexion</Text>
      <TextInput
        placeholder="email@exemple.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:12 }}
      />
      <Button title="Recevoir un lien de connexion" onPress={sendMagicLink} />
      <Text style={{ color:'#666', marginTop:8, fontSize:12 }}>
        Conseil: utilise un email auquel tu as accès depuis cet appareil.
      </Text>
    </View>
  );
}
