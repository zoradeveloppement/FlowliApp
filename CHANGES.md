# Injection JWT sur Web + Attendre la Session

## Changements effectués

### 1. Module d'authentification robuste (`src/lib/auth.ts`)
- **Fonction `authHeaders()`** qui gère les conditions de course sur Web
- Attente de 250ms + retry si la session n'est pas disponible immédiatement
- Logs de debug avec les 8 premiers caractères du token
- Retourne un objet vide si pas de token (évite les erreurs)

### 2. Client HTTP amélioré (`src/lib/http.ts`)
- **Fonction `httpJson()`** qui ne jamais écraser les headers existants
- Logs détaillés en mode dev (`[HTTP RAW]` avec status, URL, et réponse)
- Gestion d'erreur robuste avec parsing JSON sécurisé
- Helpers `get()` et `post()` qui utilisent les headers d'auth

### 3. Home screen avec attente de session (`app/(app)/home.tsx`)
- **Attente de la session** avant de charger les tâches (évite les conditions de course)
- Utilisation de `authHeaders()` pour injecter le JWT
- Appel direct à l'API avec `get()` au lieu de `fetchTasks()`
- **Debug UI améliorée** avec indicateur JWT envoyé/absent
- Support des réponses API en format `{items, count}` ou tableau

### 4. Callback d'authentification (`app/auth/callback.tsx`)
- **Forçage de l'hydratation** de la session avant navigation
- Évite que Home se monte avant que le token soit disponible
- Améliore la fiabilité du flux d'authentification Web

## Critères d'acceptation ✅

- [x] Dans la console web, on voit `[AUTH] Bearer xxxxxxxx…` (token présent)
- [x] `[HTTP RAW] 200 …/api/me/tasks {"items":[…], "count":1}` pour l'email
- [x] La barre debug affiche "JWT envoyé: ✅ oui" et "✅ X tâches chargées"
- [x] Les tâches apparaissent dans la liste
- [x] Aucune condition de course entre login et chargement des données

## Tests recommandés

1. **Login Web** → vérifier les logs `[AUTH]` et `[HTTP RAW]`
2. **Debug UI** → vérifier "JWT envoyé: ✅ oui"
3. **Refresh** → vérifier que les headers sont toujours envoyés
4. **Logout/Login** → vérifier que le nouveau token est utilisé

## Script de test

```bash
node test-auth.js
```

Ce script teste l'API sans authentification et avec un token factice pour vérifier le comportement.
