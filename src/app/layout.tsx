import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navigation } from '@/components/navigation';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0f1a',
};

export const metadata: Metadata = {
  title: {
    default: 'PatentRadar - Discover NASA Patents',
    template: '%s | PatentRadar',
  },
  description: 'Browse, search, and analyze 600+ NASA patents available for licensing. AI-powered business analysis for technology commercialization.',
  keywords: ['NASA patents', 'technology transfer', 'patent licensing', 'NASA technology', 'business analysis'],
  openGraph: {
    title: 'PatentRadar - Discover NASA Patents',
    description: 'Browse, search, and analyze 600+ NASA patents available for licensing.',
    type: 'website',
    siteName: 'PatentRadar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PatentRadar - Discover NASA Patents',
    description: 'Browse, search, and analyze 600+ NASA patents available for licensing.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://technology.nasa.gov" />
        <link rel="preconnect" href="https://technology.nasa.gov" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)] min-h-screen`}>
        <Providers>
          <Navigation />
          <main className="pb-20 md:pb-0 md:pl-16 lg:pl-60">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
