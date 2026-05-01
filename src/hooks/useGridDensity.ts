import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'tbs-density';
const CSS_VAR = '--tbs-density';

export const DENSITY_MIN = -1;
export const DENSITY_MAX = 3;
export const DENSITY_DEFAULT = 0;

const clamp = (n: number) => Math.max(DENSITY_MIN, Math.min(DENSITY_MAX, n));

function applyToDocument(value: number) {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty(CSS_VAR, String(value));
  }
}

function readFromStorage(): number {
  if (typeof window === 'undefined') return DENSITY_DEFAULT;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return DENSITY_DEFAULT;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? clamp(parsed) : DENSITY_DEFAULT;
}

export function useGridDensity() {
  const [density, setDensityState] = useState<number>(readFromStorage);

  useEffect(() => {
    applyToDocument(density);
  }, [density]);

  const setDensity = useCallback((next: number) => {
    const v = clamp(next);
    setDensityState(v);
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, String(v));
  }, []);

  return { density, setDensity, min: DENSITY_MIN, max: DENSITY_MAX };
}

/** Apply the persisted value as early as possible, before React mounts,
 *  so the first paint already has the right column count. */
export function bootstrapGridDensity() {
  applyToDocument(readFromStorage());
}
