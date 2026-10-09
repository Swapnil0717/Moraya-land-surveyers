import { authenticate } from './auth'
import { withCors } from './cors'
import { findEmployeeByAuthUser } from './db'
import type { Env } from './env'
import { HttpError, json } from './http'
import { buildProfile } from './profile'

async function handleApi(request: Request, env: Env, path: string): Promise<Response> {
  if (path === '/api/health' && request.method === 'GET') {
    return json({ ok: true })
  }

  // Who am I? Identity, role, permissions and account status — all decided here, never by the browser.
  if (path === '/api/me' && request.method === 'GET') {
    const { userId } = await authenticate(request, env)
    const row = await findEmployeeByAuthUser(env, userId)
    return json(buildProfile(userId, row))
  }

  throw new HttpError(404, 'NOT_FOUND')
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return withCors(new Response(null, { status: 204 }), request, env)
    }
    const { pathname } = new URL(request.url)
    let response: Response
    try {
      response = await handleApi(request, env, pathname)
    } catch (err) {
      if (err instanceof HttpError) {
        response = json({ error: err.code }, err.status)
      } else {
        console.error('Unhandled API error', err)
        response = json({ error: 'SERVER_ERROR' }, 500)
      }
    }
    return withCors(response, request, env)
  },
} satisfies ExportedHandler<Env>
