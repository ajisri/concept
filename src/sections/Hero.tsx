'use client';

import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/store/settings';
import { dict } from '@/lib/dictionary';
import { HERO_ENTRANCE_DELAY } from '@/lib/animation-constants';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (!prefersReducedMotion) {
        // ─── 0. Video Background Parallax ─────────────────────────────────
        gsap.to('.js-hero-video', {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        // ─── 1. Elegant line reveal for headings (No clipping) ─────────────
        gsap.fromTo(
          '.js-hero-line',
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: 'power3.out',
            stagger: 0.15,
            delay: HERO_ENTRANCE_DELAY,
          }
        );

        // ─── 2. Subtitle fade in ───────────────────────────────────────────
        gsap.fromTo(
          '.js-hero-subtitle',
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            delay: HERO_ENTRANCE_DELAY + 0.4,
          }
        );

        // ─── 3. Very subtle parallax without opacity fade (Fix missing text)
        gsap.to(headlineRef.current, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true, // Tie movement to scroll organically
          },
        });

        gsap.to(subtitleRef.current, {
          yPercent: -15, // Moves slightly faster for depth
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { lang } = useLanguage();
  const t = dict[lang as 'en' | 'id']?.hero || dict.en.hero;

  return (
    <section ref={sectionRef} className={styles.hero} id="journey" aria-label="Introduction">
      {/* Background Video Texture — Abstract Architectural Shadows */}
      <div className={styles.videoWrapper}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className={`${styles.video} js-hero-video`}
          poster="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800"
        >
          <source 
            src="https://player.vimeo.com/external/370331493.hd.mp4?s=38d504505c6d3bc85b13511b033d528b&profile_id=172" 
            type="video/mp4" 
          />
        </video>
      </div>

      <div className={styles.gridContainer}>
        
        {/* Label perfectly anchored to Column 1 */}
        <div className={styles.labelCol}>
          <span className={styles.metaLabel}>{t.label}</span>
        </div>

        <div className={styles.headingCol}>
          <h1 className={styles.heading} ref={headlineRef}>
            <span className={`js-hero-line ${styles.headingLine}`}>{t.heading1}</span>
            <span className={`js-hero-line ${styles.headingLine}`}>{t.heading2}</span>
          </h1>
        </div>

        {/* Subtitle mechanically indented at Column 6 to 10 */}
        <div className={styles.subtitleCol}>
          <p ref={subtitleRef} className={`${styles.subtitle} js-hero-subtitle`}>
            {t.subtitle}
          </p>
        </div>

      </div>
    </section>
  );
}
