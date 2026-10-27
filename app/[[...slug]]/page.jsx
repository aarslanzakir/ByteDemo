// Every page of the site. Rendered on the server for each visit (SSR), with
// content from Byte (see lib/byte.js for the cache → live → default order).
import Link from 'next/link'
import { notFound } from 'next/navigation'

import Sections from '@/components/Sections'
import { getPage, getSite } from '@/lib/byte'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const [site, page] = await Promise.all([getSite(), getPage('/' + (params.slug || []).join('/'))])

  return { title: page ? `${page.title} · ${site.name}` : site.name }
}

export default async function Page({ params }) {
  const path = '/' + (params.slug || []).join('/')
  const [site, page] = await Promise.all([getSite(), getPage(path)])

  if (!page) notFound()

  const fromDefault = page.source === 'default'

  return (
    <div style={{ '--accent': site.accent || '#2F80ED' }}>
      <header className='nav'>
        <Link href='/' className='brand'>
          {site.name}
        </Link>
        <nav>
          {site.pages.map(p => (
            <Link key={p.path} href={p.path} className={p.path === path ? 'active' : ''}>
              {p.title}
            </Link>
          ))}
        </nav>
      </header>

      <main>
        <Sections sections={page.sections} leadCapture={site.lead_capture || {}} />
      </main>

      <footer className='footer'>
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>{[site.phone, site.contact_email].filter(Boolean).join(' · ')}</span>
      </footer>

      {/* Testing aid: shows where this page's content came from. */}
      <div className={`source ${fromDefault ? 'source-default' : 'source-byte'}`}>
        {fromDefault ? `Default content (${page.reason})` : 'Content from Byte'} · rendered {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}
