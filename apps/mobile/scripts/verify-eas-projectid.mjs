#!/usr/bin/env node

/**
 * Script de validation du projectId EAS
 * Vérifie que la configuration Expo contient le bon projectId
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const EXPECTED_PROJECT_ID = 'a7874aa1-3605-4abd-a667-ebeab9e11981';

async function loadConfig() {
  try {
    // Essayer d'abord app.config.ts
    const configPath = join(projectRoot, 'app.config.ts');
    const configContent = readFileSync(configPath, 'utf8');
    
    // Exécuter le fichier de config pour obtenir la config finale
    const configModule = await import(configPath);
    const config = configModule.default({ config: {} });
    
    return {
      source: 'app.config.ts',
      config: config
    };
  } catch (error) {
    console.log(`⚠️  app.config.ts non trouvé, fallback sur app.json`);
    try {
      // Fallback sur app.json
      const jsonPath = join(projectRoot, 'app.json');
      const configContent = readFileSync(jsonPath, 'utf8');
      const config = JSON.parse(configContent);
      
      return {
        source: 'app.json',
        config: config.expo || config
      };
    } catch (jsonError) {
      throw new Error(`Impossible de charger la configuration: ${error.message}`);
    }
  }
}

function verifyProjectId(config) {
  const projectId = config?.extra?.eas?.projectId;
  
  if (!projectId) {
    throw new Error('❌ Aucun projectId EAS trouvé dans extra.eas.projectId');
  }
  
  if (projectId !== EXPECTED_PROJECT_ID) {
    throw new Error(`❌ ProjectId incorrect: ${projectId} (attendu: ${EXPECTED_PROJECT_ID})`);
  }
  
  return true;
}

async function main() {
  try {
    console.log('🔍 Vérification du projectId EAS...');
    
    const { source, config } = await loadConfig();
    console.log(`📁 Configuration chargée depuis: ${source}`);
    
    verifyProjectId(config);
    
    console.log('✅ ProjectId EAS correctement configuré!');
    console.log(`   ProjectId: ${config.extra.eas.projectId}`);
    console.log(`   Source: ${source}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur de validation:', error.message);
    process.exit(1);
  }
}

main();
