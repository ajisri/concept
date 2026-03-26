'use client';

import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const headingText = 'BUILDING LEGACY';

  useEffect(() => {
    // Scope precisely to sectionRef so we don't grab stale hot-reload DOM elements
    const ctx = gsap.context(() => {
      // Initial entrance timeline (after preloader)
      const tl = gsap.timeline({ delay: 3.2 });

      // Characters stagger in
      tl.fromTo(
        '.js-hero-char',
        { y: 120, opacity: 0, rotateX: 90 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.04,
        }
      );

      tl.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      );

      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      );

      // Heading parallax out
      const chars = gsap.utils.toArray('.js-hero-char');
      gsap.fromTo(chars, 
        { yPercent: 0, opacity: 1 },
        {
          yPercent: -100,
          opacity: 0,
          stagger: 0.02,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero} id="hero">
      <div className={styles.gridContainer}>
        <div className={styles.leftCol}>
          <div className={styles.metaLabel}>01 — INTRO</div>
          <div className={styles.scrollIndicator} ref={scrollIndicatorRef}>
            <div className={styles.scrollLine} />
            <span className={styles.scrollText}>SCROLL</span>
          </div>
        </div>

        <div className={styles.rightCol}>
          <h1 className={styles.heading}>
            <div className={styles.headingLine}>
              {'BUILDING'.split('').map((char, i) => (
                <span
                  key={`b-${i}`}
                  className={`${styles.char} js-hero-char`}
                  style={char === ' ' ? { width: '0.2em' } : {}}
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
                  style={char === ' ' ? { width: '0.2em' } : {}}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </h1>

          <p ref={subtitleRef} className={styles.subtitle}>
            Where vision meets precision — crafting structures that define skylines and stand the test of time. Engineering excellence driven by data and geometry.
          </p>
        </div>
      </div>
    </section>
  );
}
