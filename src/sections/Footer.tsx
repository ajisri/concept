'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Footer.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  // Scroll to top — replaces href="#" which triggers Chrome bounce tracking warnings
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Measure footer height dynamically for the sticky reveal effect
  useEffect(() => {
    const updateHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };
    
    // Initial measurement
    updateHeight();
    
    // Re-measure on resize after slight delay to ensure fonts loaded
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div 
      className={styles.footerWrapper}
      style={{ 
        height: `${footerHeight}px`,
        clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)"
      }}
    >
      <div 
        className={styles.stickyParent} 
        style={{ height: `calc(100vh + ${footerHeight}px)` }}
      >
        <footer 
          className={styles.footer} 
          style={{ top: `calc(100vh - ${footerHeight}px)` }}
        >
          <div ref={footerRef} className={styles.container}>
            <div className={styles.grid}>
            <div className={styles.brandCol}>
              <div>
                <a href="/" className={styles.logo} aria-label="Konstrüksi Home" onClick={handleLogoClick}>
                  KONSTRÜKSI
                </a>
                <p className={styles.tagline}>
                  Engineering permanence.<br />
                  The intersection of brutalist power and microscopic precision.
                </p>
              </div>
              <p className={styles.address}>
                Jl. Sudirman No.1, Jakarta 10220<br />
                Coordinates: 6.2088° S, 106.8456° E
              </p>
            </div>

            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>Main</h4>
              <div className={styles.linkItem}><a href="#hero" className={styles.link}>Home</a></div>
              <div className={styles.linkItem}><a href="#about" className={styles.link}>About</a></div>
              <div className={styles.linkItem}><a href="#projects" className={styles.link}>Projects</a></div>
              <div className={styles.linkItem}><a href="#services" className={styles.link}>Services</a></div>
              <div className={styles.linkItem}><a href="#contact" className={styles.link}>Contact</a></div>
            </div>

            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>Services</h4>
              <div className={styles.linkItem}><a href="#services" className={styles.link}>Construction</a></div>
              <div className={styles.linkItem}><a href="#services" className={styles.link}>Engineering</a></div>
              <div className={styles.linkItem}><a href="#services" className={styles.link}>Architecture</a></div>
              <div className={styles.linkItem}><a href="#services" className={styles.link}>Preservation</a></div>
            </div>

            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>Social</h4>
              <div className={styles.linkItem}><a href="https://instagram.com/konstruksi" target="_blank" rel="noopener noreferrer" className={styles.link}>Instagram</a></div>
              <div className={styles.linkItem}><a href="https://linkedin.com/company/konstruksi" target="_blank" rel="noopener noreferrer" className={styles.link}>LinkedIn</a></div>
              <div className={styles.linkItem}><a href="https://twitter.com/konstruksi" target="_blank" rel="noopener noreferrer" className={styles.link}>Twitter</a></div>
              <div className={styles.linkItem}><a href="mailto:hello@konstruksi.com" className={styles.link}>Email</a></div>
            </div>
          </div>

          <div className={styles.bottom}>
            <p className={styles.copy}>
              &copy; {new Date().getFullYear()} Konstrüksi. All rights reserved.
            </p>
            <div className={styles.localTime}>
              <span className={styles.blinker}></span>
              <span className={styles.time}>JKT • 08:32 AM</span>
            </div>
          </div>
        </div>
        </footer>
      </div>
    </div>
  );
}
