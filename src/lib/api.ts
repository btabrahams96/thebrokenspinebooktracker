import type { Item, ItemStatus, ItemType } from '../types';

export interface Stats {
  total: number;
  finishedThisYear: number;
  year: number;
  byType: Partial<Record<ItemType, number>>;
  byStatus: Partial<Record<ItemStatus, number>>;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const r = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    ...init
  });
  if (r.status === 204) return undefined as T;
  const text = await r.text();
  const data = text ? (JSON.parse(text) as unknown) : null;
  if (!r.ok) {
    let msg = r.statusText || 'Request failed';
    if (data && typeof data === 'object' && 'error' in data) {
      const err = (data as { error: unknown }).error;
      if (typeof err === 'string') msg = err;
    }
    throw new ApiError(r.status, msg);
  }
  return data as T;
}

export const api = {
  authCheck: () => req<{ authed: boolean }>('/auth', { method: 'GET' }),
  signIn: (pin: string) => req<{ ok: true }>('/auth', { method: 'POST', body: JSON.stringify({ pin }) }),
  signOut: () => req<void>('/auth', { method: 'DELETE' }),

  listItems: (params: { status?: ItemStatus; type?: ItemType } = {}) => {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    if (params.type) q.set('type', params.type);
    const qs = q.toString();
    return req<{ items: Item[] }>(`/items${qs ? `?${qs}` : ''}`);
  },
  getItem: (id: string) => req<{ item: Item }>(`/items/${id}`),
  createItem: (body: Omit<Item, 'id' | 'date_added'>) =>
    req<{ item: Item }>('/items', { method: 'POST', body: JSON.stringify(body) }),
  patchItem: (id: string, body: Partial<Omit<Item, 'id' | 'date_added'>>) =>
    req<{ item: Item }>(`/items/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteItem: (id: string) => req<void>(`/items/${id}`, { method: 'DELETE' }),

  stats: () => req<Stats>('/stats')
};
