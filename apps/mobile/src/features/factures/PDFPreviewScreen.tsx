import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform, Alert } from 'react-native';
import { PDFViewer } from '@/src/components/PDFViewer';
import { tokens } from '@/src/theme/tokens';

interface PDFPreviewScreenProps {
  visible: boolean;
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

export const PDFPreviewScreen: React.FC<PDFPreviewScreenProps> = ({
  visible,
  pdfUrl,
  title,
  onClose,
}) => {

  const handleDownload = async () => {
    if (!pdfUrl) return;

    try {
      if (Platform.OS === 'web') {
        // Sur web, on force le téléchargement
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `facture-${title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // Sur mobile, on ouvre directement le PDF dans le navigateur
      try {
        const { Linking } = require('react-native');
        const canOpen = await Linking.canOpenURL(pdfUrl);
        
        if (canOpen) {
          await Linking.openURL(pdfUrl);
          Alert.alert(
            'Ouverture du PDF',
            'Le PDF s\'ouvre dans votre navigateur. Vous pouvez le télécharger depuis là.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Erreur', 'Impossible d\'ouvrir le PDF.');
        }
      } catch (error) {
        console.error('Erreur lors de l\'ouverture:', error);
        Alert.alert('Erreur', 'Impossible d\'ouvrir le PDF.');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      Alert.alert('Erreur', 'Impossible de télécharger le fichier.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header avec actions */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          </View>
          
          <View style={styles.headerActions}>
            {/* Bouton de téléchargement */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDownload}
            >
              <Text style={styles.actionButtonText}>💾</Text>
            </TouchableOpacity>

            {/* Bouton fermer */}
            <TouchableOpacity
              style={[styles.actionButton, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={[styles.actionButtonText, styles.closeButtonText]}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Zone de prévisualisation */}
        <View style={styles.viewerContainer}>
          <PDFViewer
            pdfUrl={pdfUrl}
            title={title}
            onClose={onClose}
          />
        </View>
      </View>
    </Modal>
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
    paddingTop: Platform.OS === 'ios' ? tokens.spacing[8] : tokens.spacing[3], // Safe area pour iOS
  },
  headerLeft: {
    flex: 1,
    marginRight: tokens.spacing[2],
  },
  headerTitle: {
    fontSize: tokens.font.sizes.lg,
    fontWeight: tokens.font.weights.semibold,
    color: tokens.colors.foregroundLight,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing[2],
  },
  actionButton: {
    padding: tokens.spacing[2],
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.primary,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: tokens.colors.backgroundLight,
    fontWeight: tokens.font.weights.medium,
  },
  closeButton: {
    backgroundColor: tokens.colors.destructiveLight,
    shadowColor: tokens.colors.destructiveLight,
  },
  closeButtonText: {
    color: tokens.colors.backgroundLight,
  },
  viewerContainer: {
    flex: 1,
  },
});
