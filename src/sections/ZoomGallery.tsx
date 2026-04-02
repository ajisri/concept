'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './ZoomGallery.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
    alt: 'Modern skyscraper under construction — steel framework',
    x: '-15vw', y: '5vh', z: -200,
    mx: '-25vw', my: '-15vh',
  },
  {
    src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    alt: 'Construction crane at golden hour',
    x: '25vw', y: '-25vh', z: -400,
    mx: '25vw', my: '20vh',
  },
  {
    src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    alt: 'Architectural blueprints and design plans',
    x: '-25vw', y: '30vh', z: -600,
    mx: '-20vw', my: '25vh',
  },
  {
    src: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80',
    alt: 'Modern building facade — geometric glass detail',
    x: '30vw', y: '25vh', z: -350,
    mx: '15vw', my: '-30vh',
  },
  {
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    alt: 'Skyscraper towers viewed from below — corporate district',
    x: '5vw', y: '-5vh', z: -800,
    mx: '5vw', my: '5vh',
  },
  {
    src: 'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=600&q=80',
    alt: 'Steel structure framework — industrial engineering',
    x: '-35vw', y: '50vh', z: -500,
    mx: '-30vw', my: '45vh',
  },
  {
    src: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=600&q=80',
    alt: 'Interior construction progress — concrete and steel',
    x: '35vw', y: '-30vh', z: -700,
    mx: '35vw', my: '-5vh',
  },
] as const;

export default function ZoomGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // Heading reveal
      gsap.fromTo(
        headingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
        }
      );

      // Ensure gallery images are placed
      gsap.set(galleryRef.current, {
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      });

      // The main zoom: translateZ moves gallery "toward" the viewer
      gsap.to(galleryRef.current, {
        z: 1200,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%', // increase scroll distance for a smoother, longer 3D zoom rather than instantly finishing
          scrub: 1,
          pin: true,
          pinType: 'transform', // CRITICAL: allows pinning inside transformed parents
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.zoomGallery} id="gallery">
      <div ref={headingRef} className={styles.header}>
        <span className={styles.label}>GALLERY</span>
        <h2 className={styles.heading}>Into the depth of detail</h2>
      </div>

      <div className={styles.perspective}>
        <div ref={galleryRef} className={styles.gallery}>
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className={styles.item}
              style={{
                '--x': img.x,
                '--y': img.y,
                '--m-x': img.mx,
                '--m-y': img.my,
                '--z': `${img.z}px`,
              } as React.CSSProperties}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 80vw, 30vw"
                  priority={i < 2}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  quality={75}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
