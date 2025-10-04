const BASE = process.env.EXPO_PUBLIC_API_URL || '';

export async function registerDevice(params: {
  jwt: string;
  userId: string;
  token: string;
  platform: 'ios' | 'android' | 'web';
  isTester: boolean;
}) {
  if (!BASE) throw new Error('EXPO_PUBLIC_API_URL manquant');
  const res = await fetch(`${BASE}/devices/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${params.jwt}` },
    body: JSON.stringify({
      userId: params.userId,
      expoPushToken: params.token,
      platform: params.platform,
      isTester: params.isTester
    })
  });
  if (!res.ok) throw new Error(`registerDevice failed: ${res.status}`);
  return res.json();
}
