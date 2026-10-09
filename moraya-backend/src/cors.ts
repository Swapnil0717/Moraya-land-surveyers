import type { Env } from './env'

/** Adds CORS headers only for origins listed in ALLOWED_ORIGINS. Everything else gets none,
 *  so browsers block cross-site calls from unknown websites. */
export function withCors(response: Response, request: Request, env: Env): Response {
  const origin = request.headers.get('origin')
  const allowed = (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
  const headers = new Headers(response.headers)
  headers.append('vary', 'Origin')
  if (origin && allowed.includes(origin)) {
    headers.set('access-control-allow-origin', origin)
    headers.set('access-control-allow-headers', 'authorization, content-type')
    headers.set('access-control-allow-methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    headers.set('access-control-max-age', '86400')
  }
  return new Response(response.body, { status: response.status, headers })
}
