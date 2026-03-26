import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Hero from '@/sections/Hero';
import Marquee from '@/sections/Marquee';
import About from '@/sections/About';
import Projects from '@/sections/Projects';
import ZoomGallery from '@/sections/ZoomGallery';
import Services from '@/sections/Services';
import Testimonials from '@/sections/Testimonials';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';

export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
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
