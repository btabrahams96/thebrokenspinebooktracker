import { createContext, useContext } from 'react';

export type AuthState = 'unknown' | 'in' | 'out';

interface Ctx {
  state: AuthState;
  signIn: (pin: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<Ctx | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
