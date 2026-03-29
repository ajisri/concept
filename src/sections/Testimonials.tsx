'use client';

import { useEffect, useRef } from 'react';
import styles from './Testimonials.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote:
      "They didn't just build our headquarters — they built an emotional bridge to our customers. The immersive spatial flow intuitively guides behavior, proving their design is a strategic force.",
    author: 'SARAH CHEN',
    role: 'CEO, VERTEX GROUP',
  },
  {
    quote:
      "Their obsession with cognitive load is brilliant. The brutalist minimalism isn't just aesthetic; it actively reduced operational friction and increased our workspace productivity by 40%.",
    author: 'MARCUS ALVAREZ',
    role: 'DIRECTOR, MERIDIAN',
  },
  {
    quote:
      "A masterclass in inclusive architecture. They proved that universal accessibility and high-end aesthetic rigor can coexist, and even elevate one another into a landmark experience.",
    author: 'YUKI TANAKA',
    role: 'FOUNDER, AETHER',
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

      // ─── Word-by-word kinetic reveal ──────────────────────────────────────
      quotesRef.current.forEach((quoteEl) => {
        if (!quoteEl) return;
        const words = quoteEl.querySelectorAll(`.${styles.word}`);

        gsap.fromTo(
          words,
          { opacity: 0.1, y: '0.2em' },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.02, 
            scrollTrigger: {
              trigger: quoteEl,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });

      // ─── Author line reveal ───────────────────────────────────────────────
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

      // ─── Author info fade in ──────────────────────────────────────────────
      gsap.utils.toArray<Element>(`.${styles.authorInfo}`).forEach((info) => {
        gsap.fromTo(
          info,
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: info, start: 'top 90%', once: true },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.testimonials} id="clients">
      <div className={styles.container}>
        
        {/* Left Side (Sticky label) */}
        <div className={styles.stickySidebar}>
          <span className={styles.metaLabel}>(05) CLIENTS</span>
        </div>

        {/* Right Side (Feed) */}
        <div className={styles.scrollContent}>
          {TESTIMONIALS.map((testi, i) => (
            <div key={i} className={styles.testimonialCard}>
              <blockquote
                className={styles.quoteText}
                ref={(el) => {
                  if (el) quotesRef.current[i] = el;
                }}
              >
                {/* Wrap each word in inline-block to allow natural line breaks */}
                {testi.quote.split(' ').map((word, wi, arr) => (
                  <span key={wi} className={styles.wordWrapper}>
                    <span className={styles.word}>{word}</span>
                    {wi < arr.length - 1 && ' '}
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
