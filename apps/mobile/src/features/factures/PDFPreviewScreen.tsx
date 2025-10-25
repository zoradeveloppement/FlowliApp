import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform, Alert } from 'react-native';
import { PDFViewer } from '@/src/components/PDFViewer';
import { tokens } from '@/src/theme/tokens';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

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
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!pdfUrl) return;

    try {
      setSharing(true);

      if (Platform.OS === 'web') {
        // Sur web, on ouvre dans un nouvel onglet
        window.open(pdfUrl, '_blank');
        return;
      }

      // Sur mobile, on télécharge et partage le fichier
      const fileName = `facture-${title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      const documentDir = FileSystem.documentDirectory;
      if (!documentDir) {
        throw new Error('Document directory not available');
      }
      const fileUri = documentDir + fileName;

      try {
        // Télécharger le fichier avec fetch
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
        // Sauvegarder le fichier
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Vérifier si le partage est disponible
        const isAvailable = await Sharing.isAvailableAsync();
        
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/pdf',
            dialogTitle: `Partager ${title}`,
          });
        } else {
          Alert.alert('Partage non disponible', 'Le partage n\'est pas disponible sur cet appareil.');
        }
      } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        Alert.alert('Erreur', 'Impossible de télécharger le fichier pour le partage.');
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      Alert.alert('Erreur', 'Impossible de partager le fichier.');
    } finally {
      setSharing(false);
    }
  };

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

      // Sur mobile, on télécharge dans le dossier Documents
      const fileName = `facture-${title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      const documentDir = FileSystem.documentDirectory;
      if (!documentDir) {
        throw new Error('Document directory not available');
      }
      const fileUri = documentDir + fileName;

      try {
        // Télécharger le fichier avec fetch
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
        // Sauvegarder le fichier
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        Alert.alert(
          'Téléchargement réussi',
          `Le fichier a été sauvegardé dans vos documents.`,
          [{ text: 'OK' }]
        );
      } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        Alert.alert('Erreur', 'Impossible de télécharger le fichier.');
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
            {/* Bouton de partage */}
            <TouchableOpacity
              style={[styles.actionButton, sharing && styles.actionButtonDisabled]}
              onPress={handleShare}
              disabled={sharing}
            >
              <Text style={styles.actionButtonText}>
                {sharing ? '⏳' : '📤'}
              </Text>
            </TouchableOpacity>

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
  actionButtonDisabled: {
    backgroundColor: tokens.colors.mutedForegroundLight,
    shadowOpacity: 0,
    elevation: 0,
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
