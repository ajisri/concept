import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import PageCurtain from '@/components/PageCurtain';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import BackgroundTransition from '@/components/BackgroundTransition';

// Inter is a variable font — no weight needed
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  // metadataBase is required so og:url and twitter:url are absolute
  metadataBase: new URL('https://konstruksi.com'),
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
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Konstrüksi — Building Legacy',
    description:
      'Where vision meets precision. Crafting structures that define skylines and stand the test of time.',
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Konstrüksi',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Konstrüksi — Premium Construction & Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Konstrüksi — Premium Construction & Architecture',
    description:
      'Award-winning construction company crafting landmark structures.',
    images: ['/og-image.jpg'],
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
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning>
        {/* Fixed UI elements must NOT be inside the SmoothScroll transformed wrapper */}
        <Preloader />
        <CustomCursor />
        <PageCurtain />
        <Navbar />
        <BackgroundTransition />
        <div className="noise-overlay" aria-hidden="true" />
        
        {/* The scrolling physics only apply to the actual page content */}
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
