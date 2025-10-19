import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Screen, AppLayout } from '../../ui/layout';
import { Card, Button } from '../../ui/components';
import AppIcon from '@/src/ui/icons/AppIcon';
import { tokens } from '@/src/theme/tokens';
import { getInvoices } from '@/src/lib/api';
import * as WebBrowser from 'expo-web-browser';

interface Invoice {
  id: string;
  number: string;
  amount: number;
  month?: string;
  year?: number;
  projectName: string;
  pdfUrl?: string;
}

const InvoiceCard: React.FC<{ invoice: Invoice; onViewPdf: (invoice: Invoice) => void }> = ({
  invoice,
  onViewPdf,
}) => {
  const getDateDisplay = () => {
    if (invoice.month && invoice.year) {
      return `${invoice.month} ${invoice.year}`;
    } else if (invoice.year) {
      return `${invoice.year}`;
    }
    return '';
  };

  return (
    <Card style={styles.invoiceCard}>
      <View style={styles.invoiceHeader}>
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceNumber}>
            Facture #{invoice.number}
          </Text>
          {getDateDisplay() && (
            <Text style={styles.invoiceDate}>
              {getDateDisplay()}
            </Text>
          )}
          <Text style={styles.invoiceProject}>
            {invoice.projectName}
          </Text>
          <Text style={styles.invoiceAmount}>
            {invoice.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </Text>
        </View>
      </View>
      
      <View style={styles.invoiceActions}>
        {invoice.pdfUrl ? (
          <Button
            title="📄 Voir PDF"
            variant="primary"
            size="sm"
            onPress={() => onViewPdf(invoice)}
          />
        ) : (
          <Text style={styles.noPdfText}>PDF non disponible</Text>
        )}
      </View>
    </Card>
  );
};

const EmptyState: React.FC = () => (
  <Card style={styles.emptyCard}>
    <AppIcon name="receipt" size={48} variant="muted" />
    <Text style={styles.emptyTitle}>
      Aucune facture
    </Text>
    <Text style={styles.emptyMessage}>
      Vous n'avez pas encore de factures associées à vos projets.
    </Text>
  </Card>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <Card style={styles.errorCard}>
    <AppIcon name="x" size={48} variant="destructive" />
    <Text style={styles.errorTitle}>
      Erreur de chargement
    </Text>
    <Text style={styles.errorMessage}>
      Impossible de charger les factures. Veuillez réessayer.
    </Text>
    <Button
      title="Réessayer"
      variant="primary"
      size="md"
      onPress={onRetry}
    />
  </Card>
);

export const FacturesScreen: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchInvoices = async () => {
    try {
      console.log('🔍 [FacturesScreen] Starting fetchInvoices...');
      setLoading(true);
      setError(false);
      
      console.log('🔍 [FacturesScreen] Calling getInvoices()...');
      const response = await getInvoices();
      console.log('🔍 [FacturesScreen] API Response:', JSON.stringify(response, null, 2));
      
      const invoices = response.invoices || [];
      console.log('🔍 [FacturesScreen] Setting invoices:', invoices.length, 'invoices');
      setInvoices(invoices);
    } catch (err) {
      console.error('❌ [FacturesScreen] Error fetching invoices:', err);
      setError(true);
    } finally {
      console.log('🔍 [FacturesScreen] fetchInvoices completed, setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleViewPdf = async (invoice: Invoice) => {
    if (!invoice.pdfUrl) {
      console.warn('No PDF URL for invoice:', invoice.id);
      return;
    }

    try {
      await WebBrowser.openBrowserAsync(invoice.pdfUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      });
    } catch (err) {
      console.error('Error opening PDF:', err);
    }
  };

  // Debug logs for render state
  console.log('🔍 [FacturesScreen] Render state:', { loading, error, invoicesCount: invoices.length });

  return (
    <AppLayout>
      <Screen>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.container, { paddingBottom: 96 }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              <Text style={styles.headerTitleAccent}>Facturation</Text>
            </Text>
            <Text style={styles.headerSubtitle}>
              Gérez vos factures et paiements
            </Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={tokens.colors.primary} />
              <Text style={styles.loadingText}>Chargement des factures...</Text>
            </View>
          ) : error ? (
            <ErrorState onRetry={fetchInvoices} />
          ) : invoices.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {invoices.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  onViewPdf={handleViewPdf}
                />
              ))}
            </>
          )}
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
    paddingTop: tokens.spacing[16], // Encore plus d'espace en haut
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
  loadingContainer: {
    padding: tokens.spacing[12],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: tokens.spacing[4],
    fontSize: tokens.font.sizes.md,
    color: tokens.colors.mutedForegroundLight,
  },
  emptyCard: {
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
  emptyTitle: {
    fontSize: tokens.font.sizes.xl,
    fontWeight: tokens.font.weights.semibold,
    color: tokens.colors.foregroundLight,
    marginTop: tokens.spacing[4],
    marginBottom: tokens.spacing[2],
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: tokens.font.sizes.md,
    color: tokens.colors.mutedForegroundLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorCard: {
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
  errorTitle: {
    fontSize: tokens.font.sizes.xl,
    fontWeight: tokens.font.weights.semibold,
    color: tokens.colors.foregroundLight,
    marginTop: tokens.spacing[4],
    marginBottom: tokens.spacing[2],
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: tokens.font.sizes.md,
    color: tokens.colors.mutedForegroundLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: tokens.spacing[6],
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
    marginBottom: tokens.spacing[1],
  },
  invoiceProject: {
    fontSize: tokens.font.sizes.sm,
    color: tokens.colors.primary,
    marginBottom: tokens.spacing[2],
    fontWeight: tokens.font.weights.medium,
  },
  invoiceAmount: {
    fontSize: tokens.font.sizes.lg,
    color: tokens.colors.foregroundLight,
    fontWeight: tokens.font.weights.semibold,
  },
  noPdfText: {
    fontSize: tokens.font.sizes.sm,
    color: tokens.colors.mutedForegroundLight,
    fontStyle: 'italic',
  },
  invoiceActions: {
    flexDirection: 'row',
    gap: tokens.spacing[3],
  },
});
