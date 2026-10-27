// Byte calls this when content is published (and when you press "Send test
// webhook"). It clears the cached content so the next visit loads live data.
import { revalidateTag } from 'next/cache'

import { CACHE_TAG } from '@/lib/byte'

export async function POST(request) {
  if (!process.env.BYTE_WEBHOOK_SECRET || request.headers.get('x-byte-secret') !== process.env.BYTE_WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await request.json().catch(() => ({}))

  revalidateTag(CACHE_TAG)
  console.log(`[byte] webhook ${body.event || 'unknown'} for ${body.site_id || '?'}: cache cleared`)

  return Response.json({ revalidated: true })
}
