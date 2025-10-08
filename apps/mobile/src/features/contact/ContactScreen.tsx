import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { Screen, AppLayout } from '../../ui/layout';
import { Card, Button, Input } from '../../ui/components';

const ContactCard: React.FC<{
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
}> = ({ title, subtitle, icon, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Card className="mb-4">
      <View className="flex-row items-center">
        <Text className="text-3xl mr-4">{icon}</Text>
        <View className="flex-1">
          <Text className="text-body text-textMain font-medium mb-1">
            {title}
          </Text>
          <Text className="text-secondary text-textMuted">
            {subtitle}
          </Text>
        </View>
        <Text className="text-textMuted">→</Text>
      </View>
    </Card>
  </TouchableOpacity>
);

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setSending(true);
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    Alert.alert(
      'Message envoyé',
      'Votre message a été transmis à notre équipe. Nous vous répondrons dans les plus brefs délais.',
      [{ text: 'OK', onPress: () => {
        setName('');
        setEmail('');
        setMessage('');
      }}]
    );
    
    setSending(false);
  };

  return (
    <Card>
      <Text className="text-h2 text-textMain mb-4">Nous contacter</Text>
      
      <View className="space-y-4">
        <Input
          label="Votre nom"
          placeholder="Jean Dupont"
          value={name}
          onChangeText={setName}
        />
        
        <Input
          label="Email"
          placeholder="jean@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <View>
          <Text className="text-body text-textMain font-medium mb-2">
            Message
          </Text>
          <Input
            placeholder="Décrivez votre demande..."
            value={message}
            onChangeText={setMessage}
            // For multiline, you'd need a TextArea component
          />
        </View>
        
        <Button
          title={sending ? "Envoi en cours..." : "Envoyer le message"}
          variant="primary"
          onPress={handleSubmit}
          disabled={sending}
        />
      </View>
    </Card>
  );
};

export const ContactScreen: React.FC = () => {
  const handleEmailPress = () => {
    const email = 'contact@flowli.com';
    const subject = 'Demande de support';
    const body = 'Bonjour,\n\n';
    
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application email');
    });
  };

  const handlePhonePress = () => {
    const phone = '+33123456789';
    
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application téléphone');
    });
  };

  const handleWhatsAppPress = () => {
    const phone = '+33123456789';
    const message = 'Bonjour, j\'ai une question concernant mon projet Flowli.';
    
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Erreur', 'WhatsApp n\'est pas installé sur votre appareil');
    });
  };

  return (
    <AppLayout>
      <Screen>
        <ScrollView className="flex-1">
          <Text className="text-h1 text-textMain mb-6">Contact</Text>
          
          {/* Contact Info */}
          <Card className="mb-6">
            <Text className="text-h2 text-textMain mb-4">Informations de contact</Text>
            <Text className="text-body text-textMuted mb-4">
              Notre équipe est là pour vous accompagner dans votre projet. 
              N'hésitez pas à nous contacter par le moyen qui vous convient le mieux.
            </Text>
            
            <View className="space-y-2">
              <View className="flex-row items-center">
                <Text className="text-lg mr-3">📧</Text>
                <Text className="text-body text-textMain">contact@flowli.com</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-lg mr-3">📞</Text>
                <Text className="text-body text-textMain">+33 1 23 45 67 89</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-lg mr-3">🕒</Text>
                <Text className="text-body text-textMain">Lun-Ven 9h-18h</Text>
              </View>
            </View>
          </Card>

          {/* Quick Contact */}
          <Text className="text-h2 text-textMain mb-4">Contact rapide</Text>
          
          <ContactCard
            title="Email"
            subtitle="contact@flowli.com"
            icon="📧"
            onPress={handleEmailPress}
          />
          
          <ContactCard
            title="Téléphone"
            subtitle="+33 1 23 45 67 89"
            icon="📞"
            onPress={handlePhonePress}
          />
          
          <ContactCard
            title="WhatsApp"
            subtitle="Message instantané"
            icon="💬"
            onPress={handleWhatsAppPress}
          />

          {/* Contact Form */}
          <View className="mt-8">
            <ContactForm />
          </View>

          {/* Support Info */}
          <Card className="mt-6">
            <Text className="text-h2 text-textMain mb-4">Support technique</Text>
            <Text className="text-body text-textMuted mb-4">
              Pour toute question technique ou problème avec l'application, 
              notre équipe support est disponible du lundi au vendredi de 9h à 18h.
            </Text>
            <Text className="text-secondary text-textMuted">
              Temps de réponse moyen : 2-4 heures en journée
            </Text>
          </Card>
        </ScrollView>
      </Screen>
    </AppLayout>
  );
};
