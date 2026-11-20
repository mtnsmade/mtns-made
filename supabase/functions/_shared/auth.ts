/**
 * MTNS MADE - verify who is calling an edge function.
 *
 * The browser sends the logged-in member's Memberstack token in the
 * X-Member-Token header. These helpers check it with Memberstack server-side
 * and return the verified member. Anything in the request body that claims an
 * identity (memberstack_id, member id) must not be used for scoping.
 *
 * Both helpers fail closed: on any problem they throw AuthError, which the
 * caller turns into a 401 with authErrorResponse().
 */

const MEMBERSTACK_API = 'https://admin.memberstack.com';
// Memberstack's edge rejects default runtime user agents (Cloudflare 1010).
const MS_USER_AGENT = 'curl/8.7.1';
export const STAFF_PLAN_ID = 'pln_admin-o4hk0j5b';

const CACHE_MS = 5 * 60 * 1000;
const cache = new Map<string, { at: number; member: VerifiedMember }>();

export interface PlanConnection {
  planId: string;
  status: string;
  type?: string;
}

export interface VerifiedMember {
  id: string; // Memberstack member id (mem_...)
  email: string;
  planConnections: PlanConnection[];
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

function apiKey(): string {
  const key = Deno.env.get('MEMBERSTACK_API_KEY') || '';
  if (!key) throw new AuthError('server not configured');
  return key;
}

async function msFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return await fetch(MEMBERSTACK_API + path, {
    ...init,
    headers: {
      'X-API-KEY': apiKey(),
      'User-Agent': MS_USER_AGENT,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

export async function verifyMember(req: Request): Promise<VerifiedMember> {
  const token = (req.headers.get('x-member-token') || '').trim();
  if (!token) throw new AuthError('missing member token');

  const hit = cache.get(token);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.member;

  let res: Response;
  try {
    res = await msFetch('/members/verify-token', { method: 'POST', body: JSON.stringify({ token }) });
  } catch {
    throw new AuthError('could not verify token');
  }
  if (!res.ok) throw new AuthError('invalid member token');
  const body = await res.json().catch(() => null);
  const id = body?.data?.id;
  if (typeof id !== 'string' || !id.startsWith('mem_')) throw new AuthError('invalid member token');

  // Plan connections come from the member record, not the token.
  let memberRes: Response;
  try {
    memberRes = await msFetch('/members/' + encodeURIComponent(id));
  } catch {
    throw new AuthError('could not load member');
  }
  if (!memberRes.ok) throw new AuthError('member not found');
  const m = (await memberRes.json().catch(() => null))?.data;
  if (!m || m.id !== id) throw new AuthError('member not found');

  const member: VerifiedMember = {
    id,
    email: m.auth?.email || '',
    planConnections: (m.planConnections || []).map((c: PlanConnection) => ({
      planId: c.planId,
      status: c.status,
      type: c.type,
    })),
  };

  if (cache.size > 500) cache.clear();
  cache.set(token, { at: Date.now(), member });
  return member;
}

export async function verifyStaff(req: Request): Promise<VerifiedMember> {
  const member = await verifyMember(req);
  const isStaff = member.planConnections.some(
    (c) => c.planId === STAFF_PLAN_ID && c.status === 'ACTIVE',
  );
  if (!isStaff) throw new AuthError('staff access required');
  return member;
}

export function authErrorResponse(err: unknown, corsHeaders: Record<string, string>): Response | null {
  if (!(err instanceof AuthError)) return null;
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
