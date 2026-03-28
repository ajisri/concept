'use client';

import { useEffect, useRef } from 'react';
import styles from './Footer.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Giant brand name — use Array.from() to correctly handle Unicode (Ü)
const BRAND_CHARS = Array.from('KONSTRÜKSI');

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(footerRef.current, { opacity: 1 });
        return;
      }

      // Footer reveal — slides up from below border
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        }
      );

      // Giant brand chars — stagger reveal from bottom on scroll
      gsap.fromTo(
        '.js-footer-char',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.035,
          scrollTrigger: {
            trigger: brandRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // ─── Link Hover: text slides up replaces itself ────────────────────────────
  // Technique: two vertically stacked copies, hover reveals bottom copy
  const HoverLink = ({
    href,
    children,
    className,
  }: {
    href: string;
    children: string;
    className?: string;
  }) => (
    <a href={href} className={`${styles.link} ${className ?? ''}`} data-text={children}>
      <span className={styles.linkInner}>
        {/* Original text */}
        <span className={styles.linkDefault}>{children}</span>
        {/* Hover text — slides up from below */}
        <span className={styles.linkHover} aria-hidden="true">{children}</span>
      </span>
    </a>
  );

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.container}>

        {/* Giant brand name — the Awwwards footer signature */}
        <div className={styles.brandStrip}>
          <a
            ref={brandRef}
            href="#"
            className={styles.bigBrand}
            aria-label="Konstrüksi — Back to top"
          >
            {BRAND_CHARS.map((char, i) => (
              <span key={i} className={styles.brandCharWrapper}>
                <span className={`${styles.brandChar} js-footer-char`}>
                  {char}
                </span>
              </span>
            ))}
          </a>
        </div>

        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <p className={styles.tagline}>
              Building tomorrow&apos;s landmarks with<br />
              precision, passion, and purpose.
            </p>
            <p className={styles.address}>
              Jl. Sudirman No.1, Jakarta 10220<br />
              Indonesia
            </p>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Navigate</h4>
            <HoverLink href="#hero">Home</HoverLink>
            <HoverLink href="#about">About</HoverLink>
            <HoverLink href="#projects">Projects</HoverLink>
            <HoverLink href="#services">Services</HoverLink>
            <HoverLink href="#contact">Contact</HoverLink>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Services</h4>
            <HoverLink href="#services">Construction</HoverLink>
            <HoverLink href="#services">Renovation</HoverLink>
            <HoverLink href="#services">Architecture</HoverLink>
            <HoverLink href="#services">Interior Design</HoverLink>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Connect</h4>
            <HoverLink href="#">Instagram</HoverLink>
            <HoverLink href="#">LinkedIn</HoverLink>
            <HoverLink href="#">Twitter</HoverLink>
            <HoverLink href="mailto:hello@konstruksi.com">
              hello@konstruksi.com
            </HoverLink>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            &copy; {new Date().getFullYear()} Konstrüksi. All rights reserved.
          </p>
          <p className={styles.credit}>
            Designed &amp; Engineered with precision
          </p>
        </div>
      </div>
    </footer>
  );
}
