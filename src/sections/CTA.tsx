'use client';

import { useEffect, useRef } from 'react';
import styles from './CTA.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RevealText from '@/components/RevealText';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null); // liquid fill background
  const arrowRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // Kinetic project counter animation
      const counter = { value: 0 };
      gsap.to(counter, {
        value: 340,
        duration: 2,
        ease: 'power2.out',
        snap: { value: 1 },
        scrollTrigger: { trigger: counterRef.current, start: 'top 80%', once: true },
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = counter.value.toString();
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // ─── Full Magnetic Button + Liquid Fill ─────────────────────────────────────
  useEffect(() => {
    const btn = btnRef.current;
    const fill = fillRef.current;
    const arrow = arrowRef.current;
    if (!btn || !fill || !arrow) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    // Magnetic activation radius (px)
    const RADIUS = 120;
    let isHovered = false;

    const handleMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        const strength = 1 - dist / RADIUS;
        // Magnetic pull — stronger when closer
        gsap.to(btn, {
          x: dx * strength * 0.4,
          y: dy * strength * 0.4,
          duration: 0.4,
          ease: 'power2.out',
        });

        // Inner content moves opposite (parallax depth illusion)
        gsap.to(arrow, {
          x: dx * strength * 0.2,
          y: dy * strength * 0.2,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    };

    const handleEnter = () => {
      isHovered = true;
      // Liquid fill from bottom: scaleY 0→1 from a bottom transform-origin
      gsap.to(fill, {
        scaleY: 1,
        duration: 0.5,
        ease: 'power4.out',
      });
      // Arrow pops right
      gsap.to(arrow, {
        x: 8,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      isHovered = false;
      // Magnetic spring back
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
      });
      // Fill retracts from top this time (direction feels right)
      gsap.to(fill, {
        scaleY: 0,
        duration: 0.4,
        ease: 'power4.in',
      });
      gsap.to(arrow, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
      });
    };

    window.addEventListener('mousemove', handleMove);
    btn.addEventListener('mouseenter', handleEnter);
    btn.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      btn.removeEventListener('mouseenter', handleEnter);
      btn.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.cta} id="contact">
      <div className={styles.container}>

        <div className={styles.topRow}>
          <span className={styles.metaLabel}>06 — START A PROJECT</span>

          {/* RevealText mask reveal for the CTA heading */}
          <RevealText
            as="h2"
            lines={["LET'S BUILD", 'SOMETHING', 'EXTRAORDINARY.']}
            className={styles.heading}
            stagger={0.12}
            duration={1}
            start="top 80%"
          />
        </div>

        {/* Kinetic counter strip */}
        <div className={styles.statsStrip}>
          <div className={styles.stat}>
            <div ref={counterRef} className={styles.statNum}>0</div>
            <span className={styles.statLabel}>Projects Delivered</span>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>25+</div>
            <span className={styles.statLabel}>Years Experience</span>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>98%</div>
            <span className={styles.statLabel}>Client Satisfaction</span>
          </div>
        </div>

        {/* Full-width magnetic liquid-fill button */}
        <a
          href="mailto:contact@konstruksi.com"
          className={styles.btn}
          ref={btnRef}
          data-cursor="hover"
          aria-label="Send us an email to start a project"
        >
          {/* Liquid fill background */}
          <span ref={fillRef} className={styles.btnFill} aria-hidden="true" />

          <div className={styles.btnInner}>
            <span className={styles.btnText}>GET IN TOUCH</span>
            <span ref={arrowRef} className={styles.btnArrow} aria-hidden="true">
              →
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
