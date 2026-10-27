// Renders the section types Byte's editor offers: hero, services, about,
// testimonials, contact and booking. Unknown types are skipped, so adding a
// type in Byte never breaks an older site.
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

const Booking = ({ s, leadCapture }) =>
  leadCapture.booking && leadCapture.calLink ? (
    <section className='block tinted' id='book'>
      <h2>{s.heading}</h2>
      <p className='muted center'>{s.text}</p>
      <iframe className='cal' src={`${leadCapture.calLink}?embed=true`} title='Book a time' loading='lazy' />
    </section>
  ) : null

const RENDERERS = { hero: Hero, services: Services, about: About, testimonials: Testimonials, contact: Contact, booking: Booking }

export default function Sections({ sections = [], leadCapture }) {
  return sections.map(s => {
    const Renderer = RENDERERS[s.type]

    return Renderer ? <Renderer key={s.id} s={s} leadCapture={leadCapture} /> : null
  })
}
