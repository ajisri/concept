'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './About.module.css';
import RevealText from '@/components/RevealText';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { number: '25+', label: 'Years Experience' },
  { number: '340', label: 'Projects Delivered' },
  { number: '98%', label: 'Client Satisfaction' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // Image clip-path reveal
      gsap.fromTo(
        imageRef.current,
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
        {
          clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
          duration: 1.2,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      // Parallax on the inner image wrapper
      gsap.to(imageInnerRef.current, {
        yPercent: -15,
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Body text fade in
      gsap.fromTo(
        textRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: textRef.current, start: 'top 85%' },
        }
      );

      // Stats reveal stagger
      statsRef.current.forEach((stat) => {
        gsap.fromTo(
          stat,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: stat, start: 'top 85%' },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.about} id="vision">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.metaCol}>
            <span className={styles.metaLabel}>02 — THE VISION</span>
          </div>

          <div className={styles.textCol}>
            <RevealText
              as="h2"
              lines={['MORE THAN STRUCTURE.', 'WE ENGINEER EMOTION.']}
              className={styles.heading}
              stagger={0.1}
              duration={1}
              start="top 80%"
            />

            <p
              className={styles.text}
              ref={textRef}
            >
              We do not merely construct buildings; we establish enduring landmarks.
              Our methodology merges brutalist raw power with microscopic precision.
              We believe architecture should not only be seen, but subconsciously felt—a bridge
              between spatial presence and human experience.
            </p>

            <div className={styles.stats}>
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  ref={(el) => {
                    if (el) statsRef.current[i] = el;
                  }}
                  className={styles.stat}
                >
                  <span className={styles.statNumber}>{stat.number}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full-bleed architectural image with parallax */}
        <div className={styles.imageWrapper} ref={imageRef} data-cursor="view">
          <div ref={imageInnerRef} className={styles.imageInner}>
            <Image
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=85"
              alt="Architectural blueprint and concrete structure — geometric precision"
              fill
              sizes="100vw"
              quality={85}
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
