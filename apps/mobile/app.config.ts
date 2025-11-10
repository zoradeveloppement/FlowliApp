import { ExpoConfig } from 'expo/config';

const PROJECT_ID = process.env.EXPO_PUBLIC_EAS_PROJECT_ID || 'a7874aa1-3605-4abd-a667-ebeab9e11981';

export default ({ config }: { config: ExpoConfig }): ExpoConfig => ({
  ...config,
  name: "Portail Client",
  slug: "portail-client",
  scheme: "portailclient",
  owner: "zora18",
  extra: {
    ...(config?.extra || {}),
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://flowli-app.vercel.app/api',
    EXPO_PUBLIC_WEB_BASE_URL: process.env.EXPO_PUBLIC_WEB_BASE_URL || 
      (process.env.NODE_ENV === 'production' 
        ? process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : "http://localhost:8081"
        : "http://localhost:8081"),
    eas: { projectId: PROJECT_ID },
  }
});
