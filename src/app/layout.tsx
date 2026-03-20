import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TOR Physiotherapy — Book Your Appointment',
  description: 'Sports massage and physiotherapy with Callum. Online booking available.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-white text-gray-900 antialiased`}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} TOR Physiotherapy. All rights reserved. | @torphysiotherapy
          </footer>
        </Providers>
      </body>
    </html>
  )
}
