// The Broken Spine — API Worker
// Routes are mounted at /api/*. Static assets are served by the platform
// for all other paths (see wrangler.jsonc `assets`).
//
// Auth: a single PIN secret. POST /api/auth with { pin } sets an HttpOnly
// cookie; every other route requires that cookie.

interface Env {
  DB: D1Database;
  PIN: string;
}

const COOKIE = 'tbs-pin';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) }
  });

const noContent = () => new Response(null, { status: 204 });

function readCookie(req: Request, name: string): string | null {
  const header = req.headers.get('Cookie') ?? '';
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    if (part.slice(0, eq) === name) return decodeURIComponent(part.slice(eq + 1));
  }
  return null;
}

function setAuthCookie(value: string, maxAge: number): string {
  const parts = [
    `${COOKIE}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    `Max-Age=${maxAge}`
  ];
  return parts.join('; ');
}

function isAuthed(req: Request, env: Env): boolean {
  const v = readCookie(req, COOKIE);
  return !!v && !!env.PIN && v === env.PIN;
}

function uuid(): string {
  return crypto.randomUUID();
}

// ---------- handlers ----------

async function handleAuth(req: Request, env: Env): Promise<Response> {
  if (req.method === 'GET') {
    return json({ authed: isAuthed(req, env) });
  }
  if (req.method === 'DELETE') {
    return new Response(null, {
      status: 204,
      headers: { 'Set-Cookie': setAuthCookie('', 0) }
    });
  }
  if (req.method !== 'POST') return json({ error: 'method' }, { status: 405 });
  const body = (await req.json().catch(() => null)) as { pin?: string } | null;
  if (!body?.pin || body.pin !== env.PIN) {
    return json({ error: 'bad pin' }, { status: 401 });
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': setAuthCookie(env.PIN, COOKIE_MAX_AGE)
    }
  });
}

const ALLOWED_STATUSES = ['wishlist', 'owned', 'reading', 'read', 'dnf'];
const ALLOWED_TYPES = ['book', 'manga', 'comic'];

interface ItemRow {
  id: string;
  title: string;
  creator: string | null;
  cover_url: string | null;
  type: string;
  isbn: string | null;
  external_id: string | null;
  source: string | null;
  status: string;
  rating: number | null;
  notes: string | null;
  series: string | null;
  volume: number | null;
  date_added: string;
  date_finished: string | null;
}

async function listItems(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const type = url.searchParams.get('type');
  const where: string[] = [];
  const params: unknown[] = [];
  if (status && ALLOWED_STATUSES.includes(status)) {
    where.push('status = ?');
    params.push(status);
  }
  if (type && ALLOWED_TYPES.includes(type)) {
    where.push('type = ?');
    params.push(type);
  }
  const sql =
    'SELECT * FROM items' +
    (where.length ? ` WHERE ${where.join(' AND ')}` : '') +
    ' ORDER BY date_added DESC';
  const r = await env.DB.prepare(sql)
    .bind(...params)
    .all<ItemRow>();
  return json({ items: r.results ?? [] });
}

async function getItem(env: Env, id: string): Promise<Response> {
  const row = await env.DB.prepare('SELECT * FROM items WHERE id = ?').bind(id).first<ItemRow>();
  if (!row) return json({ error: 'not found' }, { status: 404 });
  return json({ item: row });
}

interface ItemInput {
  title?: string;
  creator?: string | null;
  cover_url?: string | null;
  type?: string;
  isbn?: string | null;
  external_id?: string | null;
  source?: string | null;
  status?: string;
  rating?: number | null;
  notes?: string | null;
  series?: string | null;
  volume?: number | null;
  date_finished?: string | null;
}

async function createItem(req: Request, env: Env): Promise<Response> {
  const body = (await req.json().catch(() => null)) as ItemInput | null;
  if (!body?.title || !body.type || !body.status) {
    return json({ error: 'missing required fields (title, type, status)' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(body.type)) return json({ error: 'bad type' }, { status: 400 });
  if (!ALLOWED_STATUSES.includes(body.status))
    return json({ error: 'bad status' }, { status: 400 });

  const id = uuid();
  await env.DB.prepare(
    `INSERT INTO items (id, title, creator, cover_url, type, isbn, external_id, source,
       status, rating, notes, series, volume, date_finished)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  )
    .bind(
      id,
      body.title,
      body.creator ?? null,
      body.cover_url ?? null,
      body.type,
      body.isbn ?? null,
      body.external_id ?? null,
      body.source ?? null,
      body.status,
      body.rating ?? null,
      body.notes ?? null,
      body.series ?? null,
      body.volume ?? null,
      body.date_finished ?? null
    )
    .run();
  const row = await env.DB.prepare('SELECT * FROM items WHERE id = ?').bind(id).first<ItemRow>();
  return json({ item: row }, { status: 201 });
}

