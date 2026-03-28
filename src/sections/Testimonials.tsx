'use client';

import { useEffect, useRef } from 'react';
import styles from './Testimonials.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote:
      "Konstrüksi didn't just build our headquarters — they built our identity. The craftsmanship speaks for itself. A true masterclass in precision and monumental scale.",
    author: 'SARAH CHEN',
    role: 'CEO, VERTEX GROUP',
  },
  {
    quote:
      "Working with Konstrüksi felt like a true partnership. They anticipated challenges before they arrived, delivering our project flawlessly. That is the difference.",
    author: 'MARCUS ALVAREZ',
    role: 'DIRECTOR, MERIDIAN',
  },
  {
    quote:
      'Three years later, our building still turns heads. The urban planning integration is second to none.',
    author: 'YUKI TANAKA',
    role: 'FOUNDER, AETHER DEVELOPMENTS',
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const quotesRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // ─── Word-by-word kinetic reveal for each quote ────────────────────────
      // Split each quote into word spans and animate them in with stagger
      quotesRef.current.forEach((quoteEl) => {
        if (!quoteEl) return;

        // Get all word spans inside this quote
        const words = quoteEl.querySelectorAll(`.${styles.word}`);

        gsap.fromTo(
          words,
          { opacity: 0.1, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.015, // fast stagger — 15ms per word = cinematic
            scrollTrigger: {
              trigger: quoteEl,
              start: 'top 80%',
              once: true,
            },
          }
        );
      });

      // ─── Author line expand on scroll ─────────────────────────────────────
      gsap.utils.toArray<Element>(`.${styles.authorLine}`).forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.8,
            ease: 'power4.out',
            scrollTrigger: { trigger: line, start: 'top 90%', once: true },
          }
        );
      });

      // ─── Author name slide up ──────────────────────────────────────────────
      gsap.utils.toArray<Element>(`.${styles.authorInfo}`).forEach((info) => {
        gsap.fromTo(
          info,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: info, start: 'top 90%', once: true },
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
            VOICES OF <br />
            PARTNERSHIP.
          </h2>
          <p className={styles.sectionDesc}>
            Our projects define skylines, but our relationships define our
            legacy. Here is what industry leaders say about working with us.
          </p>
        </div>

        {/* Right column (Scrolling vertical list) */}
        <div className={styles.scrollContent}>
          {TESTIMONIALS.map((testi, i) => (
            <div key={i} className={styles.testimonialCard}>
              <div className={styles.quoteMark} aria-hidden="true">
                &ldquo;
              </div>

              {/* Word-by-word kinetic quote */}
              <blockquote
                className={styles.quoteText}
                ref={(el) => {
                  if (el) quotesRef.current[i] = el;
                }}
              >
                {testi.quote.split(' ').map((word, wi) => (
                  <span key={wi} className={styles.word}>
                    {word}
                    {'\u00A0'}
                  </span>
                ))}
              </blockquote>

              <div className={styles.authorMeta}>
                <div className={styles.authorLine} aria-hidden="true" />
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
