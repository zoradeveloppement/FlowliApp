import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button, Skeleton } from './index';

export const TestComponents: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test des Composants Mobile</Text>
      
      {/* Test Card */}
      <Card padding="md" shadow={true} style={styles.testCard}>
        <Text style={styles.cardTitle}>Card de Test</Text>
        <Text style={styles.cardText}>Cette card devrait avoir un fond blanc, des bordures arrondies et une ombre.</Text>
      </Card>

      {/* Test Button */}
      <Button
        title="Bouton Principal"
        variant="primary"
        size="md"
        onPress={() => console.log('Bouton pressé!')}
        style={styles.testButton}
      />

      <Button
        title="Bouton Secondaire"
        variant="secondary"
        size="md"
        onPress={() => console.log('Bouton secondaire pressé!')}
        style={styles.testButton}
      />

      {/* Test Skeleton */}
      <View style={styles.skeletonContainer}>
        <Text style={styles.skeletonLabel}>Skeleton de chargement :</Text>
        <Skeleton width="100%" height={20} borderRadius={8} style={styles.testSkeleton} />
        <Skeleton width="80%" height={16} borderRadius={6} style={styles.testSkeleton} />
        <Skeleton width="60%" height={16} borderRadius={6} style={styles.testSkeleton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F8FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
  },
  testCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  testButton: {
    marginBottom: 12,
  },
  skeletonContainer: {
    marginTop: 20,
  },
  skeletonLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  testSkeleton: {
    marginBottom: 8,
  },
});
