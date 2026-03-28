'use client';

import { useEffect, useRef } from 'react';
import styles from './Preloader.module.css';
import { gsap } from 'gsap';
import { PRELOADER_DURATION } from '@/lib/animation-constants';

// Preloader visual duration breakdown:
// 2.5s counter + 0.3s delay + 1.0s slide exit = 3.8s total (PRELOADER_DURATION)

export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Respect reduced motion
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        // Hide instantly, no animation
        gsap.set(preloaderRef.current, { display: 'none' });
        document.body.style.overflow = '';
        return;
      }

      document.body.style.overflow = 'hidden';

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
        },
      });

      // Counter animation
      const counter = { value: 0 };
      tl.to(counter, {
        value: 100,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = Math.round(counter.value) + '%';
          }
        },
      });

      // Reveal brand name
      tl.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=1.5'
      );

      // Counter fade out
      tl.to(counterRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.5');

      // Exit: slide up
      tl.to(
        preloaderRef.current,
        {
          yPercent: -100,
          duration: 1,
          ease: 'power4.inOut',
          delay: 0.3,
        },
        // Total before this: 2.5 + 0.3 = 2.8s → + 1.0s exit = 3.8s = PRELOADER_DURATION
      );
    });

    return () => ctx.revert();
  }, []);

  // Keep in DOM during animation (CSS takes care of display after exit)
  return (
    <div ref={preloaderRef} className={styles.preloader} aria-hidden="true">
      <div className={styles.content}>
        <div ref={titleRef} className={styles.brand}>
          KONSTRÜKSI
        </div>
        <span ref={counterRef} className={styles.counter}>
          0%
        </span>
      </div>
      <div className={styles.bar}>
        <div className={styles.barInner} />
      </div>
    </div>
  );
}
