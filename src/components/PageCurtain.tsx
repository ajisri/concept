/**
 * PageCurtain — Section-to-section transition overlay.
 *
 * Renders a full-screen panel that swipes down to hide the page,
 * then swipes up to reveal the new section. Triggered by navigation links.
 *
 * Since this is a SPA, "page transition" is re-imagined as:
 * - Anchor link click → curtain sweeps DOWN (covers viewport)
 * - After 0.5s, browser scrolls to target section
 * - Curtain sweeps UP (reveals new section)
 *
 * This creates the illusion of a page transition within a single page.
 */

'use client';

import { useEffect, useRef } from 'react';
import styles from './PageCurtain.module.css';
import { gsap } from 'gsap';

export default function PageCurtain() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const curtain = curtainRef.current;
    const label = labelRef.current;
    if (!curtain || !label) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    // Listen for all same-page anchor clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const hash = anchor.getAttribute('href');
      if (!hash) return;

      const destination = document.querySelector(hash);
      if (!destination) return;

      // Prevent default scroll
      e.preventDefault();

      // Update label text
      const sectionName = hash.replace('#', '').toUpperCase();
      label.textContent = sectionName;

      // Curtain sweep DOWN
      gsap.timeline()
        .set(curtain, { yPercent: -100, display: 'flex' })
        .to(curtain, {
          yPercent: 0,
          duration: 0.65,
          ease: 'power4.inOut',
          onComplete: () => {
            // Scroll instantly after curtain covers viewport
            destination.scrollIntoView({ block: 'start' });
          },
        })
        // Curtain sweep UP after brief pause
        .to(curtain, {
          yPercent: 100,
          duration: 0.65,
          ease: 'power4.inOut',
          delay: 0.3,
          onComplete: () => {
            gsap.set(curtain, { display: 'none', yPercent: -100 });
          },
        });
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div ref={curtainRef} className={styles.curtain} aria-hidden="true">
      <span ref={labelRef} className={styles.label} />
    </div>
  );
}
