import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, RefreshControl, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, AppLayout } from '../../ui/layout';
import { Card, Button, Skeleton } from '../../ui/components';
import { supabase } from '@/src/lib/supabase';
import { get } from '@/src/utils/http';
import { AppIcon } from '@/src/ui/icons/AppIcon';
import { tokens } from '@/src/theme/tokens';
import { useFadeInDelayed } from '@/src/animations';

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
  
  // Animations d'apparition
  const headerAnim = useFadeInDelayed({ delay: 0 });
  const personalInfoAnim = useFadeInDelayed({ delay: 200 });
  const companyInfoAnim = useFadeInDelayed({ delay: 400 });
  const logoutAnim = useFadeInDelayed({ delay: 600 });

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
              router.replace('/(public)/onboarding');
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
      <View className="flex-1 bg-bgGray" style={styles.container}>
        <ScrollView className="flex-1" contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerSection}>
            <Skeleton width={200} height={36} style={styles.headerSkeleton} />
            <Skeleton width={150} height={20} style={styles.subheaderSkeleton} />
          </View>
          
          <View style={styles.skeletonContainer}>
            <Skeleton width="100%" height={200} style={styles.skeletonCard} />
            <Skeleton width="100%" height={150} style={styles.skeletonCard} />
          </View>
        </ScrollView>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-bgGray" style={styles.container}>
        <ScrollView className="flex-1" contentContainerStyle={styles.scrollContent}>
          <View style={styles.errorCard}>
            <View style={styles.errorIcon}><AppIcon name="x" size={32} color="#DC2626" /></View>
            <Text style={styles.errorTitle}>Erreur</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <Button
              title="Réessayer"
              variant="primary"
              onPress={loadContact}
              style={styles.retryButton}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

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
                Mon <Text className="text-primary" style={styles.headerTitleAccent}>Profil</Text>
              </Text>
              <Text className="text-secondary" style={styles.headerSubtitle}>Vos informations personnelles</Text>
            </View>
          </View>
        </Animated.View>

        {/* Informations personnelles - Style Flowli Card */}
        <Animated.View style={[styles.card, personalInfoAnim]} className="bg-white p-4 rounded-2xl mb-5 border border-gray-100 shadow-sm">
          <View className="flex-row items-center mb-4" style={styles.cardHeader}>
            <View className="w-10 h-10 rounded-full bg-violet-100 items-center justify-center mr-3" style={styles.cardIconContainer}>
              <AppIcon name="user" size={20} variant="muted" />
            </View>
            <Text className="text-lg font-bold text-textMain" style={styles.cardTitle}>Informations personnelles</Text>
          </View>
          
          <View style={styles.cardContent}>
            <InfoRow icon={<AppIcon name="user" size={16} variant="muted" />} label="Nom" value={contact?.name} />
            <InfoRow icon={<AppIcon name="mail" size={16} variant="muted" />} label="Email" value={contact?.email} />
            <InfoRow icon={<AppIcon name="phone" size={16} variant="muted" />} label="Téléphone" value={contact?.phone} />
          </View>
        </Animated.View>

        {/* Entreprise (si disponible) - Style Flowli Card */}
        {(contact?.company || contact?.address) && (
          <Animated.View style={[styles.card, companyInfoAnim]} className="bg-white p-4 rounded-2xl mb-5 border border-gray-100 shadow-sm">
            <View className="flex-row items-center mb-4" style={styles.cardHeader}>
              <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3" style={styles.cardIconContainer}>
                <AppIcon name="building" size={20} variant="muted" />
              </View>
              <Text className="text-lg font-bold text-textMain" style={styles.cardTitle}>Entreprise</Text>
            </View>
            
            <View style={styles.cardContent}>
              <InfoRow icon={<AppIcon name="building" size={16} variant="muted" />} label="Nom" value={contact?.company} />
              <InfoRow icon={<AppIcon name="map-pin" size={16} variant="muted" />} label="Adresse" value={contact?.address} />
            </View>
          </Animated.View>
        )}

        {/* Bouton de déconnexion - Style Flowli */}
        <Animated.View style={logoutAnim}>
          <TouchableOpacity
            onPress={logout}
            disabled={logoutLoading}
            className={`px-6 py-4 rounded-2xl border-2 ${
              logoutLoading 
                ? 'bg-gray-100 border-gray-200 opacity-60' 
                : 'bg-white border-red-200 shadow-sm'
            }`}
            style={[
              styles.logoutButton,
              logoutLoading && styles.logoutButtonDisabled
            ]}
          >
            <View className="flex-row items-center justify-center">
              <AppIcon name="logOut" size={20} variant="muted" />
              <Text className={`ml-2 text-base font-semibold ${
                logoutLoading ? 'text-gray-500' : 'text-red-600'
              }`} style={[
                styles.logoutButtonText,
                logoutLoading && styles.logoutButtonTextDisabled
              ]}>
                {logoutLoading ? 'Déconnexion...' : 'Se déconnecter'}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer spacer */}
        <View style={styles.footerSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollContent: {
    padding: 16,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerTitleAccent: {
    color: '#7C3AED',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
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
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    borderRadius: 16,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    marginTop: 8,
  },
  footerSpacer: {
    height: 24,
  },
  // Skeleton styles
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
});

