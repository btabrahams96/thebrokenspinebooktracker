import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, ApiError } from '../lib/api';
import { AuthContext, type AuthState } from '../hooks/useAuth';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>('unknown');

  const refresh = useCallback(async () => {
    try {
      const r = await api.authCheck();
      setState(r.authed ? 'in' : 'out');
    } catch {
      setState('out');
    }
  }, []);

  const signIn = useCallback(
    async (pin: string) => {
      try {
        await api.signIn(pin);
        setState('in');
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          throw new Error('That PIN didn\'t match.');
        }
        throw e;
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    await api.signOut().catch(() => undefined);
    setState('out');
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(() => ({ state, signIn, signOut, refresh }), [state, signIn, signOut, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
