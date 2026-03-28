'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Navbar.module.css';
import { gsap } from 'gsap';
import { NAVBAR_ENTRANCE_DELAY } from '@/lib/animation-constants';

const NAV_LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const navRef = useRef<HTMLElement>(null);

  // Entrance animation — after preloader
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          delay: NAVBAR_ENTRANCE_DELAY,
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // Menu open/close animation
  useEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 0.8,
        ease: 'power4.inOut',
      });
      gsap.fromTo(
        linksRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.08,
          delay: 0.3,
        }
      );
      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(menuRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 0.6,
        ease: 'power4.inOut',
      });
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <header ref={navRef} className={styles.navbar}>
      <div className={styles.inner}>
        <a href="#" className={styles.logo} aria-label="Konstrüksi — Home">
          <span className={styles.logoAccent}>K</span>ONSTRÜKSI
        </a>

        <button
          className={`${styles.burger} ${isOpen ? styles.burgerOpen : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="fullscreen-menu"
          id="menu-toggle"
        >
          <span className={styles.burgerLine} aria-hidden="true" />
          <span className={styles.burgerLine} aria-hidden="true" />
        </button>
      </div>

      <div
        ref={menuRef}
        className={styles.menu}
        id="fullscreen-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <nav className={styles.menuNav} aria-label="Main navigation">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              ref={(el) => {
                if (el) linksRef.current[i] = el;
              }}
              className={styles.menuLink}
              onClick={() => setIsOpen(false)}
            >
              <span className={styles.menuLinkIndex} aria-hidden="true">
                0{i + 1}
              </span>
              <span className={styles.menuLinkText}>{link.label}</span>
            </a>
          ))}
        </nav>
        <div className={styles.menuFooter}>
          <p className={styles.menuFooterText}>Building Tomorrow&apos;s Landmarks</p>
          <div className={styles.menuSocials}>
            <a href="#" aria-label="Konstrüksi on Instagram">Instagram</a>
            <a href="#" aria-label="Konstrüksi on LinkedIn">LinkedIn</a>
            <a href="#" aria-label="Konstrüksi on Twitter">Twitter</a>
          </div>
        </div>
      </div>
    </header>
  );
}
