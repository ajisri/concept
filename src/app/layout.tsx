import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Konstrüksi — Premium Construction & Architecture',
  description:
    'Award-winning construction company crafting landmark structures across Southeast Asia. Specializing in commercial, residential, infrastructure, and architectural design with 25+ years of excellence.',
  keywords: [
    'construction',
    'architecture',
    'building',
    'infrastructure',
    'renovation',
    'interior design',
    'premium construction',
    'Southeast Asia',
  ],
  openGraph: {
    title: 'Konstrüksi — Building Legacy',
    description:
      'Where vision meets precision. Crafting structures that define skylines and stand the test of time.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Konstrüksi — Premium Construction & Architecture',
    description:
      'Award-winning construction company crafting landmark structures.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <SmoothScroll>
          <CustomCursor />
          <div className="noise-overlay" aria-hidden="true" />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
