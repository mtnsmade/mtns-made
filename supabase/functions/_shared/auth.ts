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
  planName?: string;
  status: string;
  type?: string;
}

export interface VerifiedMember {
  id: string; // Memberstack member id (mem_...)
  email: string;
  planConnections: PlanConnection[];
  customFields: Record<string, unknown>;
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
      planName: c.planName,
      status: c.status,
      type: c.type,
    })),
    customFields: (m.customFields && typeof m.customFields === 'object') ? m.customFields : {},
  };

  if (cache.size > 500) cache.clear();
  cache.set(token, { at: Date.now(), member });
  return member;
}

export function isStaffMember(member: VerifiedMember): boolean {
  return member.planConnections.some(
    (c) => c.planId === STAFF_PLAN_ID && c.status === 'ACTIVE',
  );
}

export async function verifyStaff(req: Request): Promise<VerifiedMember> {
  const member = await verifyMember(req);
  if (!isStaffMember(member)) throw new AuthError('staff access required');
  return member;
}

/** Length-safe constant-time compare. */
export function constantTimeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  }
  return diff === 0;
}

/**
 * A call from another edge function or a scheduled job: either the service
 * role key as the bearer token, or the shared internal secret header.
 * Neither value is ever present in the browser.
 */
export function isInternalCall(req: Request): boolean {
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const internalSecret = Deno.env.get('INTERNAL_FN_SECRET') || '';
  const bearer = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const presented = req.headers.get('x-internal-secret') || '';
  return (
    (serviceKey.length > 0 && constantTimeEqual(bearer, serviceKey)) ||
    (internalSecret.length > 0 && constantTimeEqual(presented, internalSecret))
  );
}

export function requireInternal(req: Request): void {
  if (!isInternalCall(req)) throw new AuthError('internal access only');
}

/** Internal callers pass straight through (returns null); browsers need a staff login. */
export async function verifyStaffOrInternal(req: Request): Promise<VerifiedMember | null> {
  if (isInternalCall(req)) return null;
  return await verifyStaff(req);
}

export function authErrorResponse(err: unknown, corsHeaders: Record<string, string>): Response | null {
  if (!(err instanceof AuthError)) return null;
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
