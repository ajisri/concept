'use client';

import { useEffect, useRef } from 'react';
import styles from './About.module.css';
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
  const imageInnerRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textLinesRef = useRef<HTMLParagraphElement[]>([]);
  const statsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      // Parallax on the inner image
      gsap.to(imageInnerRef.current, {
        yPercent: -15,
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Heading slide in
      gsap.fromTo(
        headingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
        }
      );

      // Text lines stagger
      textLinesRef.current.forEach((line, i) => {
        gsap.fromTo(
          line,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: { trigger: line, start: 'top 85%' },
          }
        );
      });

      // Stats counter animation
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
    <section ref={sectionRef} className={styles.about} id="about">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.metaCol}>
            <span className={styles.metaLabel}>02 — THE VISION</span>
          </div>
          
          <div className={styles.textCol}>
            <h2 className={styles.heading} ref={headingRef}>
              WE DON'T JUST BUILD <br />
              <span className={styles.headingAccent}>WE ENGINEER REALITY.</span>
            </h2>

            <p className={styles.text} ref={(el) => { if (el) textLinesRef.current[0] = el; }}>
              Our methodology is rooted in absolute precision and uncompromising structural integrity. From brutalist concrete forms to soaring geometric glass facades, we redefine the modern skyline with a dedication to timeless endurance. 
            </p>

            <div className={styles.stats}>
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  ref={(el) => { if (el) statsRef.current[i] = el; }}
                  className={styles.stat}
                >
                  <span className={styles.statNumber}>{stat.number}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.imageWrapper} ref={imageRef}>
          <img
            ref={imageInnerRef}
            src="https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Abstract architecture geometric lines"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
