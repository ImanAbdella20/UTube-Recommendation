import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import SideBar from '@/components/SideBar'

const inter = Inter({ subsets: ['latin'] })
const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UTube - Smart Video Recommendations',
  description: 'Discover videos tailored to your preferences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Header />
        <div className="flex">
          <main className="flex-1 p-6 ml-64"> {/* Adjust ml based on sidebar width */}
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}