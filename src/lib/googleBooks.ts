import type { LookupResult } from './lookup';

interface GBVolumeInfo {
  title?: string;
  authors?: string[];
  imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  industryIdentifiers?: { type: string; identifier: string }[];
  pageCount?: number;
  description?: string;
  publishedDate?: string;
}
interface GBVolume {
  id: string;
  volumeInfo: GBVolumeInfo;
}
interface GBResponse {
  totalItems: number;
  items?: GBVolume[];
}

const httpsify = (url?: string) => (url ? url.replace(/^http:/, 'https:') : undefined);

function fromVolume(v: GBVolume): LookupResult {
  const info = v.volumeInfo;
  const isbn13 = info.industryIdentifiers?.find((i) => i.type === 'ISBN_13')?.identifier;
  return {
    title: info.title ?? 'Untitled',
    creator: info.authors?.join(', '),
    cover_url: httpsify(info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail),
    isbn: isbn13,
    external_id: v.id,
    source: 'google_books'
  };
}

export async function googleBooksByIsbn(isbn: string): Promise<LookupResult | null> {
  const r = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`);
  if (!r.ok) return null;
  const data = (await r.json()) as GBResponse;
  const v = data.items?.[0];
  return v ? fromVolume(v) : null;
}

export async function googleBooksByQuery(q: string, max = 10): Promise<LookupResult[]> {
  const r = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=${max}`
  );
  if (!r.ok) return [];
  const data = (await r.json()) as GBResponse;
  return (data.items ?? []).map(fromVolume);
}
