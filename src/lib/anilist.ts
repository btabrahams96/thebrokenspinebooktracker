import type { LookupResult } from './lookup';

const ENDPOINT = 'https://graphql.anilist.co';

const SEARCH_QUERY = /* GraphQL */ `
  query ($search: String, $perPage: Int) {
    Page(perPage: $perPage) {
      media(search: $search, type: MANGA, sort: SEARCH_MATCH) {
        id
        title { romaji english native }
        staff(perPage: 3) {
          edges { role node { name { full } } }
        }
        coverImage { large medium }
        volumes
      }
    }
  }
`;

interface ALMedia {
  id: number;
  title: { romaji?: string; english?: string; native?: string };
  staff?: { edges?: { role: string; node: { name: { full: string } } }[] };
  coverImage?: { large?: string; medium?: string };
  volumes?: number;
}

export async function anilistSearch(search: string, perPage = 10): Promise<LookupResult[]> {
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query: SEARCH_QUERY, variables: { search, perPage } })
  });
  if (!r.ok) return [];
  const data = (await r.json()) as { data?: { Page?: { media?: ALMedia[] } } };
  const media = data.data?.Page?.media ?? [];
  return media.map((m) => {
    const author = m.staff?.edges?.find((e) => /story|original/i.test(e.role))?.node.name.full;
    const artist = m.staff?.edges?.find((e) => /art/i.test(e.role))?.node.name.full;
    const creator = [author, artist].filter(Boolean).join(' / ') || undefined;
    return {
      title: m.title.english ?? m.title.romaji ?? m.title.native ?? 'Untitled',
      creator,
      cover_url: m.coverImage?.large ?? m.coverImage?.medium,
      external_id: String(m.id),
      source: 'anilist'
    };
  });
}
