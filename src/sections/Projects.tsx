'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './Projects.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: '01',
    title: 'VILLA NO. 14',
    // Minimalist modern villa — white concrete
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop',
    style: { top: '5%', left: '-5%', width: '22vw', height: '35vh' },
    scrollSpeed: 0.15,
    mouseSpeed: { x: 0.05, y: 0.03 },
  },
  {
    id: '02',
    title: 'THE MONOLITH HQ',
    // Dramatic glass skyscraper looking up
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    style: { top: '15%', left: '35%', width: '15vw', height: '20vh' },
    scrollSpeed: 2.5,
    mouseSpeed: { x: -0.07, y: -0.05 },
  },
  {
    id: '03',
    title: 'SILICA RESIDENCES',
    // Concrete brutalist apartment blocks
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    style: { top: '45%', left: '10%', width: '18vw', height: '40vh' },
    scrollSpeed: 0.4,
    mouseSpeed: { x: 0.1, y: 0.06 },
  },
  {
    id: '04',
    title: 'VERTEX HALL',
    // Sharp glass curtain wall facade
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=800&auto=format&fit=crop',
    style: { top: '55%', left: '42%', width: '20vw', height: '30vh' },
    scrollSpeed: 3.2,
    mouseSpeed: { x: -0.04, y: -0.08 },
  },
  {
    id: '05',
    title: 'ECLIPSE TOWER',
    // Iconic tower against golden sky
    image: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?q=80&w=800&auto=format&fit=crop',
    style: { top: '25%', right: '5%', width: '25vw', height: '45vh' },
    scrollSpeed: -0.2,
    mouseSpeed: { x: 0.06, y: 0.04 },
  },
  {
    id: '06',
    title: 'OAK PAVILION',
    // Modern angular concrete cultural center
    image: 'https://images.unsplash.com/photo-1559827291-72ebf3e64bf4?q=80&w=600&auto=format&fit=crop',
    style: { top: '80%', left: '20%', width: '14vw', height: '20vh' },
    scrollSpeed: 4.5,
    mouseSpeed: { x: -0.06, y: -0.04 },
  },
  {
    id: '07',
    title: 'GLASS HOUSE',
    // Modern steel + glass bridge architecture
    image: 'https://images.unsplash.com/photo-1467226632440-65f0b4957563?q=80&w=600&auto=format&fit=crop',
    style: { top: '0%', right: '15%', width: '15vw', height: '15vh' },
    scrollSpeed: 0.7,
    mouseSpeed: { x: 0.03, y: 0.05 },
  },
  {
    id: '08',
    title: 'LUMINA MUSEUM',
    // Dramatic museum exterior — exposed concrete
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop',
    style: { top: '70%', right: '25%', width: '18vw', height: '25vh' },
    scrollSpeed: 1.8,
    mouseSpeed: { x: 0.08, y: -0.03 },
  },
  {
    id: '09',
    title: 'APEX WING',
    // Abstract geometric facade detail
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop',
    style: { top: '40%', right: '-8%', width: '12vw', height: '35vh' },
    scrollSpeed: 0.3,
    mouseSpeed: { x: -0.09, y: 0.05 },
  },
  {
    id: '10',
    title: 'NOVA BRIDGE',
    // City skyline with illuminated towers
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=600&auto=format&fit=crop',
    style: { top: '85%', right: '5%', width: '22vw', height: '30vh' },
    scrollSpeed: 3.8,
    mouseSpeed: { x: 0.04, y: 0.07 },
  },
  {
    id: '11',
    title: 'THE CORE',
    // Looking up at soaring glass tower
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop',
    style: { top: '75%', left: '5%', width: '26vw', height: '40vh' },
    scrollSpeed: 1.1,
    mouseSpeed: { x: -0.05, y: -0.06 },
  },
  {
    id: '12',
    title: 'SOLARIS HABITAT',
    // Architecture geometric pattern — angular shadow play
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=600&auto=format&fit=crop',
    style: { top: '80%', right: '35%', width: '16vw', height: '22vh' },
    scrollSpeed: 1.5,
    mouseSpeed: { x: 0.07, y: -0.04 },
  },
] as const;


type Project = (typeof PROJECTS)[number];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  // Store scroll speeds alongside refs — no DOM round-trip needed
  const itemRefs = useRef<{ el: HTMLDivElement; project: Project }[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        // 1. Scroll Parallax — read speed from closure, not DOM attribute
        itemRefs.current.forEach(({ el, project }) => {
          gsap.to(el, {
            y: () => -window.innerHeight * project.scrollSpeed,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        });

        // 2. Mouse move floating — now with BOTH X and Y axes
        const handleMouseMove = (e: MouseEvent) => {
          const { innerWidth, innerHeight } = window;
          const xPos = e.clientX / innerWidth - 0.5;
          const yPos = e.clientY / innerHeight - 0.5;

          itemRefs.current.forEach(({ el, project }) => {
            gsap.to(el, {
              x: xPos * innerWidth * project.mouseSpeed.x,
              y: `+=${yPos * innerHeight * project.mouseSpeed.y}`,
              duration: 1.5,
              ease: 'power3.out',
              overwrite: 'auto', // prevents stacking from scroll + mouse tweens
            });
          });
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Return cleanup inside the context
        return () => window.removeEventListener('mousemove', handleMouseMove);
      }
    }, sectionRef);

    // 3. Pin center block — single ScrollTrigger, properly scoped
    let pinST: ScrollTrigger | null = null;
    if (centerTextRef.current && containerRef.current && !prefersReducedMotion) {
      pinST = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: centerTextRef.current,
        pinSpacing: false,
      });
    }

    return () => {
      ctx.revert();
      pinST?.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.projects} id="projects">
      <div ref={containerRef} className={styles.container}>

        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.metaLabel}>03 — PORTFOLIO</span>
          <h2 className={styles.sectionTitle}>OUR WORK</h2>
        </div>

        <div className={styles.centerWrapper}>
          <div ref={centerTextRef} className={styles.centerBlock}>
            <p className={styles.heading}>
              All Work <sup className={styles.sup}>(27)</sup>
            </p>
          </div>
        </div>

        {/* Floating Abstract Collage Grid */}
        <div className={styles.collage}>
          {PROJECTS.map((proj, i) => (
            <div
              key={proj.id}
              ref={(el) => {
                if (el) itemRefs.current[i] = { el, project: proj };
              }}
              className={styles.polaroid}
              style={proj.style as React.CSSProperties}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={proj.image}
                  alt={proj.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  loading="lazy"
                  quality={75}
                />
              </div>
              <div className={styles.hoverOverlay} aria-hidden="true">
                <div className={styles.hoverSlot}>
                  <span className={styles.hoverText}>{proj.title}</span>
                  <span className={styles.hoverSubtitle}>View Details —</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Discover Pill */}
        <div className={styles.floatingPill}>
          <div className={styles.pillContent}>
            <span className={styles.pillLabel}>Explore Archive</span>
            <span className={styles.pillAction}>Discover</span>
          </div>
        </div>

      </div>
    </section>
  );
}
