import './globals.css'

export const metadata = {
  title: 'Demo client website',
  description: 'A sample client website powered by Byte.'
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
