// Script de test pour vérifier l'authentification
// À exécuter dans la console du navigateur ou dans l'app

// Test 1: Vérifier que le token est bien envoyé
async function testTokenSending() {
  console.log('=== Test 1: Vérification du token ===');
  
  try {
    // Import dynamique pour éviter les erreurs de module
    const { supabase } = await import('./apps/mobile/src/lib/supabase.ts');
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.access_token) {
      console.log('✅ Token trouvé:', data.session.access_token.slice(0, 10) + '...');
      console.log('📧 Email utilisateur:', data.session.user?.email);
    } else {
      console.log('❌ Aucun token trouvé');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du token:', error);
    return false;
  }
}

// Test 2: Test avec X-Debug (override email)
async function testWithDebug(email = 'louis.lemay02@gmail.com') {
  console.log('=== Test 2: Test avec X-Debug ===');
  
  try {
    const base = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
    const url = `${base}/me/tasks?email=${encodeURIComponent(email)}&statuses=A faire,En cours,En retard`;
    
    const response = await fetch(url, {
      headers: {
        'X-Debug': '1',
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Test X-Debug réussi');
      console.log('📊 Nombre de tâches:', data.count);
      console.log('🔍 Debug info:', data.debug);
    } else {
      console.log('❌ Test X-Debug échoué:', data);
    }
    
    return response.ok;
  } catch (error) {
    console.error('❌ Erreur lors du test X-Debug:', error);
    return false;
  }
}

// Test 3: Test normal (sans debug)
async function testNormalAuth() {
  console.log('=== Test 3: Test normal (JWT) ===');
  
  try {
    const { supabase } = await import('./apps/mobile/src/lib/supabase.ts');
    const { data } = await supabase.auth.getSession();
    
    if (!data.session?.access_token) {
      console.log('❌ Pas de session active');
      return false;
    }
    
    const base = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
    const url = `${base}/me/tasks?statuses=A faire,En cours,En retard`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${data.session.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Test normal réussi');
      console.log('📊 Nombre de tâches:', result.count);
    } else {
      console.log('❌ Test normal échoué:', result);
    }
    
    return response.ok;
  } catch (error) {
    console.error('❌ Erreur lors du test normal:', error);
    return false;
  }
}

// Fonction principale de test
async function runAllTests() {
  console.log('🚀 Démarrage des tests d\'authentification...\n');
  
  const test1 = await testTokenSending();
  const test2 = await testWithDebug();
  const test3 = await testNormalAuth();
  
  console.log('\n📋 Résumé des tests:');
  console.log(`Token sending: ${test1 ? '✅' : '❌'}`);
  console.log(`X-Debug test: ${test2 ? '✅' : '❌'}`);
  console.log(`Normal auth: ${test3 ? '✅' : '❌'}`);
  
  if (test1 && test2 && test3) {
    console.log('\n🎉 Tous les tests sont passés !');
  } else {
    console.log('\n⚠️ Certains tests ont échoué. Vérifiez les logs ci-dessus.');
  }
}

// Export pour utilisation dans l'app
if (typeof window !== 'undefined') {
  window.testAuthFlow = runAllTests;
  console.log('💡 Utilisez testAuthFlow() pour lancer les tests');
}

// Auto-run si exécuté directement
if (typeof module === 'undefined') {
  runAllTests();
}
