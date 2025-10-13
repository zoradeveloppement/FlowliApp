import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Screen, AppLayout } from '../../ui/layout';
import { Card } from '../../ui/components';
import { AppIcon } from '@/src/ui/icons/AppIcon';

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
    <Card className="mb-4" style={styles.invoiceCard}>
      <View className="flex-row items-start justify-between mb-3" style={styles.invoiceHeader}>
        <View className="flex-1" style={styles.invoiceInfo}>
          <Text className="text-body text-textMain font-medium mb-1" style={styles.invoiceNumber}>
            Facture #{invoice.number}
          </Text>
          <Text className="text-secondary text-textMuted mb-2" style={styles.invoiceDate}>
            {new Date(invoice.date).toLocaleDateString('fr-FR')}
          </Text>
          <Text className="text-h2 text-textMain font-semibold" style={styles.invoiceAmount}>
            {invoice.amount.toLocaleString('fr-FR')} €
          </Text>
        </View>
        <View className="items-end" style={styles.invoiceStatus}>
          <Text className={`text-body font-medium ${getStatusColor(invoice.status)}`} style={[
            styles.statusText,
            getStatusColor(invoice.status) === 'text-success' && styles.statusSuccess,
            getStatusColor(invoice.status) === 'text-warn' && styles.statusWarn,
            getStatusColor(invoice.status) === 'text-danger' && styles.statusDanger,
          ]}>
            {getStatusText(invoice.status)}
          </Text>
        </View>
      </View>
      
      <View className="flex-row space-x-3" style={styles.invoiceActions}>
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
  <Card className="items-center py-12" style={styles.developmentCard}>
    <AppIcon name="wrench" size={48} variant="muted" />
    <Text className="text-h1 text-textMain mb-3" style={styles.developmentTitle}>
      En cours de développement
    </Text>
    <Text className="text-body text-textMuted text-center px-6" style={styles.developmentMessage}>
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
        <ScrollView className="flex-1" contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text className="text-h1 text-textMain" style={styles.headerTitle}>
              <Text style={styles.headerTitleAccent}>Facturation</Text>
            </Text>
            <Text className="text-body text-textMuted" style={styles.headerSubtitle}>
              Gérez vos factures et paiements
            </Text>
          </View>
          
          <DevelopmentState />
        </ScrollView>
      </Screen>
    </AppLayout>
  );
};

// Styles de fallback pour Expo Go (quand NativeWind ne fonctionne pas)
const styles = StyleSheet.create({
  container: {
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
  developmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 48,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  developmentIcon: {
    fontSize: 72,
    marginBottom: 24,
  },
  developmentTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  developmentMessage: {
    fontSize: 16,
    color: '#6E6E6E',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  developmentBadge: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C4B5FD',
  },
  developmentBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C63FF',
  },
  invoiceCard: {
    marginBottom: 16,
  },
  invoiceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: 14,
    color: '#6E6E6E',
    marginBottom: 8,
  },
  invoiceAmount: {
    fontSize: 20,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  invoiceStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
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
    gap: 12,
  },
});
