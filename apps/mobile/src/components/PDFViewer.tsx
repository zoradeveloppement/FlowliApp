import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { tokens } from '@/src/theme/tokens';
import { PDFViewerMobile } from './PDFViewerMobile';

interface PDFViewerProps {
  pdfUrl: string;
  onClose: () => void;
  title?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, onClose, title = 'Facture' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pour Web, on utilise une iframe avec l'URL du PDF
  const isWeb = Platform.OS === 'web';

  const handleError = (error: any) => {
    console.error('PDF Viewer Error:', error);
    setError('Impossible de charger le PDF. Vérifiez votre connexion internet.');
    setLoading(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
    setError(null);
  };

  // Gestion des erreurs de réseau
  useEffect(() => {
    if (!pdfUrl) {
      setError('URL du PDF manquante');
      setLoading(false);
    } else if (isWeb) {
      // Sur web, on arrête le loading immédiatement car on affiche juste un bouton
      setLoading(false);
    }
  }, [pdfUrl, isWeb]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorTitle}>Erreur de chargement</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <Text style={styles.errorHint}>
          Vérifiez votre connexion internet et réessayez.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header avec titre et bouton fermer */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.closeButton} onPress={onClose}>
          ✕
        </Text>
      </View>

      {/* Zone de prévisualisation */}
      <View style={styles.viewerContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tokens.colors.primary} />
            <Text style={styles.loadingText}>Chargement du PDF...</Text>
          </View>
        )}

        {isWeb ? (
          // Version Web : ouverture directe du PDF
          <View style={styles.webContainer}>
            <Text style={styles.webMessage}>
              📄 PDF disponible
            </Text>
            <Text style={styles.webSubtext}>
              Le PDF s'ouvrira dans un nouvel onglet
            </Text>
            <View style={styles.webActions}>
              <Text 
                style={styles.webLink}
                onPress={() => {
                  window.open(pdfUrl, '_blank');
                  handleLoadEnd();
                }}
              >
                Ouvrir le PDF
              </Text>
            </View>
          </View>
        ) : (
          // Version iOS/Android : react-native-pdf
          <PDFViewerMobile
            pdfUrl={pdfUrl}
            onLoadComplete={(numberOfPages: number, filePath: string) => {
              console.log(`PDF loaded: ${numberOfPages} pages`);
              handleLoadEnd();
            }}
            onPageChanged={(page: number, numberOfPages: number) => {
              console.log(`Current page: ${page}/${numberOfPages}`);
            }}
            onError={handleError}
            onPressLink={(uri: string) => {
              console.log(`Link pressed: ${uri}`);
            }}
            onLoadEnd={handleLoadEnd}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing[4],
    paddingVertical: tokens.spacing[3],
    backgroundColor: tokens.colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: tokens.font.sizes.lg,
    fontWeight: tokens.font.weights.semibold,
    color: tokens.colors.foregroundLight,
    flex: 1,
    marginRight: tokens.spacing[2],
  },
  closeButton: {
    fontSize: 24,
    color: tokens.colors.mutedForegroundLight,
    padding: tokens.spacing[1],
    minWidth: 32,
    textAlign: 'center',
  },
  viewerContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  pdfViewer: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.backgroundLight,
    zIndex: 1,
  },
  loadingText: {
    marginTop: tokens.spacing[3],
    fontSize: tokens.font.sizes.md,
    color: tokens.colors.mutedForegroundLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing[8],
    backgroundColor: tokens.colors.backgroundLight,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: tokens.spacing[4],
  },
  errorTitle: {
    fontSize: tokens.font.sizes.xl,
    fontWeight: tokens.font.weights.semibold,
    color: tokens.colors.foregroundLight,
    marginBottom: tokens.spacing[2],
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: tokens.font.sizes.md,
    color: tokens.colors.mutedForegroundLight,
    textAlign: 'center',
    marginBottom: tokens.spacing[2],
    lineHeight: 24,
  },
  errorHint: {
    fontSize: tokens.font.sizes.sm,
    color: tokens.colors.mutedForegroundLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing[8],
    backgroundColor: tokens.colors.backgroundLight,
  },
  fallbackText: {
    fontSize: tokens.font.sizes.lg,
    fontWeight: tokens.font.weights.semibold,
    color: tokens.colors.foregroundLight,
    textAlign: 'center',
    marginBottom: tokens.spacing[2],
  },
  fallbackSubtext: {
    fontSize: tokens.font.sizes.md,
    color: tokens.colors.mutedForegroundLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing[8],
    backgroundColor: tokens.colors.backgroundLight,
  },
  webMessage: {
    fontSize: tokens.font.sizes.xl,
    fontWeight: tokens.font.weights.semibold,
    color: tokens.colors.foregroundLight,
    textAlign: 'center',
    marginBottom: tokens.spacing[2],
  },
  webSubtext: {
    fontSize: tokens.font.sizes.md,
    color: tokens.colors.mutedForegroundLight,
    textAlign: 'center',
    marginBottom: tokens.spacing[6],
    lineHeight: 24,
  },
  webActions: {
    alignItems: 'center',
  },
  webLink: {
    fontSize: tokens.font.sizes.lg,
    fontWeight: tokens.font.weights.semibold,
    color: tokens.colors.primary,
    textAlign: 'center',
    padding: tokens.spacing[4],
    backgroundColor: tokens.colors.primaryGlow,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderColor: tokens.colors.primary,
    minWidth: 200,
    cursor: 'pointer',
  },
});
