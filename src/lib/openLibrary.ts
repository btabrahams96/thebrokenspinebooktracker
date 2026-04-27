import type { LookupResult } from './lookup';

interface OLBook {
  title?: string;
  authors?: { name: string }[];
  cover?: { medium?: string; large?: string; small?: string };
  identifiers?: { isbn_13?: string[]; isbn_10?: string[] };
}

export async function openLibraryByIsbn(isbn: string): Promise<LookupResult | null> {
  const r = await fetch(
    `https://openlibrary.org/api/books?bibkeys=ISBN:${encodeURIComponent(isbn)}&format=json&jscmd=data`
  );
  if (!r.ok) return null;
  const data = (await r.json()) as Record<string, OLBook>;
  const key = `ISBN:${isbn}`;
  const b = data[key];
  if (!b?.title) return null;
  return {
    title: b.title,
    creator: b.authors?.map((a) => a.name).join(', '),
    cover_url: b.cover?.medium ?? b.cover?.large ?? b.cover?.small,
    isbn: b.identifiers?.isbn_13?.[0] ?? isbn,
    source: 'open_library'
  };
}
