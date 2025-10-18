import { post } from './http';
import { authHeaders } from './auth';

export async function registerDevice(params: {
  userId: string;
  token: string;
  platform: 'ios' | 'android' | 'web';
  isTester: boolean;
}) {
  const headers = await authHeaders();
  return await post('devices/register', {
    userId: params.userId,
    expoPushToken: params.token,
    platform: params.platform,
    isTester: params.isTester
  }, headers);
}

export async function getTasks() {
  const headers = await authHeaders();
  return await import('./http').then(({ get }) => get('me/tasks', headers));
}

export async function getInvoices() {
  const headers = await authHeaders();
  return await import('./http').then(({ get }) => get('me/invoices', headers));
}
