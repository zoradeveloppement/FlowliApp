const fetch = require('node-fetch');

// Script pour tester l'API depuis iOS
async function testIOSInvoices() {
  console.log('📱 Test de l\'API factures pour iOS...\n');
  
  // URL de votre API (remplacez par votre vraie URL)
  const API_BASE_URL = 'https://flowli-app.vercel.app'; // ou votre URL locale
  
  try {
    // 1. Test de l'endpoint factures
    console.log('🔍 Test 1: Endpoint /api/me/invoices');
    const invoicesUrl = `${API_BASE_URL}/api/me/invoices`;
    
    // Vous devez remplacer par un vrai JWT token
    const testToken = 'YOUR_JWT_TOKEN_HERE';
    
    if (testToken === 'YOUR_JWT_TOKEN_HERE') {
      console.log('❌ ERREUR: Vous devez fournir un JWT token valide');
      console.log('Pour obtenir le token:');
      console.log('1. Ouvrez l\'app web');
      console.log('2. Ouvrez les DevTools (F12)');
      console.log('3. Allez dans Network > Headers');
      console.log('4. Cherchez une requête vers /api/me/invoices');
      console.log('5. Copiez le token Authorization: Bearer ...');
      console.log('\nPuis modifiez ce script avec votre token');
      return;
    }
    
    const response = await fetch(invoicesUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`- Statut: ${response.status}`);
    console.log(`- Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);
    
    const data = await response.json();
    console.log(`- Réponse: ${JSON.stringify(data, null, 2)}`);
    
    if (response.status === 200) {
      console.log('✅ API fonctionne correctement');
      console.log(`- Nombre de factures: ${data.invoices?.length || 0}`);
    } else {
      console.log('❌ Erreur API');
      console.log(`- Code: ${response.status}`);
      console.log(`- Message: ${data.message || 'Erreur inconnue'}`);
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

// Instructions pour l'utilisateur
console.log('📋 INSTRUCTIONS POUR TESTER iOS:');
console.log('1. Ouvrez l\'app web dans votre navigateur');
console.log('2. Connectez-vous et allez sur la page factures');
console.log('3. Ouvrez les DevTools (F12)');
console.log('4. Allez dans l\'onglet Network');
console.log('5. Rafraîchissez la page');
console.log('6. Cherchez la requête vers /api/me/invoices');
console.log('7. Cliquez dessus et regardez les Headers');
console.log('8. Copiez le token Authorization: Bearer ...');
console.log('9. Remplacez YOUR_JWT_TOKEN_HERE dans ce script');
console.log('10. Relancez: node debug-ios-invoices.js\n');

testIOSInvoices();
