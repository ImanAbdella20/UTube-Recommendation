import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import LayoutWrapper from './LayoutWrapper';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Ensures text remains visible during webfont load
});

/**
 * Base metadata that will be used across all pages
 * Can be overridden by individual pages
 */
export const metadata: Metadata = {
  // Title settings
  title: {
    default: 'UTube - Smart Video Recommendations', // Default title for pages without their own
    template: '%s | UTube', // Template for dynamic titles (e.g., "My Video | UTube")
  },
  
  // Description and keywords
  description: 'Discover videos tailored to your preferences with our AI-powered recommendation engine',
  keywords: [
    'video recommendations', 
    'personalized videos', 
    'UTube',
    'content discovery',
    'AI recommendations'
  ], // Helps with search ranking
  
  // Required for absolute URL generation
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  
  // Canonical URL settings
  alternates: {
    canonical: '/', // Helps prevent duplicate content issues
  },
  
  // Search engine indexing control
  robots: {
    index: true, // Allow search engines to index this page
    follow: true, // Allow search engines to follow links
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large', // Allows Google to show larger image previews
      'max-video-preview': -1, // Allows full-length video previews
    },
  },
  
  // Favicons and PWA manifest
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest', // For Progressive Web App capabilities
  
  // Social media sharing (OpenGraph)
  openGraph: {
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    title: 'UTube - Smart Video Recommendations',
    description: 'Discover videos tailored to your preferences',
    siteName: 'UTube',
    images: [
      {
        url: '/og-image.png', // Social sharing image (1200x536 recommended)
        width: 1200,
        height: 536,
        alt: 'UTube - Personalized video recommendations',
      },
    ],
    locale: 'en_US',
  },
  
  // Twitter-specific cards
  twitter: {
    card: 'summary_large_image', // Displays large image preview on Twitter
    title: 'UTube - Smart Video Recommendations',
    description: 'Discover videos tailored to your preferences',
    creator: '@UTubeOfficial', // Your Twitter handle
    images: ['/og-image.png'],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      
      <body className="min-h-screen bg-gray-50">
       
        <AuthProvider>
          <LayoutWrapper>
            <main >
              {children}
            </main>
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}