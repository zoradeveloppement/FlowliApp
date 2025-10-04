export default () => ({
  expo: {
    name: "Portail Client",
    slug: "portail-client",
    scheme: "portailclient",
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL // e.g. https://<project>.vercel.app/api
    }
  }
});
