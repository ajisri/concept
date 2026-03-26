'use client';

import { useEffect, useRef } from 'react';
import styles from './Footer.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <a href="#" className={styles.logo}>
              <span className={styles.logoAccent}>K</span>ONSTRÜKSI
            </a>
            <p className={styles.tagline}>
              Building tomorrow&apos;s landmarks with precision, passion, and purpose.
            </p>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Navigation</h4>
            <a href="#hero" className={styles.link}>Home</a>
            <a href="#about" className={styles.link}>About</a>
            <a href="#projects" className={styles.link}>Projects</a>
            <a href="#services" className={styles.link}>Services</a>
            <a href="#contact" className={styles.link}>Contact</a>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Services</h4>
            <a href="#services" className={styles.link}>Construction</a>
            <a href="#services" className={styles.link}>Renovation</a>
            <a href="#services" className={styles.link}>Architecture</a>
            <a href="#services" className={styles.link}>Interior Design</a>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Connect</h4>
            <a href="#" className={styles.link}>Instagram</a>
            <a href="#" className={styles.link}>LinkedIn</a>
            <a href="#" className={styles.link}>Twitter</a>
            <a href="mailto:hello@konstruksi.com" className={styles.link}>
              hello@konstruksi.com
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            &copy; {new Date().getFullYear()} Konstrüksi. All rights reserved.
          </p>
          <p className={styles.credit}>
            Designed & Engineered with precision
          </p>
        </div>
      </div>
    </footer>
  );
}
