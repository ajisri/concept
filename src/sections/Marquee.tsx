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
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const track1 = track1Ref.current;
    const track2 = track2Ref.current;
    if (!track1 || !track2) return;

    // ─── Infinite auto-scroll using GSAP ticker (not CSS animation) ──────────
    // This lets us modify speed dynamically based on scroll velocity
    let baseSpeed = 0.5; // px per frame at 60fps
    let currentSpeed = baseSpeed;
    let pos1 = 0;
    let pos2 = 0;
    let lastScrollY = 0;
    let scrollVelocity = 0;
    let direction = 1; // 1 = forward, -1 = reverse

    // Calculate the total width of one set of words for seamless looping
    const getWidth = (el: HTMLDivElement) => el.scrollWidth / 3;

    const tick = () => {
      // Lerp speed toward (baseSpeed + velocity boost)
      const targetSpeed = baseSpeed + Math.abs(scrollVelocity) * 0.15;
      currentSpeed = gsap.utils.interpolate(currentSpeed, targetSpeed, 0.08);

      pos1 -= currentSpeed * direction;
      pos2 += currentSpeed * direction;

      // Seamless loop: when we've scrolled one complete set, snap back
      const w1 = getWidth(track1);
      const w2 = getWidth(track2);

      if (Math.abs(pos1) >= w1) pos1 = 0;
      if (pos2 >= w2) pos2 = 0;
      if (pos2 <= -w2) pos2 = 0;

      track1.style.transform = `translateX(${pos1}px)`;
      track2.style.transform = `translateX(${pos2}px)`;
    };

    // Track scroll velocity via ScrollTrigger
    ScrollTrigger.create({
      onUpdate: (self) => {
        scrollVelocity = self.getVelocity() / 50;
        // Reverse direction when scrolling up
        direction = self.direction;
      },
    });

    gsap.ticker.add(tick);

    // Skew marquee words on high velocity
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const skew = gsap.utils.clamp(-8, 8, self.getVelocity() / 300);
        gsap.to(`.${styles.word}`, {
          skewX: skew,
          ease: 'power3.out',
          duration: 0.4,
          overwrite: 'auto',
        });
      },
    });

    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  const renderWords = () =>
    [...WORDS, ...WORDS, ...WORDS].map((word, i) => (
      <span key={i} className={styles.word} data-cursor="drag">
        {word}
        <span className={styles.dot} aria-hidden="true">●</span>
      </span>
    ));

  return (
    <section ref={containerRef} className={styles.marquee} aria-label="Keywords">
      <div ref={track1Ref} className={styles.track} aria-hidden="true">
        {renderWords()}
      </div>
      <div ref={track2Ref} className={`${styles.track} ${styles.trackReverse}`} aria-hidden="true">
        {renderWords()}
      </div>
    </section>
  );
}
