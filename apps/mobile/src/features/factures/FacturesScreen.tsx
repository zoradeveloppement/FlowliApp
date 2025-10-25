import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Screen, AppLayout } from '../../ui/layout';
import { Card, Button } from '../../ui/components';
import AppIcon from '@/src/ui/icons/AppIcon';
import { tokens } from '@/src/theme/tokens';
import { getInvoices } from '@/src/lib/api';
import { PDFPreviewScreen } from './PDFPreviewScreen';

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
  const [selectedPdf, setSelectedPdf] = useState<{url: string, title: string} | null>(null);

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

  const handleViewPdf = (invoice: Invoice) => {
    if (!invoice.pdfUrl) {
      console.warn('No PDF URL for invoice:', invoice.id);
      return;
    }

    setSelectedPdf({
      url: invoice.pdfUrl,
      title: `Facture ${invoice.number} - ${invoice.projectName}`
    });
  };

  const handleClosePdf = () => {
    setSelectedPdf(null);
  };

  // Debug logs for render state
  console.log('🔍 [FacturesScreen] Render state:', { loading, error, invoicesCount: invoices.length });

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#F7F8FA', // Fond gris clair comme les autres pages
      paddingTop: 60, // Espace pour la navigation
      paddingHorizontal: 20,
      paddingBottom: 100, // Espace pour la navigation du bas
    }}>
      {/* Header élégant */}
      <View style={{
        marginBottom: 30,
      }}>
        <Text style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: '#181C25',
          marginBottom: 8,
        }}>
          <Text style={{ color: '#7C3AED' }}>Facturation</Text>
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#6B7280',
        }}>
          Gérez vos factures et paiements
        </Text>
      </View>
      
      {/* Contenu principal */}
      {loading ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 60,
        }}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={{
            marginTop: 20,
            fontSize: 16,
            color: '#6B7280',
          }}>
            Chargement des factures...
          </Text>
        </View>
      ) : error ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 60,
        }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            padding: 30,
            borderRadius: 16,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}>
            <Text style={{
              fontSize: 48,
              marginBottom: 16,
            }}>
              ❌
            </Text>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#181C25',
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Erreur de chargement
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#6B7280',
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 24,
            }}>
              Impossible de charger les factures. Veuillez réessayer.
            </Text>
            <TouchableOpacity
              onPress={fetchInvoices}
              style={{
                backgroundColor: '#7C3AED',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
                shadowColor: '#7C3AED',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text style={{
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
                Réessayer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : invoices.length === 0 ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 60,
        }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            padding: 30,
            borderRadius: 16,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}>
            <Text style={{
              fontSize: 48,
              marginBottom: 16,
            }}>
              📄
            </Text>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#181C25',
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Aucune facture
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#6B7280',
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Vous n'avez pas encore de factures associées à vos projets.
            </Text>
          </View>
        </View>
      ) : (
        <View>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#181C25',
            marginBottom: 20,
          }}>
            📄 Factures ({invoices.length})
          </Text>
          
          {invoices.map((invoice) => (
            <View
              key={invoice.id}
              style={{
                backgroundColor: '#FFFFFF',
                padding: 20,
                borderRadius: 16,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            >
              {/* Header de la facture */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12,
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#181C25',
                    marginBottom: 4,
                  }}>
                    {invoice.number}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#7C3AED',
                    fontWeight: '500',
                  }}>
                    {invoice.projectName}
                  </Text>
                </View>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#181C25',
                }}>
                  {invoice.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </Text>
              </View>
              
              {/* Actions */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 8,
              }}>
                {invoice.pdfUrl ? (
                  <TouchableOpacity
                    onPress={() => handleViewPdf(invoice)}
                    style={{
                      backgroundColor: '#7C3AED',
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 8,
                      shadowColor: '#7C3AED',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <Text style={{
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      fontSize: 14,
                    }}>
                      📄 Voir PDF
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={{
                    fontSize: 14,
                    color: '#9CA3AF',
                    fontStyle: 'italic',
                  }}>
                    PDF non disponible
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Modal de prévisualisation PDF */}
      <PDFPreviewScreen
        visible={selectedPdf !== null}
        pdfUrl={selectedPdf?.url || ''}
        title={selectedPdf?.title || ''}
        onClose={handleClosePdf}
      />
    </View>
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
