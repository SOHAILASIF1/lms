import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '../components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Notes App',
  description: 'A modern note-taking app built with Next.js and MongoDB.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-surface text-slate-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
