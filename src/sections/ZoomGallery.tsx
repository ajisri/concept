'use client';

import { useEffect, useRef } from 'react';
import styles from './ZoomGallery.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
    alt: 'Modern skyscraper under construction',
    x: '-15%', // Shift right from text
    y: '5%',   // Shift down from text
    z: -200,
  },
  {
    src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    alt: 'Construction crane at sunset',
    x: '25%',
    y: '-25%', // Send top right higher
    z: -400,
  },
  {
    src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    alt: 'Architectural blueprints',
    x: '-25%',
    y: '30%', // Shift down
    z: -600,
  },
  {
    src: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80',
    alt: 'Modern building facade detail',
    x: '30%',
    y: '25%',
    z: -350,
  },
  {
    src: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
    alt: 'Construction workers at height',
    x: '5%',
    y: '-5%',
    z: -800,
  },
  {
    src: 'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=600&q=80',
    alt: 'Steel structure framework',
    x: '-35%',
    y: '50%', // Deep bottom left
    z: -500,
  },
  {
    src: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=600&q=80',
    alt: 'Interior construction progress',
    x: '35%',
    y: '-30%',
    z: -700,
  },
];

export default function ZoomGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      // The main zoom effect: translateZ moves the gallery "toward" the viewer
      gsap.to(galleryRef.current, {
        z: 1200,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          pin: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.zoomGallery}>
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
                left: `calc(50% + ${img.x})`,
                top: `calc(50% + ${img.y})`,
                transform: `translate(-50%, -50%) translateZ(${img.z}px)`,
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
