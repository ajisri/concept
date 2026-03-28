'use client';

import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO_ENTRANCE_DELAY } from '@/lib/animation-constants';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (!prefersReducedMotion) {
        // ─── 1. Per-character entrance (mask pattern) ─────────────────────
        // Characters already have overflow:hidden via headingLine
        // We animate each char's yPercent from 110 (below the slot) to 0
        gsap.fromTo(
          '.js-hero-char',
          { yPercent: 110, rotateX: 15 },
          {
            yPercent: 0,
            rotateX: 0,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.04,
            delay: HERO_ENTRANCE_DELAY,
          }
        );

        // ─── 2. Subtitle mask reveal ───────────────────────────────────────
        gsap.fromTo(
          '.js-hero-subtitle',
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.9,
            ease: 'power3.out',
            delay: HERO_ENTRANCE_DELAY + 0.6,
          }
        );

        // ─── 3. Scroll indicator fade in ──────────────────────────────────
        gsap.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            delay: HERO_ENTRANCE_DELAY + 0.9,
          }
        );

        // ─── 4. Scroll-scrub: chars parallax out (translate up) ───────────
        gsap.to('.js-hero-char', {
          yPercent: -80,
          stagger: 0.015,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        // ─── 5. Subtitle scroll out ───────────────────────────────────────
        gsap.to(subtitleRef.current, {
          y: -60,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '40% top',
            scrub: true,
          },
        });

        // ─── 6. Noise grain layer animate (fake film grain) ───────────────
        // Jitter position on noise SVG every frame for realistic grain
        if (noiseRef.current) {
          gsap.to(noiseRef.current, {
            backgroundPosition: '200% 200%',
            duration: 8,
            ease: 'none',
            repeat: -1,
            yoyo: true,
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero} id="hero">
      {/* Film grain / noise overlay (aesthetic — purely decorative) */}
      <div ref={noiseRef} className={styles.noise} aria-hidden="true" />

      <div className={styles.gridContainer}>
        <div className={styles.leftCol}>
          <div className={styles.metaLabel}>01 — INTRO</div>
          <div className={styles.scrollIndicator} ref={scrollIndicatorRef}>
            <div className={styles.scrollLine} />
            <span className={styles.scrollText}>SCROLL</span>
          </div>
        </div>

        <div className={styles.rightCol}>
          {/* Heading: each char is js-hero-char, headingLine has overflow:hidden */}
          <h1 className={styles.heading}>
            <div className={styles.headingLine}>
              {'BUILDING'.split('').map((char, i) => (
                <span
                  key={`b-${i}`}
                  className={`${styles.char} js-hero-char`}
                  aria-hidden={true}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
            <div className={styles.headingLine}>
              {'LEGACY'.split('').map((char, i) => (
                <span
                  key={`l-${i}`}
                  className={`${styles.char} js-hero-char`}
                  aria-hidden={true}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
            {/* Screen reader only — the chars are aria-hidden */}
            <span className={styles.srOnly}>Building Legacy</span>
          </h1>

          {/* Subtitle with mask reveal wrapper */}
          <div className={styles.subtitleWrapper}>
            <p
              ref={subtitleRef}
              className={`${styles.subtitle} js-hero-subtitle`}
            >
              Where vision meets precision — crafting structures that define
              skylines and stand the test of time. Engineering excellence driven
              by data and geometry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
