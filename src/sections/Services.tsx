'use client';

import { useEffect, useRef } from 'react';
import styles from './Services.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    num: '01',
    title: 'STRUCTURAL ENGINEERING',
    desc: 'End-to-end project delivery from foundation to finishing. Commercial, residential, and industrial builds executed with surgical precision.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
  },
  {
    num: '02',
    title: 'ARCHITECTURAL PRESERVATION',
    desc: 'Breathing new life into existing structures. We preserve character while modernizing every functional detail.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80',
  },
  {
    num: '03',
    title: 'URBAN MASTERPLANNING',
    desc: 'Designs that balance form and function. Our architects blend aesthetic vision with engineering reality to create landmark structures.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
  },
  {
    num: '04',
    title: 'INTERIOR SPATIAL DESIGN',
    desc: 'Spaces that inspire. From material selection to lighting design, every element is curated to serve the human experience.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.js-service-panel');
      const container = containerRef.current!;

      // Olivier Larose Horizontal Scroll technique
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          snap: {
            snapTo: 1 / (panels.length - 1),
            duration: { min: 0.2, max: 0.8 },
            delay: 0.1,
            ease: "power2.inOut"
          },
          end: () => '+=' + container.offsetWidth,
        },
      });

      // Subtle parallax on internal images
      panels.forEach((panel: any) => {
        const img = panel.querySelector('img');
        if (img) {
          gsap.to(img, {
            xPercent: 15,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => '+=' + container.offsetWidth,
              scrub: true,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.services} id="services">
      <div className={styles.stickyWrapper}>
        <div ref={containerRef} className={styles.sliderContainer}>
          
          {/* Title Panel */}
          <div className={`${styles.panel} ${styles.introPanel} js-service-panel`}>
            <div className={styles.introContent}>
              <span className={styles.metaLabel}>04 — EXPERTISE</span>
              <h2 className={styles.heading}>
                EXPERTISE THAT <br />
                <span className={styles.headingAccent}>SHAPES SKYLINES.</span>
              </h2>
            </div>
            
            <div className={styles.swipeIndicator}>
              <div className={styles.swipeLine}></div>
              <span className={styles.swipeText}>SWIPE TO EXPLORE →</span>
            </div>
          </div>

          {/* Service Panels */}
          {SERVICES.map((service) => (
            <div key={service.num} className={`${styles.panel} js-service-panel`}>
              <div className={styles.panelInner}>
                
                {/* Image taking up massive vertical space */}
                <div className={styles.imageWrapper}>
                  <img src={service.image} alt={service.title} loading="lazy" />
                  <div className={styles.imageOverlay} />
                </div>

                {/* Content block overlapping or aligning to grid */}
                <div className={styles.textContent}>
                  <span className={styles.itemNum}>{service.num}</span>
                  <h3 className={styles.itemTitle}>{service.title}</h3>
                  <p className={styles.itemDesc}>{service.desc}</p>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
