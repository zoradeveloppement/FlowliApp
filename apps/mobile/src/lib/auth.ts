import { supabase } from './supabase';

export async function authHeaders() {
  // 1) getSession peut être "vide" juste après le login Web.
  //    On attend un court instant + on retente.
  let { data } = await supabase.auth.getSession();
  if (!data.session?.access_token) {
    await new Promise(r => setTimeout(r, 250));
    ({ data } = await supabase.auth.getSession());
  }

  const token = data.session?.access_token;
  if (!token) return {};

  if (__DEV__) {
    console.log('[AUTH] Bearer', token.slice(0, 8) + '…');
  }
  return { Authorization: `Bearer ${token}` };
}
