import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Arjun & Meera — 24.01.2027',
  description:
    'Arjun & Meera are getting married. Join us on 24 January 2027 at The Grand Hotel, Chennai.',
  openGraph: {
    title: 'Arjun & Meera — We are getting married',
    description: '24 January 2027 · The Grand Hotel, Chennai',
    images: ['/images/hero-desktop.jpg'],
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#F7F3EC',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
