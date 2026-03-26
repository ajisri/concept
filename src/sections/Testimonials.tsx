'use client';

import { useEffect, useRef } from 'react';
import styles from './Testimonials.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote: "Konstrüksi didn't just build our headquarters — they built our identity. The craftsmanship speaks for itself. A true masterclass in precision and monumental scale.",
    author: 'SARAH CHEN',
    role: 'CEO, VERTEX GROUP',
  },
  {
    quote: "Working with Konstrüksi felt like a true partnership. They anticipated challenges before they arrived, delivering our project flawlessly. That is the difference.",
    author: 'MARCUS ALVAREZ',
    role: 'DIRECTOR, MERIDIAN',
  },
  {
    quote: "Three years later, our building still turns heads. The urban planning integration is second to none.",
    author: 'YUKI TANAKA',
    role: 'FOUNDER, AETHER DEVELOPMENTS',
  }
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Elegant vertical reveal for each testimonial block
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.testimonials} id="testimonials">
      <div className={styles.container}>
        
        {/* Left column (Sticky Title) */}
        <div className={styles.stickySidebar}>
          <span className={styles.metaLabel}>05 — CLIENTS</span>
          <h2 className={styles.sectionTitle}>
            VOICES OF <br/>
            PARTNERSHIP.
          </h2>
          <p className={styles.sectionDesc}>
            Our projects define skylines, but our relationships define our legacy. Here is what industry leaders say about working with us.
          </p>
        </div>

        {/* Right column (Scrolling vertical list) */}
        <div className={styles.scrollContent}>
          {TESTIMONIALS.map((testi, i) => (
            <div 
              key={i} 
              className={styles.testimonialCard}
              ref={(el) => {
                if (el) itemsRef.current[i] = el;
              }}
            >
              <div className={styles.quoteMark}>"</div>
              <h3 className={styles.quoteText}>{testi.quote}</h3>
              <div className={styles.authorMeta}>
                <div className={styles.authorLine} />
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{testi.author}</span>
                  <span className={styles.authorRole}>{testi.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
