'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './Projects.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectModal from '@/components/ProjectModal';
import { useLanguage } from '@/store/settings';
import { dict } from '@/lib/dictionary';

import { useScrollLock, scrollLockStore } from '@/store/settings';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: '01',
    title: 'VILLA NO. 14',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop',
    style: { top: '5%', left: '-5%', width: '22vw', height: '35vh' },
    scrollSpeed: 0.15,
    mouseSpeed: { x: 0.05, y: 0.03 },
  },
  {
    id: '02',
    title: 'THE MONOLITH HQ',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    style: { top: '15%', left: '35%', width: '15vw', height: '20vh' },
    scrollSpeed: 2.5,
    mouseSpeed: { x: -0.07, y: -0.05 },
  },
  {
    id: '03',
    title: 'SILICA RESIDENCES',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    style: { top: '45%', left: '10%', width: '18vw', height: '40vh' },
    scrollSpeed: 0.4,
    mouseSpeed: { x: 0.1, y: 0.06 },
  },
  {
    id: '04',
    title: 'VERTEX HALL',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=800&auto=format&fit=crop',
    style: { top: '55%', left: '42%', width: '20vw', height: '30vh' },
    scrollSpeed: 3.2,
    mouseSpeed: { x: -0.04, y: -0.08 },
  },
  {
    id: '05',
    title: 'ECLIPSE TOWER',
    image: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?q=80&w=800&auto=format&fit=crop',
    style: { top: '25%', right: '5%', width: '25vw', height: '45vh' },
    scrollSpeed: -0.2,
    mouseSpeed: { x: 0.06, y: 0.04 },
  },
  {
    id: '06',
    title: 'OAK PAVILION',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop',
    style: { top: '80%', left: '20%', width: '14vw', height: '20vh' },
    scrollSpeed: 4.5,
    mouseSpeed: { x: -0.06, y: -0.04 },
  },
  {
    id: '07',
    title: 'GLASS HOUSE',
    image: 'https://images.unsplash.com/photo-1467226632440-65f0b4957563?q=80&w=600&auto=format&fit=crop',
    style: { top: '0%', right: '15%', width: '15vw', height: '15vh' },
    scrollSpeed: 0.7,
    mouseSpeed: { x: 0.03, y: 0.05 },
  },
  {
    id: '08',
    title: 'LUMINA MUSEUM',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop',
    style: { top: '70%', right: '25%', width: '18vw', height: '25vh' },
    scrollSpeed: 1.8,
    mouseSpeed: { x: 0.08, y: -0.03 },
  },
  {
    id: '09',
    title: 'APEX WING',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop',
    style: { top: '40%', right: '-8%', width: '12vw', height: '35vh' },
    scrollSpeed: 0.3,
    mouseSpeed: { x: -0.09, y: 0.05 },
  },
  {
    id: '10',
    title: 'NOVA BRIDGE',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=600&auto=format&fit=crop',
    style: { top: '85%', right: '5%', width: '22vw', height: '30vh' },
    scrollSpeed: 3.8,
    mouseSpeed: { x: 0.04, y: 0.07 },
  },
  {
    id: '11',
    title: 'THE CORE',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop',
    style: { top: '75%', left: '5%', width: '26vw', height: '40vh' },
    scrollSpeed: 1.1,
    mouseSpeed: { x: -0.05, y: -0.06 },
  },
  {
    id: '12',
    title: 'SOLARIS HABITAT',
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { lang } = useLanguage();
  const t = dict[lang as 'en' | 'id']?.projects || dict.en.projects;

  const { isLocked } = useScrollLock();

  // itemRefs now stores two refs per item to separate scroll and mouse logic
  interface ItemRef {
    outer: HTMLDivElement | null;
    inner: HTMLDivElement | null;
    project: Project;
  }
  const itemRefs = useRef<ItemRef[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        // 1. Scroll Parallax (Targeting OUTER container)
        itemRefs.current.forEach(({ outer, project }) => {
          if (!outer) return;
          gsap.to(outer, {
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

        // 2. Mouse move floating (Targeting INNER container to avoid fighting scroll Y)
        const handleMouseMove = (e: MouseEvent) => {
          if (scrollLockStore.getSnapshot()) return;
          
          const { innerWidth, innerHeight } = window;
          const xPos = e.clientX / innerWidth - 0.5;
          const yPos = e.clientY / innerHeight - 0.5;

          itemRefs.current.forEach(({ inner, project }) => {
            if (!inner) return;
            gsap.to(inner, {
              x: xPos * innerWidth * project.mouseSpeed.x,
              y: yPos * innerHeight * project.mouseSpeed.y,
              duration: 1.5,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
      }
    }, sectionRef);

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
        <div className={styles.sectionHeader}>
          <span className={styles.metaLabel}>03 — PORTFOLIO</span>
          <h2 className={styles.sectionTitle}>OUR WORK</h2>
        </div>

        <div className={styles.centerWrapper}>
          <div ref={centerTextRef} className={styles.centerBlock}>
            <p className={styles.heading}>
              All Work <sup className={styles.sup}>(27)</sup>
            </p>
            <div className={styles.mobileHint} aria-hidden="true">
              <span>{t.drag}</span>
              <div className={styles.hintLine} />
            </div>
          </div>
        </div>

        <div className={styles.collage}>
          {PROJECTS.map((proj, i) => (
            <div
              key={proj.id}
              ref={(el) => {
                if (!itemRefs.current[i]) itemRefs.current[i] = { outer: null, inner: null, project: proj };
                itemRefs.current[i].outer = el;
              }}
              className={styles.polaroid}
              style={proj.style as React.CSSProperties}
              onClick={() => {
                console.log('Project Clicked:', proj.title);
                setSelectedProject(proj);
              }}
              data-cursor="view"
            >
              <div 
                ref={(el) => {
                  if (itemRefs.current[i]) itemRefs.current[i].inner = el;
                }}
                className={styles.itemInner}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={proj.image}
                    alt={proj.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    priority={i < 6}
                    loading={i < 6 ? 'eager' : 'lazy'}
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
            </div>
          ))}
        </div>

        <div className={styles.floatingPill}>
          <div className={styles.pillContent}>
            <span className={styles.pillLabel}>Explore Archive</span>
            <span className={styles.pillAction}>Discover</span>
          </div>
        </div>
      </div>

      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
}
