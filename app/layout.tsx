import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './components/client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Thank You Thomas',
  description: 'A heartfelt message collection platform for Thomas',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </head>
      <body className={inter.className} style={{ backgroundColor: "#E8D5C4", margin: 0, padding: 0 }}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
