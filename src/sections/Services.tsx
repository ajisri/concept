'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './Services.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/store/settings';
import { dict } from '@/lib/dictionary';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    num: '01',
    title: 'SPATIAL STORYTELLING',
    desc: 'We map the human journey. Our architecture transforms empty spaces into immersive narratives that emotionally connect people with environments.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
  },
  {
    num: '02',
    title: 'UNIVERSAL INCLUSIVITY',
    desc: 'Inclusive design is a non-negotiable standard. We engineer structures that offer seamless, barrier-free access for everyone without compromising aesthetic rigor.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80',
  },
  {
    num: '03',
    title: 'DESIGN AS CATALYST',
    desc: 'We see physical spaces as a strategic force for growth. From commercial complexes to public squares, our masterplans are optimized for maximum ROI and cultural impact.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
  },
  {
    num: '04',
    title: 'COGNITIVE CLARITY',
    desc: 'Less is profoundly more. By eliminating visual noise and applying instinctive wayfinding patterns, we reduce memory load so the architecture speaks for itself.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
  },
] as const;

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { lang } = useLanguage();
  const t = dict[lang as 'en' | 'id']?.services || dict.en.services;

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // Typed as Element[]
      const panels = gsap.utils.toArray<Element>('.js-service-panel');
      const container = containerRef.current!;

      // Exclusively run horizontal scroll pinning on Desktop (min-width: 769px)
      const mm = gsap.matchMedia();

      mm.add('(min-width: 769px)', () => {
        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            pinType: 'transform',
            scrub: 1,
            snap: {
              snapTo: 1 / (panels.length - 1),
              duration: { min: 0.2, max: 0.8 },
              delay: 0.1,
              ease: 'power2.inOut',
            },
            end: () => '+=' + container.offsetWidth,
          },
        });

        // Subtle parallax on internal images
        panels.forEach((panel) => {
          const img = (panel as HTMLElement).querySelector('img');
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
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.services} id="expertise">
      <div className={styles.stickyWrapper}>
        <div ref={containerRef} className={styles.sliderContainer}>

          {/* Title Panel */}
          <div className={`${styles.panel} ${styles.introPanel} js-service-panel`}>
            <div className={styles.introContent}>
              <span className={styles.metaLabel}>{t.label}</span>
              <h2 className={styles.heading}>
                {t.heading1} <br />
                <span className={styles.headingAccent}>{t.heading2}</span>
              </h2>
            </div>
            <div className={styles.swipeIndicator} aria-hidden="true">
              <div className={styles.swipeLine}></div>
              <span className={styles.swipeText}>{t.swipe}</span>
            </div>
          </div>

          {/* Service Panels */}
          {SERVICES.map((service, i) => {
            const svc = t.items[i];
            return (
              <div key={service.num} className={`${styles.panel} js-service-panel`}>
                <div className={styles.panelInner}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={service.image}
                      alt={`${svc.title} — Konstrüksi service`}
                      fill
                      sizes="100vw"
                      quality={85}
                      priority={(i === 0 || i === 3)}
                      loading={(i === 0 || i === 3) ? 'eager' : 'lazy'}
                      className={styles.serviceImage}
                    />
                    <div className={styles.imageOverlay} aria-hidden="true" />
                  </div>
                  <div className={styles.textContent}>
                    <span className={styles.itemNum}>{svc.num}</span>
                    <h3 className={styles.itemTitle}>{svc.title}</h3>
                    <p className={styles.itemDesc}>{svc.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
