'use client';

import { useEffect, useRef } from 'react';
import styles from './Projects.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Abstract Parallax & Mouse-Floating Images (Olivier Larose style)
const PROJECTS = [
  {
    id: '01',
    title: 'VILLA NO. 14',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    style: { top: '5%', left: '-5%', width: '22vw', height: '35vh' },
    scrollSpeed: 0.15,
    mouseSpeed: 0.05,
  },
  {
    id: '02',
    title: 'THE MONOLITH HQ',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    style: { top: '15%', left: '35%', width: '15vw', height: '20vh' },
    scrollSpeed: 2.5,
    mouseSpeed: -0.07,
  },
  {
    id: '03',
    title: 'SILICA RESIDENCES',
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop',
    style: { top: '45%', left: '10%', width: '18vw', height: '40vh' },
    scrollSpeed: 0.4,
    mouseSpeed: 0.1,
  },
  {
    id: '04',
    title: 'VERTEX HALL',
    image: 'https://images.unsplash.com/photo-1541888052441-267995166f7f?q=80&w=800&auto=format&fit=crop',
    style: { top: '55%', left: '42%', width: '20vw', height: '30vh' },
    scrollSpeed: 3.2,
    mouseSpeed: -0.04,
  },
  {
    id: '05',
    title: 'ECLIPSE TOWER',
    image: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?q=80&w=800&auto=format&fit=crop',
    style: { top: '25%', right: '5%', width: '25vw', height: '45vh' },
    scrollSpeed: -0.2, // This one moves down slightly!
    mouseSpeed: 0.06,
  },
  {
    id: '06',
    title: 'OAK PAVILION',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=600&auto=format&fit=crop',
    style: { top: '80%', left: '20%', width: '14vw', height: '20vh' },
    scrollSpeed: 4.5, // Extreme speed
    mouseSpeed: -0.06,
  },
  {
    id: '07',
    title: 'GLASS HOUSE',
    image: 'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?q=80&w=600&auto=format&fit=crop',
    style: { top: '0%', right: '15%', width: '15vw', height: '15vh' },
    scrollSpeed: 0.7,
    mouseSpeed: 0.03,
  },
  {
    id: '08',
    title: 'LUMINA MUSEUM',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop',
    style: { top: '70%', right: '25%', width: '18vw', height: '25vh' },
    scrollSpeed: 1.8,
    mouseSpeed: 0.08,
  },
  {
    id: '09',
    title: 'APEX WING',
    image: 'https://images.unsplash.com/photo-1481253127861-534498168948?q=80&w=600&auto=format&fit=crop',
    style: { top: '40%', right: '-8%', width: '12vw', height: '35vh' },
    scrollSpeed: 0.3,
    mouseSpeed: -0.09,
  },
  {
    id: '10',
    title: 'NOVA BRIDGE',
    image: 'https://images.unsplash.com/photo-1545622783-b3eecbfafbc5?q=80&w=600&auto=format&fit=crop',
    style: { top: '85%', right: '5%', width: '22vw', height: '30vh' },
    scrollSpeed: 3.8,
    mouseSpeed: 0.04,
  },
  {
    id: '11',
    title: 'THE CORE',
    image: 'https://images.unsplash.com/photo-1428366890462-dd4baecf492b?q=80&w=600&auto=format&fit=crop',
    style: { top: '75%', left: '5%', width: '26vw', height: '40vh' },
    scrollSpeed: 1.1,
    mouseSpeed: -0.05,
  },
  {
    id: '12',
    title: 'SOLARIS HABITAT',
    image: 'https://images.unsplash.com/photo-1506501139174-099022df5260?q=80&w=600&auto=format&fit=crop',
    style: { top: '80%', right: '35%', width: '16vw', height: '22vh' },
    scrollSpeed: 1.5,
    mouseSpeed: 0.07,
  }
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Scroll Parallax for each image
      itemsRef.current.forEach((item) => {
        if (!item) return;
        const speed = parseFloat(item.getAttribute('data-speed') || '1');
        
        gsap.to(item, {
          y: () => -window.innerHeight * speed, // Use dynamic window height to ensure it moves dramatically
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // 2. Mouse move floating (Olivier Larose floating style)
      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        // Normalize mouse coordinates from -0.5 to 0.5
        const xPos = (e.clientX / innerWidth) - 0.5;
        const yPos = (e.clientY / innerHeight) - 0.5;

        itemsRef.current.forEach((item) => {
          if (!item) return;
          const mSpeed = parseFloat(item.getAttribute('data-mouse-speed') || '0.05');
          
          gsap.to(item, {
            x: xPos * innerWidth * mSpeed,
            duration: 1.5, // Silky smooth trailing
            ease: "power3.out"
          });
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      // 3. Pin the Center Block so it's absolutely static while images fly past
      const centerBlock = document.querySelector('.js-center-block');
      if (centerBlock) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top', // at exact moment Container touches viewport Top
          end: 'bottom bottom', // stay pinned until the bottom of the container passes
          pin: centerBlock,
          pinSpacing: false, // Don't add spacing, just pin it visually
        });
      }

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, sectionRef);

    // 3. Pin the Center Block reliably outside the main context to avoid scope conflicts
    if (centerTextRef.current && containerRef.current) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: centerTextRef.current,
        pinSpacing: false, // This guarantees zero CSS layout disruption
      });
    }

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => {
        if (t.pin === centerTextRef.current) t.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.projects} id="projects">
      <div ref={containerRef} className={styles.container}>
        
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.metaLabel}>03 — PORTFOLIO</span>
          <h3 className={styles.sectionTitle}>OUR WORK</h3>
        </div>

        <div className={styles.centerWrapper}>
          <div ref={centerTextRef} className={styles.centerBlock}>
            <h2 className={styles.heading}>
              All Work <sup className={styles.sup}>(27)</sup>
            </h2>
          </div>
        </div>

        {/* Floating Abstract Collage Grid */}
        <div ref={galleryRef} className={styles.collage}>
          {PROJECTS.map((proj, i) => (
            <div
              key={proj.id}
              ref={(el) => {
                if (el) itemsRef.current[i] = el;
              }}
              className={styles.polaroid}
              style={proj.style}
              data-speed={proj.scrollSpeed}
              data-mouse-speed={proj.mouseSpeed}
            >
              <div className={styles.imageWrapper}>
                <img src={proj.image} alt={proj.title} loading="lazy" />
              </div>
              <div className={styles.hoverOverlay}>
                <span>{proj.title}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Discover Pill */}
        <div className={styles.floatingPill}>
          <div className={styles.pillContent}>
            <span className={styles.pillLabel}>All Work</span>
            <span className={styles.pillAction}>Discover +</span>
          </div>
        </div>

      </div>
    </section>
  );
}
