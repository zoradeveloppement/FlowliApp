# Portail Client — MVP
- apps/mobile : Expo (React Native + Web)
- api/ : Vercel Functions (webhook Airtable, push Expo, lecture Airtable)

## Démarrer
1) Copier .env.example → .env (valeurs réelles dans Vercel/Supabase/Expo).
2) cd apps/mobile && npx create-expo-app@latest . --template && npm i
3) npx expo start (dans apps/mobile) pour lancer (web + Expo Go).
4) Pousser le repo et connecter à Vercel (déploie api/* automatiquement).
