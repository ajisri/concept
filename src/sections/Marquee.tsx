'use client';

import { useEffect, useRef } from 'react';
import styles from './Marquee.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORDS = [
  'PRECISION',
  'CONCRETE',
  'VISION',
  'ARCHITECTURE',
  'LEGACY',
  'STRUCTURE',
  'INNOVATION',
  'CRAFT',
];

export default function Marquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // First track moves left on scroll
      gsap.to(track1Ref.current, {
        xPercent: -30,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

      // Second track moves right on scroll
      gsap.to(track2Ref.current, {
        xPercent: 10,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const renderWords = () =>
    [...WORDS, ...WORDS, ...WORDS].map((word, i) => (
      <span key={i} className={styles.word}>
        {word}
        <span className={styles.dot}>●</span>
      </span>
    ));

  return (
    <section ref={containerRef} className={styles.marquee}>
      <div ref={track1Ref} className={styles.track}>
        {renderWords()}
      </div>
      <div ref={track2Ref} className={`${styles.track} ${styles.trackReverse}`}>
        {renderWords()}
      </div>
    </section>
  );
}
