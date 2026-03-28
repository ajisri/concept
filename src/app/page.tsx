import Hero from '@/sections/Hero';
import Marquee from '@/sections/Marquee';
import About from '@/sections/About';
import Projects from '@/sections/Projects';
import ZoomGallery from '@/sections/ZoomGallery';
import Services from '@/sections/Services';
import Testimonials from '@/sections/Testimonials';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';

// JSON-LD Structured Data (Server Component — no bundle cost)
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Konstrüksi',
  description:
    'Award-winning construction company crafting landmark structures across Southeast Asia.',
  url: 'https://konstruksi.com',
  logo: 'https://konstruksi.com/og-image.jpg',
  image: 'https://konstruksi.com/og-image.jpg',
  sameAs: [
    'https://instagram.com/konstruksi',
    'https://linkedin.com/company/konstruksi',
  ],
  openingHours: 'Mo-Fr 09:00-18:00',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['English', 'Indonesian'],
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Construction Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Structural Engineering' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Architectural Preservation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Urban Masterplanning' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Interior Spatial Design' } },
    ],
  },
};

export default function Home() {
  return (
    <>
      {/* JSON-LD as a script in the document head — improves SEO rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Projects />
        <ZoomGallery />
        <Services />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
