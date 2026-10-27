// Loads this website's content from Byte, in three layers:
//   1. Default data: content/default-content.json, shipped with the site.
//   2. Cached data:  Next.js keeps Byte's responses until Byte calls the
//                    webhook (app/api/byte/revalidate) or 5 minutes pass.
//   3. Live data:    on a cache miss, fetched fresh from Byte.
// If Byte is down, slow or the keys are wrong, the default data is used, so
// the website never goes blank.

import defaultContent from '@/content/default-content.json'

const API_URL = (process.env.BYTE_API_URL || 'https://adminapi.byteadvisory.ai/api/v1/sites').replace(/\/$/, '')
const SITE_ID = process.env.BYTE_SITE_ID
const API_KEY = process.env.BYTE_API_KEY

export const CACHE_TAG = 'byte-content'

const fromByte = async path => {
  if (!SITE_ID || !API_KEY) return { ok: false, reason: 'BYTE_SITE_ID / BYTE_API_KEY not set' }

  try {
    const res = await fetch(`${API_URL}/${SITE_ID}${path}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      next: { tags: [CACHE_TAG], revalidate: 300 },
      signal: AbortSignal.timeout(3000)
    })

    if (res.ok) return { ok: true, data: await res.json() }
    if (res.status === 404) return { ok: true, data: null }

    return { ok: false, reason: `Byte answered ${res.status}` }
  } catch (err) {
    return { ok: false, reason: err?.name === 'TimeoutError' ? 'Byte timed out' : "Byte couldn't be reached" }
  }
}

// Site-wide info: name, colour, contact details, lead capture and the page list.
export async function getSite() {
  const result = await fromByte('')

  if (result.ok && result.data) return { ...result.data, source: 'byte' }

  return {
    site_id: defaultContent.site_id,
    name: defaultContent.name,
    accent: '#2F80ED',
    contact_email: null,
    phone: null,
    lead_capture: { contactForm: true, booking: false, calLink: '', fields: { name: true, email: true, phone: true, message: true } },
    pages: defaultContent.pages.map(({ title, path }) => ({ title, path })),
    source: 'default',
    reason: result.reason
  }
}

// One page by path, e.g. "/" or "/about". Returns null for an unknown page.
export async function getPage(path) {
  const result = await fromByte(`/pages?path=${encodeURIComponent(path)}`)

  if (result.ok) return result.data && { ...result.data, source: 'byte' }

  const page = defaultContent.pages.find(p => p.path === path)

  return page ? { ...page, source: 'default', reason: result.reason } : null
}
