import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { testAuthFlow } from '../src/api/tasks';
import { supabase } from '../src/lib/supabase';

export function AuthTestComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string, isError = false) => {
    setResults(prev => [...prev, `${isError ? '❌' : '✅'} ${message}`]);
  };

  const clearResults = () => setResults([]);

  const testTokenSending = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) {
        addResult(`Token trouvé: ${data.session.access_token.slice(0, 10)}...`);
        addResult(`Email: ${data.session.user?.email}`);
        return true;
      } else {
        addResult('Aucun token trouvé', true);
        return false;
      }
    } catch (error) {
      addResult(`Erreur token: ${error}`, true);
      return false;
    }
  };

  const testWithDebug = async () => {
    try {
      setIsLoading(true);
      const result = await testAuthFlow('louis.lemay02@gmail.com');
      addResult(`Debug test - Count: ${result.count}`);
      if (result.debug) {
        addResult(`Debug info disponible`);
      }
      return true;
    } catch (error) {
      addResult(`Debug test failed: ${error}`, true);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const testNormalAuth = async () => {
    try {
      setIsLoading(true);
      const result = await testAuthFlow(); // Sans email = test normal
      addResult(`Normal auth - Count: ${result.count}`);
      return true;
    } catch (error) {
      addResult(`Normal auth failed: ${error}`, true);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const runAllTests = async () => {
    clearResults();
    addResult('🚀 Démarrage des tests...');
    
    const test1 = await testTokenSending();
    const test2 = await testWithDebug();
    const test3 = await testNormalAuth();
    
    addResult(`\n📋 Résumé: Token=${test1 ? 'OK' : 'FAIL'}, Debug=${test2 ? 'OK' : 'FAIL'}, Normal=${test3 ? 'OK' : 'FAIL'}`);
    
    if (test1 && test2 && test3) {
      addResult('🎉 Tous les tests sont passés !');
    } else {
      addResult('⚠️ Certains tests ont échoué');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Test d'Authentification</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={runAllTests}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? '⏳ Test en cours...' : '🚀 Lancer les tests'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.clearButton} onPress={clearResults}>
        <Text style={styles.clearButtonText}>🗑️ Effacer</Text>
      </TouchableOpacity>
      
      <View style={styles.results}>
        {results.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
    marginBottom: 15,
  },
  clearButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  results: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 6,
    maxHeight: 300,
  },
  resultText: {
    color: '#00FF00',
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 2,
  },
});
