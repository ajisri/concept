'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Navbar.module.css';
import { gsap } from 'gsap';

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 3.5 }
      );
    });
    return () => ctx.revert();
  }, []);

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
        <a href="#" className={styles.logo}>
          <span className={styles.logoAccent}>K</span>ONSTRÜKSI
        </a>

        <button
          className={`${styles.burger} ${isOpen ? styles.burgerOpen : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          id="menu-toggle"
        >
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </button>
      </div>

      <div ref={menuRef} className={styles.menu}>
        <nav className={styles.menuNav}>
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
              <span className={styles.menuLinkIndex}>0{i + 1}</span>
              <span className={styles.menuLinkText}>{link.label}</span>
            </a>
          ))}
        </nav>
        <div className={styles.menuFooter}>
          <p className={styles.menuFooterText}>Building Tomorrow&apos;s Landmarks</p>
          <div className={styles.menuSocials}>
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="LinkedIn">LI</a>
            <a href="#" aria-label="Twitter">TW</a>
          </div>
        </div>
      </div>
    </header>
  );
}
