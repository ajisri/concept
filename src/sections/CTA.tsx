'use client';

import { useEffect, useRef } from 'react';
import styles from './CTA.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const btnInnerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
        }
      );

      gsap.fromTo(
        btnRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: btnRef.current, start: 'top 90%' },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Magnetic button effect
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const handleMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power2.out',
      });
      if (btnInnerRef.current) {
        gsap.to(btnInnerRef.current, {
          x: x * 0.15,
          y: y * 0.15,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    };

    const handleLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
      });
      if (btnInnerRef.current) {
        gsap.to(btnInnerRef.current, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.3)',
        });
      }
    };

    btn.addEventListener('mousemove', handleMove);
    btn.addEventListener('mouseleave', handleLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMove);
      btn.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.cta} id="contact">
      <div className={styles.container}>
        <div className={styles.topRow}>
          <span className={styles.metaLabel}>START A PROJECT</span>
          <h2 className={styles.heading} ref={headingRef}>
            LET'S BUILD <br />
            <span className={styles.headingAccent}>SOMETHING EXTRAORDINARY.</span>
          </h2>
        </div>

        <a href="mailto:contact@konstruksi.local" className={styles.btn} ref={btnRef}>
          <div className={styles.btnInner}>
            <span className={styles.btnText}>GET IN TOUCH</span>
            <span className={styles.btnArrow}>→</span>
          </div>
        </a>
      </div>
    </section>
  );
}
