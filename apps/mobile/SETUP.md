# Environment Setup

## Required Environment Variables

Create a `.env` file in the `apps/mobile` directory with the following variables:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# API Configuration (for later use)
EXPO_PUBLIC_API_URL=https://your-api-url.vercel.app/api
```

## How to Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project dashboard, go to Settings > API
3. Copy the "Project URL" and "anon public" key
4. Add them to your `.env` file

## Testing the Setup

1. Create the `.env` file with your Supabase credentials
2. Restart the Expo development server: `npx expo start --clear`
3. The app should now load without the "supabaseUrl is required" error
4. You can test the authentication flow by entering an email and clicking "Recevoir un lien de connexion"

## Current Status

The app is set up with:
- ✅ Supabase client configuration
- ✅ Authentication routing logic
- ✅ Login screen with magic link
- ✅ Home screen placeholder
- ⚠️ **Missing**: Environment variables (create `.env` file)
