# 🚀 Guide de Déploiement Web sur Vercel

## ✅ Modifications effectuées dans le code

Les fichiers suivants ont été créés/modifiés :

1. **`vercel.json`** (nouveau) - Configuration Vercel pour le déploiement
2. **`apps/mobile/package.json`** - Ajout du script `build:web`
3. **`apps/mobile/app.config.ts`** - Amélioration de la gestion de `EXPO_PUBLIC_WEB_BASE_URL` en production
4. **`tsconfig.json`** (nouveau) - Configuration TypeScript pour exclure `api/` du build web
5. **`.vercelignore`** (nouveau) - Exclusion du dossier `api/` du build web

---

## 📋 Étapes à suivre

### 1. Git - Commit et Push

```bash
# Vérifier les fichiers modifiés
git status

# Ajouter les fichiers
git add vercel.json
git add apps/mobile/package.json
git add apps/mobile/app.config.ts
git add tsconfig.json
git add .vercelignore

# Commit
git commit -m "feat: add Vercel configuration for web deployment

- Add vercel.json with build and deployment settings
- Add build:web script to package.json
- Improve EXPO_PUBLIC_WEB_BASE_URL handling for production
- Add tsconfig.json to exclude api/ from TypeScript compilation
- Add .vercelignore to exclude api/ from web build"

# Push vers votre repo
git push origin main
# (ou votre branche principale)
```

---

### 2. Vercel - Configuration du projet

#### Étape 2.1 : Créer/Connecter le projet

1. Aller sur [vercel.com](https://vercel.com) et se connecter
2. Cliquer sur **"Add New..."** → **"Project"**
3. Importer votre repository GitHub (FlowliApp)
4. Vercel détectera automatiquement le fichier `vercel.json`

#### Étape 2.2 : Vérifier les paramètres de build

Dans la page de configuration du projet, vérifier que :
- **Framework Preset** : `Other` (ou laisser vide)
- **Root Directory** : Laisser vide (ou `apps/mobile` si Vercel ne détecte pas automatiquement)
- **Build Command** : Déjà défini dans `vercel.json` → Laisser tel quel
- **Output Directory** : Déjà défini dans `vercel.json` → Laisser tel quel
- **Install Command** : Déjà défini dans `vercel.json` → Laisser tel quel

> ⚠️ **Important** : Si Vercel propose des valeurs par défaut, les ignorer car `vercel.json` prend le dessus.

#### Étape 2.3 : Configurer les variables d'environnement

Aller dans **Settings** → **Environment Variables** et ajouter :

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `EXPO_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | ✅ Production<br>✅ Preview<br>✅ Development |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `eyJxxx...` (votre clé anon) | ✅ Production<br>✅ Preview<br>✅ Development |
| `EXPO_PUBLIC_API_URL` | `https://flowli-app.vercel.app/api` | ✅ Production<br>✅ Preview<br>✅ Development |
| `EXPO_PUBLIC_WEB_BASE_URL` | *(optionnel)* `https://votre-domaine.vercel.app` | ✅ Production uniquement |

> 💡 **Note** : `EXPO_PUBLIC_WEB_BASE_URL` peut rester vide. Le code utilisera automatiquement `VERCEL_URL` en production.

#### Étape 2.4 : Déployer

1. Cliquer sur **"Deploy"**
2. Vercel va :
   - Installer les dépendances dans `apps/mobile/`
   - Exécuter `npx expo export --platform web`
   - Déployer le contenu de `apps/mobile/dist/`

---

### 3. Vérification post-déploiement

Une fois le déploiement terminé, vérifier :

#### ✅ Checklist de validation

- [ ] L'application se charge correctement sur l'URL Vercel
- [ ] Le routing fonctionne (navigation entre pages)
- [ ] L'authentification Supabase fonctionne
- [ ] Les appels API fonctionnent (`/api/me/tasks`, etc.)
- [ ] Les assets (images, fonts) se chargent
- [ ] Le responsive fonctionne (mobile/desktop)
- [ ] Les routes principales fonctionnent :
  - `/` (onboarding ou home)
  - `/login`
  - `/home`
  - `/factures`
  - `/profile`

#### 🔍 Comment tester

1. Ouvrir l'URL de déploiement Vercel
2. Ouvrir la console du navigateur (F12)
3. Vérifier qu'il n'y a pas d'erreurs
4. Tester le login avec un compte test
5. Naviguer entre les différentes pages

---

### 4. Configuration optionnelle

#### 4.1 : Domaine personnalisé

Si vous souhaitez utiliser un domaine personnalisé (ex: `app.flowli.com`) :

1. Aller dans **Settings** → **Domains**
2. Ajouter votre domaine
3. Suivre les instructions DNS
4. Mettre à jour `EXPO_PUBLIC_WEB_BASE_URL` avec le nouveau domaine

#### 4.2 : Variables d'environnement par environnement

Vous pouvez avoir des valeurs différentes selon l'environnement :

- **Production** : Variables pour la prod
- **Preview** : Variables pour les PR (peuvent pointer vers un environnement de test)
- **Development** : Variables pour les déploiements de développement

---

## 🐛 Dépannage

### Erreur : "Build failed" ou "Cannot find module '@vercel/node'"

**Causes possibles :**
- Vercel essaie de compiler les fichiers TypeScript dans `api/`
- Variables d'environnement manquantes
- Erreur dans le code TypeScript
- Problème de dépendances

**Solution :**
1. Vérifier que `tsconfig.json` et `.vercelignore` sont bien commités
2. Vérifier les logs de build dans Vercel
3. Tester le build localement : `cd apps/mobile && npm run build:web`
4. Vérifier que toutes les variables d'environnement sont configurées
5. Si l'erreur persiste, vérifier que `api/` est bien exclu dans `tsconfig.json`

### Erreur : "Cannot find module"

**Causes possibles :**
- Dépendances non installées
- Problème de chemin relatif

**Solution :**
1. Vérifier que `installCommand` dans `vercel.json` est correct
2. Vérifier que le `Root Directory` est bien configuré

### L'app se charge mais les routes ne fonctionnent pas

**Cause :** Problème de routing SPA

**Solution :**
1. Vérifier que les `rewrites` dans `vercel.json` sont corrects
2. Vérifier que `output: "static"` est bien dans `app.json`

### Les variables d'environnement ne sont pas prises en compte

**Cause :** Variables non préfixées par `EXPO_PUBLIC_`

**Solution :**
- Toutes les variables Expo doivent commencer par `EXPO_PUBLIC_`
- Redéployer après modification des variables

---

## 📚 Ressources

- [Documentation Expo Web](https://docs.expo.dev/workflow/web/)
- [Documentation Vercel](https://vercel.com/docs)
- [Expo Router Static Rendering](https://docs.expo.dev/router/reference/static-rendering/)

---

## 🎯 Prochaines étapes

Une fois le déploiement web fonctionnel :

1. ✅ Tester tous les scénarios utilisateur
2. ✅ Configurer un domaine personnalisé (optionnel)
3. ✅ Mettre en place le monitoring (Sentry, etc.)
4. ✅ Optimiser les performances (lazy loading, etc.)

---

**Bon déploiement ! 🚀**

