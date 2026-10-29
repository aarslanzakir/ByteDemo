// Renders the section types Byte's editor offers: hero, services, about,
// testimonials and contact. Widgets (booking calendar, and any added later)
// arrive with an `embed` and are shown in a frame, so they need no code here.
// Unknown types are skipped, so adding a type in Byte never breaks an older site.
import EmbedFrame from './EmbedFrame'
import ContactForm from './ContactForm'

const Hero = ({ s }) => (
  <section
    className='hero'
    style={s.image ? { background: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url("${s.image}") center/cover` } : undefined}
  >
    <h1>{s.heading}</h1>
    {s.subheading && <p>{s.subheading}</p>}
    {s.buttonLabel && (
      <a href='#contact' className='btn btn-light'>
        {s.buttonLabel}
      </a>
    )}
  </section>
)

const Services = ({ s }) => (
  <section className='block'>
    <h2>{s.heading}</h2>
    <div className='grid'>
      {(s.items || []).map((item, i) => (
        <div key={i} className='card'>
          <span className='tick' />
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  </section>
)

const About = ({ s }) => (
  <section className='block about'>
    <div>
      <h2 style={{ textAlign: 'left' }}>{s.heading}</h2>
      <p className='muted pre'>{s.text}</p>
    </div>
    <div className='about-img' style={s.image ? { background: `url("${s.image}") center/cover` } : undefined} />
  </section>
)

const Testimonials = ({ s }) => (
  <section className='block tinted'>
    <h2>{s.heading}</h2>
    <div className='grid'>
      {(s.items || []).map((item, i) => (
        <blockquote key={i} className='quote'>
          <p>“{item.quote}”</p>
          <cite>— {item.author}</cite>
        </blockquote>
      ))}
    </div>
  </section>
)

const Contact = ({ s, leadCapture }) =>
  leadCapture.contactForm === false ? null : (
    <section className='block' id='contact'>
      <h2>{s.heading}</h2>
      <p className='muted center'>{s.text}</p>
      <ContactForm fields={leadCapture.fields || {}} />
    </section>
  )

// Sites set up before Byte had its own calendar used a Cal.com link.
const Booking = ({ s, leadCapture }) =>
  leadCapture.booking && leadCapture.calLink ? (
    <Embed s={s} embed={{ url: `${leadCapture.calLink}?embed=true`, title: s.heading }} />
  ) : null

// Any Byte widget: the CMS sends it ready to embed, so new widgets need no code here.
const Embed = ({ s, embed }) => (
  <section className='block tinted' id={s.type === 'booking' ? 'book' : undefined}>
    {s.heading && <h2>{s.heading}</h2>}
    {s.text && <p className='muted center'>{s.text}</p>}
    <EmbedFrame src={embed.url} title={embed.title || s.heading || 'Byte widget'} minHeight={embed.min_height} />
  </section>
)

const RENDERERS = { hero: Hero, services: Services, about: About, testimonials: Testimonials, contact: Contact, booking: Booking }

export default function Sections({ sections = [], leadCapture }) {
  return sections.map(s => {
    // A section that comes with an embed is shown as one, whatever its type.
    if (s.embed?.url) return <Embed key={s.id} s={s} embed={s.embed} />

    const Renderer = RENDERERS[s.type]

    return Renderer ? <Renderer key={s.id} s={s} leadCapture={leadCapture} /> : null
  })
}
