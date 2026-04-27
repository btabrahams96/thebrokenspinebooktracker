import type { ItemSource, ItemType } from '../types';
import { googleBooksByIsbn, googleBooksByQuery } from './googleBooks';
import { openLibraryByIsbn } from './openLibrary';
import { anilistSearch } from './anilist';

export interface LookupResult {
  title: string;
  creator?: string;
  cover_url?: string;
  isbn?: string;
  external_id?: string;
  source?: ItemSource;
}

export interface LookupFailure {
  needsManualEntry: true;
  isbn?: string;
}

export type LookupOutcome = LookupResult | LookupFailure;

export const isFailure = (r: LookupOutcome): r is LookupFailure =>
  (r as LookupFailure).needsManualEntry === true;

const ISBN_RE = /^\d{10}(\d{3})?$/;
export const looksLikeIsbn = (s: string) => ISBN_RE.test(s.replace(/[-\s]/g, ''));

export async function lookupByIsbn(isbn: string, type?: ItemType): Promise<LookupOutcome> {
  const clean = isbn.replace(/[-\s]/g, '');
  if (type === 'manga') {
    // Manga ISBNs are unreliable; try Google Books first (English releases),
    // then fall through to Open Library, then surface manual entry.
  }
  const gb = await googleBooksByIsbn(clean).catch(() => null);
  if (gb) return gb;

  const ol = await openLibraryByIsbn(clean).catch(() => null);
  if (ol) return ol;

  return { needsManualEntry: true, isbn: clean };
}

export async function searchByText(query: string, type?: ItemType): Promise<LookupResult[]> {
  const q = query.trim();
  if (!q) return [];

  if (looksLikeIsbn(q)) {
    const r = await lookupByIsbn(q, type);
    return isFailure(r) ? [] : [r];
  }

  if (type === 'manga') {
    const a = await anilistSearch(q).catch(() => []);
    if (a.length) return a;
  }

  const gb = await googleBooksByQuery(q).catch(() => []);
  if (gb.length) return gb;

  if (type !== 'manga') {
    return anilistSearch(q).catch(() => []);
  }
  return [];
}
