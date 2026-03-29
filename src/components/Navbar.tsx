'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Navbar.module.css';
import { gsap } from 'gsap';
import { NAVBAR_ENTRANCE_DELAY } from '@/lib/animation-constants';
import { useLanguage, useTheme } from '@/store/settings';
import { dict } from '@/lib/dictionary';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const linksRef = useRef<HTMLDivElement[]>([]);
  const navRef = useRef<HTMLElement>(null);
  const { lang, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const t = dict[lang as 'en' | 'id']?.nav || dict.en.nav;
  
  const NAV_LINKS = [
    { label: t.journey, href: '#journey' },
    { label: t.vision, href: '#vision' },
    { label: t.portfolio, href: '#projects' },
    { label: t.expertise, href: '#expertise' },
    { label: t.clients, href: '#clients' },
    { label: t.startProject, href: '#contact' },
  ];

  // Resize listener for exact window height used by SVG Curve
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Menu open/close SVG & Translation animation
  useEffect(() => {
    if (!windowHeight) return;

    // Custom tight ease mimicking Framer Motion [0.76, 0, 0.24, 1]
    const laroseEase = 'power4.inOut';

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Circular expanding reveal background
      gsap.fromTo(menuRef.current, 
        { 
          clipPath: 'circle(0% at calc(100% - 45px) 45px)',
          autoAlpha: 0, // handles visibility and opacity
        },
        {
          clipPath: 'circle(150% at calc(100% - 45px) 45px)',
          autoAlpha: 1,
          duration: 1,
          ease: laroseEase,
        }
      );

      // Horizontal Slide-in Link Reveal (Olivier Larose style)
      gsap.fromTo(
        linksRef.current,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: laroseEase,
          stagger: 0.05,
          delay: 0.1, // Wait just a bit before sliding text in
        }
      );
    } else {
      document.body.style.overflow = '';
      
      // Close by shrinking circle back to burger menu bounds
      gsap.to(menuRef.current, {
        clipPath: 'circle(0% at calc(100% - 45px) 45px)',
        autoAlpha: 0,
        duration: 0.8,
        ease: laroseEase,
      });
    }
  }, [isOpen, windowHeight]);

  // Handle manual navigation jump (Essential for mobile deep links/smoothscroll)
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    // Slight delay to allow menu closing animation to start
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        // If smooth scroll or normal scroll, we jump to target
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400);
  };

  return (
    <header ref={navRef} className={styles.navbar}>
      <div className={styles.inner}>
        <a href="#" className={styles.logo} aria-label="Konstrüksi — Home">
          <span className={styles.logoAccent}>K</span>ONSTRÜKSI
        </a>

        <div className={styles.toggles}>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={styles.toggleBtn}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? 'LGT' : 'DRK'}
          </button>
          
          <button 
            onClick={() => setLanguage(lang === 'en' ? 'id' : 'en')}
            className={styles.toggleBtn}
            aria-label="Change Language"
          >
            {lang === 'en' ? 'ID' : 'EN'}
          </button>
        </div>

        <button
          className={`${styles.burger} ${isOpen ? styles.burgerOpen : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="fullscreen-menu"
          id="menu-toggle"
        >
          {isOpen ? (
            <span className={styles.closeText}>CLOSE</span>
          ) : (
            <>
              <span className={styles.burgerLine} aria-hidden="true" />
              <span className={styles.burgerLine} aria-hidden="true" />
            </>
          )}
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
        {/* SVG Curve Removed — Replaced by pure CSS Clip-Path expanding circle */}

        <nav className={styles.menuNav} aria-label="Main navigation">
          {NAV_LINKS.map((link, i) => (
            <div 
              key={link.label} 
              className={styles.menuLinkWrapper}
              ref={(el) => {
                if (el) linksRef.current[i] = el;
              }}
            >
              <a
                href={link.href}
                className={styles.menuLink}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                <span className={styles.menuLinkIndex} aria-hidden="true">
                  0{i + 1}
                </span>
                <span className={styles.menuLinkText}>{link.label}</span>
              </a>

              {/* Inject the stats after 'Expertise' */}
              {link.label === t.expertise && (
                <div className={styles.menuStats}>
                  {t.stats.map((stat, idx) => (
                    <div key={idx} className={styles.menuStat}>
                      <span className={styles.statNum}>{stat.num}</span>
                      <span className={styles.statDesc}>{stat.desc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className={styles.menuFooter}>
          <p className={styles.menuFooterText}>{t.footer}</p>
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