const PATCHABLE: (keyof ItemInput)[] = [
  'title',
  'creator',
  'cover_url',
  'type',
  'isbn',
  'external_id',
  'source',
  'status',
  'rating',
  'notes',
  'series',
  'volume',
  'date_finished'
];

async function patchItem(req: Request, env: Env, id: string): Promise<Response> {
  const body = (await req.json().catch(() => null)) as ItemInput | null;
  if (!body) return json({ error: 'bad body' }, { status: 400 });

  const sets: string[] = [];
  const params: unknown[] = [];
  for (const key of PATCHABLE) {
    if (key in body) {
      if (key === 'type' && body.type && !ALLOWED_TYPES.includes(body.type))
        return json({ error: 'bad type' }, { status: 400 });
      if (key === 'status' && body.status && !ALLOWED_STATUSES.includes(body.status))
        return json({ error: 'bad status' }, { status: 400 });
      sets.push(`${key} = ?`);
      params.push((body as Record<string, unknown>)[key] ?? null);
    }
  }
  if (sets.length === 0) return json({ error: 'nothing to update' }, { status: 400 });

  // Auto-stamp date_finished when transitioning into 'read'.
  if (body.status === 'read' && !('date_finished' in body)) {
    sets.push('date_finished = datetime(\'now\')');
  }

  params.push(id);
  const r = await env.DB.prepare(`UPDATE items SET ${sets.join(', ')} WHERE id = ?`)
    .bind(...params)
    .run();
  if (!r.success) return json({ error: 'update failed' }, { status: 500 });
  const row = await env.DB.prepare('SELECT * FROM items WHERE id = ?').bind(id).first<ItemRow>();
  if (!row) return json({ error: 'not found' }, { status: 404 });
  return json({ item: row });
}

async function deleteItem(env: Env, id: string): Promise<Response> {
  await env.DB.prepare('DELETE FROM items WHERE id = ?').bind(id).run();
  return noContent();
}

async function stats(env: Env): Promise<Response> {
  const year = new Date().getFullYear();
  const [byType, byStatus, finishedThisYear, total] = await Promise.all([
    env.DB.prepare('SELECT type, COUNT(*) as n FROM items GROUP BY type').all<{
      type: string;
      n: number;
    }>(),
    env.DB.prepare('SELECT status, COUNT(*) as n FROM items GROUP BY status').all<{
      status: string;
      n: number;
    }>(),
    env.DB.prepare(
      "SELECT COUNT(*) as n FROM items WHERE status = 'read' AND substr(date_finished, 1, 4) = ?"
    )
      .bind(String(year))
      .first<{ n: number }>(),
    env.DB.prepare('SELECT COUNT(*) as n FROM items').first<{ n: number }>()
  ]);
  return json({
    total: total?.n ?? 0,
    finishedThisYear: finishedThisYear?.n ?? 0,
    year,
    byType: Object.fromEntries((byType.results ?? []).map((r) => [r.type, r.n])),
    byStatus: Object.fromEntries((byStatus.results ?? []).map((r) => [r.status, r.n]))
  });
}

// ---------- router ----------

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;
    if (!path.startsWith('/api/')) {
      // Static asset fallthrough (the platform handles this; defensive default).
      return new Response('Not Found', { status: 404 });
    }

    if (path === '/api/auth') return handleAuth(req, env);

    if (!isAuthed(req, env)) return json({ error: 'unauthorized' }, { status: 401 });

    if (path === '/api/items') {
      if (req.method === 'GET') return listItems(req, env);
      if (req.method === 'POST') return createItem(req, env);
      return json({ error: 'method' }, { status: 405 });
    }

    const itemMatch = /^\/api\/items\/([A-Za-z0-9-]+)$/.exec(path);
    if (itemMatch) {
      const id = itemMatch[1];
      if (req.method === 'GET') return getItem(env, id);
      if (req.method === 'PATCH') return patchItem(req, env, id);
      if (req.method === 'DELETE') return deleteItem(env, id);
      return json({ error: 'method' }, { status: 405 });
    }

    if (path === '/api/stats') {
      return req.method === 'GET' ? stats(env) : json({ error: 'method' }, { status: 405 });
    }

    return json({ error: 'not found' }, { status: 404 });
  }
} satisfies ExportedHandler<Env>;
