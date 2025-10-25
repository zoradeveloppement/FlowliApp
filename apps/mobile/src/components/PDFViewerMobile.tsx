import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { tokens } from '@/src/theme/tokens';

interface PDFViewerMobileProps {
  pdfUrl: string;
  onLoadComplete: (numberOfPages: number, filePath: string) => void;
  onPageChanged: (page: number, numberOfPages: number) => void;
  onError: (error: any) => void;
  onPressLink: (uri: string) => void;
  onLoadEnd: () => void;
}

export const PDFViewerMobile: React.FC<PDFViewerMobileProps> = ({
  pdfUrl,
  onLoadComplete,
  onPageChanged,
  onError,
  onPressLink,
  onLoadEnd,
}) => {
  const handleLoadEnd = () => {
    // Simuler le chargement pour la compatibilité
    onLoadComplete(1, pdfUrl);
    onLoadEnd();
  };

  const handleError = (error: any) => {
    console.error('WebView PDF Error:', error);
    onError(error);
  };

  return (
    <WebView
      source={{ uri: pdfUrl }}
      style={styles.pdfViewer}
      onLoadEnd={handleLoadEnd}
      onError={handleError}
      startInLoadingState={true}
      scalesPageToFit={true}
      allowsInlineMediaPlayback={true}
      mediaPlaybackRequiresUserAction={false}
      renderLoading={() => (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
          <Text style={styles.loadingText}>Chargement du PDF...</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
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
});
