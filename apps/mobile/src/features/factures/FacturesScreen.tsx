import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Screen, AppLayout } from '../../ui/layout';
import { Card, Button } from '../../ui/components';
import { AppIcon } from '@/src/ui/icons/AppIcon';
import { tokens } from '@/src/theme/tokens';

interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  downloadUrl?: string;
}

const InvoiceCard: React.FC<{ invoice: Invoice; onDownload: (invoice: Invoice) => void }> = ({
  invoice,
  onDownload,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-success';
      case 'pending':
        return 'text-warn';
      case 'overdue':
        return 'text-danger';
      default:
        return 'text-textMuted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payée';
      case 'pending':
        return 'En attente';
      case 'overdue':
        return 'En retard';
      default:
        return 'Inconnu';
    }
  };

  return (
    <Card style={styles.invoiceCard}>
      <View style={styles.invoiceHeader}>
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceNumber}>
            Facture #{invoice.number}
          </Text>
          <Text style={styles.invoiceDate}>
            {new Date(invoice.date).toLocaleDateString('fr-FR')}
          </Text>
          <Text style={styles.invoiceAmount}>
            {invoice.amount.toLocaleString('fr-FR')} €
          </Text>
        </View>
        <View style={styles.invoiceStatus}>
          <Text style={[
            styles.statusText,
            getStatusColor(invoice.status) === 'text-success' && styles.statusSuccess,
            getStatusColor(invoice.status) === 'text-warn' && styles.statusWarn,
            getStatusColor(invoice.status) === 'text-danger' && styles.statusDanger,
          ]}>
            {getStatusText(invoice.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.invoiceActions}>
        <Button
          title="📄 Voir PDF"
          variant="secondary"
          size="sm"
          onPress={() => onDownload(invoice)}
        />
        {invoice.downloadUrl && (
          <Button
            title="⬇️ Télécharger"
            variant="primary"
            size="sm"
            onPress={() => onDownload(invoice)}
          />
        )}
      </View>
    </Card>
  );
};

const DevelopmentState: React.FC = () => (
  <Card style={styles.developmentCard}>
    <AppIcon name="wrench" size={48} variant="muted" />
    <Text style={styles.developmentTitle}>
      En cours de développement
    </Text>
    <Text style={styles.developmentMessage}>
      La gestion des factures sera bientôt disponible.
    </Text>
    <View style={styles.developmentBadge}>
      <Text style={styles.developmentBadgeText}>Prochainement</Text>
    </View>
  </Card>
);

export const FacturesScreen: React.FC = () => {
  return (
    <AppLayout>
      <Screen>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              <Text style={styles.headerTitleAccent}>Facturation</Text>
            </Text>
            <Text style={styles.headerSubtitle}>
              Gérez vos factures et paiements
            </Text>
          </View>
          
          <DevelopmentState />
        </ScrollView>
      </Screen>
    </AppLayout>
  );
};

// Styles harmonisés avec la DA de l'onboarding
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: tokens.spacing[4],
  },
  header: {
    marginBottom: tokens.spacing[6],
  },
  headerTitle: {
    fontSize: tokens.font.sizes.h2,
    fontWeight: tokens.font.weights.bold,
    color: tokens.colors.foregroundLight,
    marginBottom: tokens.spacing[1],
  },
  headerTitleAccent: {
    color: tokens.colors.primary,
  },
  headerSubtitle: {
    fontSize: tokens.font.sizes.sm,
    color: tokens.colors.mutedForegroundLight,
  },
  developmentCard: {
    backgroundColor: tokens.colors.backgroundLight,
    borderRadius: tokens.radius['2xl'],
    padding: tokens.spacing[12],
    borderWidth: 1,
    borderColor: tokens.colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  developmentIcon: {
    fontSize: 72,
    marginBottom: tokens.spacing[6],
  },
  developmentTitle: {
    fontSize: tokens.font.sizes.xl,
    fontWeight: tokens.font.weights.semibold,
    color: tokens.colors.foregroundLight,
    marginBottom: tokens.spacing[3],
    textAlign: 'center',
  },
  developmentMessage: {
    fontSize: tokens.font.sizes.md,
    color: tokens.colors.mutedForegroundLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: tokens.spacing[6],
  },
  developmentBadge: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: tokens.spacing[6],
    paddingVertical: tokens.spacing[2],
    borderRadius: tokens.radius.full,
    borderWidth: 1,
    borderColor: '#C4B5FD',
  },
  developmentBadgeText: {
    fontSize: tokens.font.sizes.sm,
    fontWeight: tokens.font.weights.semibold,
    color: tokens.colors.primary,
  },
  invoiceCard: {
    marginBottom: tokens.spacing[4],
  },
  invoiceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing[3],
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: tokens.font.sizes.md,
    color: tokens.colors.foregroundLight,
    fontWeight: tokens.font.weights.medium,
    marginBottom: tokens.spacing[1],
  },
  invoiceDate: {
    fontSize: tokens.font.sizes.sm,
    color: tokens.colors.mutedForegroundLight,
    marginBottom: tokens.spacing[2],
  },
  invoiceAmount: {
    fontSize: tokens.font.sizes.lg,
    color: tokens.colors.foregroundLight,
    fontWeight: tokens.font.weights.semibold,
  },
  invoiceStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: tokens.font.sizes.md,
    fontWeight: tokens.font.weights.medium,
  },
  statusSuccess: {
    color: '#4CAF50',
  },
  statusWarn: {
    color: '#FF9800',
  },
  statusDanger: {
    color: '#F44336',
  },
  invoiceActions: {
    flexDirection: 'row',
    gap: tokens.spacing[3],
  },
});
