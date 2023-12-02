import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Heading from '@components/Heading'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IoT',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Heading/>
        {children}
        {/* <Footer/> */}
      </body>
    </html>
  )
}
