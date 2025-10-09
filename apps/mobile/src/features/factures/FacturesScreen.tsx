import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform, StyleSheet } from 'react-native';
import { Screen, AppLayout } from '../../ui/layout';
import { Card, Button, Skeleton } from '../../ui/components';

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

const EmptyState: React.FC = () => (
  <Card className="items-center py-8">
    <Text className="text-4xl mb-4">💰</Text>
    <Text className="text-h2 text-textMain mb-2">Aucune facture</Text>
    <Text className="text-body text-textMuted text-center">
      Vous n'avez pas encore de factures.
    </Text>
  </Card>
);

export const FacturesScreen: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockInvoices: Invoice[] = [
        {
          id: '1',
          number: 'FAC-2024-001',
          date: '2024-01-15',
          amount: 2500,
          status: 'paid',
          downloadUrl: 'https://example.com/invoice-1.pdf',
        },
        {
          id: '2',
          number: 'FAC-2024-002',
          date: '2024-01-20',
          amount: 1800,
          status: 'pending',
          downloadUrl: 'https://example.com/invoice-2.pdf',
        },
        {
          id: '3',
          number: 'FAC-2024-003',
          date: '2024-01-25',
          amount: 3200,
          status: 'overdue',
          downloadUrl: 'https://example.com/invoice-3.pdf',
        },
      ];
      
      setInvoices(mockInvoices);
    } catch (err) {
      setError('Erreur lors du chargement des factures');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (invoice: Invoice) => {
    if (Platform.OS === 'web') {
      // Open in new tab
      if (invoice.downloadUrl) {
        window.open(invoice.downloadUrl, '_blank');
      } else {
        Alert.alert('Erreur', 'URL de téléchargement non disponible');
      }
    } else {
      // Mobile: show alert for now (in real app, use expo-file-system or similar)
      Alert.alert(
        'Téléchargement',
        `Télécharger la facture ${invoice.number} ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Télécharger', 
            onPress: () => {
              // Implement actual download logic here
              Alert.alert('Succès', 'Facture téléchargée !');
            }
          },
        ]
      );
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <Screen>
          <View className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} width="100%" height={150} />
            ))}
          </View>
        </Screen>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <Screen>
          <Card className="items-center py-8">
            <Text className="text-4xl mb-4">❌</Text>
            <Text className="text-h2 text-textMain mb-2">Erreur</Text>
            <Text className="text-body text-textMuted text-center mb-4">
              {error}
            </Text>
            <Button
              title="Réessayer"
              variant="primary"
              onPress={loadInvoices}
            />
          </Card>
        </Screen>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Screen>
        <ScrollView className="flex-1">
          <Text className="text-h1 text-textMain mb-6">Factures</Text>
          
          {invoices.length === 0 ? (
            <EmptyState />
          ) : (
            <View>
              <Text className="text-body text-textMuted mb-4">
                {invoices.length} facture{invoices.length > 1 ? 's' : ''} trouvée{invoices.length > 1 ? 's' : ''}
              </Text>
              
              {invoices.map(invoice => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  onDownload={handleDownload}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </Screen>
    </AppLayout>
  );
};

// Styles de fallback pour Expo Go (quand NativeWind ne fonctionne pas)
const styles = StyleSheet.create({
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
