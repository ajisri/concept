'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Preloader.module.css';
import { gsap } from 'gsap';

export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsComplete(true);
          document.body.style.overflow = '';
        },
      });

      document.body.style.overflow = 'hidden';

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

      // Exit: slide up
      tl.to(preloaderRef.current, {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut',
        delay: 0.3,
      });
    });

    return () => ctx.revert();
  }, []);

  if (isComplete) return null;

  return (
    <div ref={preloaderRef} className={styles.preloader}>
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
