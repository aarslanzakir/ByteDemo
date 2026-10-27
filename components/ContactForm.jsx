'use client'

import { useState } from 'react'

// Shows the fields chosen in Byte → Lead capture. Sending the lead to Byte
// is Phase 2; for now the form only confirms locally.
export default function ContactForm({ fields }) {
  const [sent, setSent] = useState(false)

  if (sent) return <p className='center sent'>Thanks! (Leads will reach Byte in Phase 2.)</p>

  return (
    <form
      className='form'
      onSubmit={event => {
        event.preventDefault()
        setSent(true)
      }}
    >
      {fields.name && <input name='name' placeholder='Name' required />}
      <input name='email' type='email' placeholder='Email' required />
      {fields.phone && <input name='phone' placeholder='Phone' />}
      {fields.message && <textarea name='message' placeholder='Message' rows={4} />}
      <button className='btn' type='submit'>
        Send message
      </button>
    </form>
  )
}
