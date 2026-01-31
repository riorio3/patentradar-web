import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navigation } from '@/components/navigation';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PatentRadar - Discover NASA Patents',
  description: 'Browse, search, and analyze 600+ NASA patents available for licensing',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-100 min-h-screen`}>
        <Providers>
          <Navigation />
          <main className="pb-20 md:pb-0 md:pl-16 lg:pl-56">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
