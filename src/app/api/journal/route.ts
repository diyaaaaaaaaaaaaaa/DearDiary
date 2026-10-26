// src/app/api/journal/route.ts
import { siteConfig } from '@/config/site'
import { writeEntry } from '@/lib/journal-entry.mjs'

/**
 * Creates a journal entry file. DEVELOPMENT ONLY.
 *
 * On a deployed site the filesystem is read-only, and a public write endpoint would let
 * anyone edit your journal — so outside `next dev` this route does not exist (404).
 * Locally, it also refuses cross-site requests so a random web page you visit can't
 * write files through your dev server.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const origin = request.headers.get('origin')
  if (origin && new URL(origin).host !== request.headers.get('host')) {
    return Response.json({ error: 'Cross-site requests are not allowed.' }, { status: 403 })
  }
  // application/json forces a CORS preflight for other sites, which this route never approves.
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return Response.json({ error: 'Send JSON.' }, { status: 415 })
  }

  let input: unknown
  try {
    input = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const result = await writeEntry(process.cwd(), input, siteConfig.timezone)
  return result.ok
    ? Response.json({ slug: result.date }, { status: 201 })
    : Response.json({ error: result.error }, { status: result.status })
}