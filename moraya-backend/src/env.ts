export interface Env {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  /** Secret. Set with `wrangler secret put`. Never sent to the browser. */
  SUPABASE_SERVICE_ROLE_KEY: string
  /** Comma-separated list of browser origins allowed to call this API. */
  ALLOWED_ORIGINS?: string
}
