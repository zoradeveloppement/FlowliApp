// Script de test pour vérifier l'injection JWT
// Usage: node test-auth.js

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

async function testAuth() {
  console.log('🧪 Test d\'authentification JWT');
  console.log('API URL:', API_URL);
  
  try {
    // Test sans auth (devrait échouer)
    console.log('\n1. Test sans authentification...');
    const response1 = await fetch(`${API_URL}/api/me/tasks`);
    console.log('Status:', response1.status);
    console.log('Headers:', Object.fromEntries(response1.headers.entries()));
    
    // Test avec un token factice
    console.log('\n2. Test avec token factice...');
    const response2 = await fetch(`${API_URL}/api/me/tasks`, {
      headers: {
        'Authorization': 'Bearer fake-token-12345',
        'Content-Type': 'application/json'
      }
    });
    console.log('Status:', response2.status);
    
    console.log('\n✅ Tests terminés');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testAuth();
