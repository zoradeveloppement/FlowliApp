import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, AppLayout } from '../../ui/layout';
import { Card, Button, Skeleton } from '../../ui/components';
import { supabase } from '@/src/lib/supabase';
import { get } from '@/src/utils/http';
import { AppIcon } from '@/src/ui/icons/AppIcon';

interface ContactData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value?: string }> = ({ icon, label, value }) => {
  if (!value) return null;
  
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLabel}>
        <View style={styles.infoIcon}>{icon}</View>
        <Text style={styles.infoLabelText}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const [contact, setContact] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const loadContact = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[PROFILE] 🔄 Chargement des informations du contact...');
      const resp = await get('me/contact');

      if (!resp.ok) {
        throw new Error(resp.raw || `HTTP ${resp.status}`);
      }

      console.log('[PROFILE] ✅ Contact chargé:', resp.data);
      setContact(resp.data);
    } catch (e: any) {
      console.error('[PROFILE] ❌ Erreur lors du chargement:', e?.message);
      setError(e.message ?? String(e));
      Alert.alert('Erreur', e?.message ?? 'Échec du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadContact();
    } finally {
      setRefreshing(false);
    }
  };

  const logout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
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
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadContact();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <Screen>
          <View style={styles.container}>
            <View style={styles.header}>
              <Skeleton width={200} height={36} style={styles.headerSkeleton} />
              <Skeleton width={150} height={20} style={styles.subheaderSkeleton} />
            </View>
            
            <View style={styles.skeletonContainer}>
              <Skeleton width="100%" height={200} style={styles.skeletonCard} />
              <Skeleton width="100%" height={150} style={styles.skeletonCard} />
            </View>
          </View>
        </Screen>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <Screen>
          <View style={styles.container}>
            <Card style={styles.errorCard}>
              <View style={styles.errorIcon}><AppIcon name="x" size={32} color="#DC2626" /></View>
              <Text style={styles.errorTitle}>Erreur</Text>
              <Text style={styles.errorMessage}>{error}</Text>
              <Button
                title="Réessayer"
                variant="primary"
                onPress={loadContact}
                style={styles.retryButton}
              />
            </Card>
          </View>
        </Screen>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Screen>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Mon <Text style={styles.headerTitleAccent}>Profil</Text>
            </Text>
            <Text style={styles.headerSubtitle}>Vos informations personnelles</Text>
          </View>

          {/* Informations personnelles */}
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}><AppIcon name="user" size={20} variant="muted" /></View>
              <Text style={styles.cardTitle}>Informations personnelles</Text>
            </View>
            
            <View style={styles.cardContent}>
              <InfoRow icon={<AppIcon name="user" size={16} variant="muted" />} label="Nom" value={contact?.name} />
              <InfoRow icon={<AppIcon name="mail" size={16} variant="muted" />} label="Email" value={contact?.email} />
              <InfoRow icon={<AppIcon name="phone" size={16} variant="muted" />} label="Téléphone" value={contact?.phone} />
            </View>
          </Card>

          {/* Entreprise (si disponible) */}
          {(contact?.company || contact?.address) && (
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}><AppIcon name="building" size={20} variant="muted" /></View>
                <Text style={styles.cardTitle}>Entreprise</Text>
              </View>
              
              <View style={styles.cardContent}>
                <InfoRow icon={<AppIcon name="building" size={16} variant="muted" />} label="Nom" value={contact?.company} />
                <InfoRow icon={<AppIcon name="map-pin" size={16} variant="muted" />} label="Adresse" value={contact?.address} />
              </View>
            </Card>
          )}

          {/* Bouton de déconnexion */}
          <TouchableOpacity
            onPress={logout}
            disabled={logoutLoading}
            style={[styles.logoutButton, logoutLoading && styles.logoutButtonDisabled]}
          >
            <Text style={[styles.logoutButtonText, logoutLoading && styles.logoutButtonTextDisabled]}>
              {logoutLoading ? 'Déconnexion...' : '🚪 Se déconnecter'}
            </Text>
          </TouchableOpacity>

          {/* Footer spacer */}
          <View style={styles.footerSpacer} />
        </ScrollView>
      </Screen>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerTitleAccent: {
    color: '#6C63FF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6E6E6E',
  },
  headerSkeleton: {
    marginBottom: 8,
  },
  subheaderSkeleton: {
    marginBottom: 24,
  },
  skeletonContainer: {
    gap: 16,
  },
  skeletonCard: {
    borderRadius: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cardContent: {
    gap: 16,
  },
  infoRow: {
    gap: 8,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
    paddingLeft: 24,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FEE2E2',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    textAlign: 'center',
  },
  logoutButtonTextDisabled: {
    color: '#9CA3AF',
  },
  errorCard: {
    alignItems: 'center',
    padding: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#6E6E6E',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    marginTop: 8,
  },
  footerSpacer: {
    height: 24,
  },
});

