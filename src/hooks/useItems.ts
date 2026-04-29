import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Item, ItemStatus, ItemType } from '../types';

export function useItems(params: { status?: ItemStatus; type?: ItemType } = {}) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const r = await api.listItems(params);
      setItems(r.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.status, params.type]);

  useEffect(() => {
    void load();
  }, [load]);

  return { items, error, reload: load };
}
