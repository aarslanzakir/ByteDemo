'use client'

import { useEffect, useRef, useState } from 'react'

// A Byte widget (booking calendar, and any widget added later) in a frame.
// The widget reports its height ({type: 'byte-embed-height'}), so the frame grows to fit it.
export default function EmbedFrame({ src, title, minHeight = 640 }) {
  const ref = useRef(null)
  const [height, setHeight] = useState(minHeight)

  useEffect(() => {
    const onMessage = event => {
      const type = event.data?.type

      if (event.source === ref.current?.contentWindow && (type === 'byte-embed-height' || type === 'byte-booking-height')) {
        setHeight(Math.max(200, Number(event.data.height) || 0))
      }
    }

    window.addEventListener('message', onMessage)

    return () => window.removeEventListener('message', onMessage)
  }, [])

  return <iframe ref={ref} className='byte-embed' src={src} title={title} style={{ height }} />
}
