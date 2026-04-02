'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './ProjectModal.module.css';
import { gsap } from 'gsap';
import Portal from './Portal';

import { useScrollLock } from '@/store/settings';

interface Project {
  id: string;
  title: string;
  image: string;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

/**
 * ModalInner handles the actual DOM and Animation logic.
 * It is separated to ensure that when it mounts inside the Portal,
 * all its refs are immediately available for GSAP.
 */
function ModalInner({ project, onClose, setLocked }: { project: Project, onClose: () => void, setLocked: (l: boolean) => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  const [heroImage, setHeroImage] = useState(project.image);

  const tickerImages = [
    project.image,
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
  ];

  // Focal Sync Transition
  useEffect(() => {
    if (!heroImageRef.current) return;
    gsap.fromTo(heroImageRef.current, {
      opacity: 0,
      scale: 1.05
    }, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out'
    });
  }, [heroImage]);

  useEffect(() => {
    if (!tickerRef.current || !trackRef.current) return;
    
    const items = gsap.utils.toArray<HTMLElement>('.js-ticker-item');
    if (items.length === 0) return;

    const itemWidth = items[0].offsetWidth;
    const gap = 100; // Increased gap to prevent "flow hindrance" during scaling
    const totalWidth = (itemWidth + gap) * items.length;

    items.forEach((item, i) => {
      gsap.set(item, { x: i * (itemWidth + gap) });
    });

    let currentSpeed = 0.6; // Reduced speed for cinematic feel
    let isHovered = false;
    
    const onEnter = () => isHovered = true;
    const onLeave = () => isHovered = false;
    
    const tickerEl = tickerRef.current;
    tickerEl.addEventListener('mouseenter', onEnter);
    tickerEl.addEventListener('mouseleave', onLeave);

    const tick = () => {
      if (isHovered) return;

      items.forEach((item) => {
        const currentX = gsap.getProperty(item, "x") as number;
        let newX = currentX - currentSpeed;

        if (newX < -(itemWidth + gap)) {
          newX += totalWidth;
        }
        
        gsap.set(item, { x: newX });

        // Calculate focal scale based on distance from focal point (left: 0)
        const distanceToLeft = Math.abs(newX);
        const threshold = 300; // Wider threshold for smoother transition
        let scale = 1;
        
        if (distanceToLeft < threshold) {
          // Focal scaling 1.4x
          scale = 1 + (1 - distanceToLeft / threshold) * 0.4;
        }

        gsap.set(item, { 
          scale: scale,
          zIndex: scale > 1.1 ? 20 : 1,
          filter: scale > 1.1 ? 'grayscale(0%)' : 'grayscale(100%)'
        });

        // Sync Ticker Focal Image to Big Hero Image
        if (scale > 1.35) {
          setHeroImage(tickerImages[items.indexOf(item)]);
        }
      });
    };

    gsap.ticker.add(tick);
    
    return () => {
      gsap.ticker.remove(tick);
      tickerEl.removeEventListener('mouseenter', onEnter);
      tickerEl.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useEffect(() => {
    setLocked(true);
    document.body.style.overflow = 'hidden';
    
    const ctx = gsap.context(() => {
      // Safety: Ensure refs are available
      if (!modalRef.current || !contentRef.current || !curtainRef.current || !tickerRef.current) return;

      const tl = gsap.timeline();
      
      // Ensure initial states are locked in
      gsap.set(modalRef.current, { autoAlpha: 1 });
      gsap.set(contentRef.current, { opacity: 0, y: 100 });
      gsap.set(curtainRef.current, { scaleY: 0, transformOrigin: 'bottom' });

      tl.to(curtainRef.current, {
        scaleY: 1,
        duration: 0.6,
        ease: 'power4.inOut'
      })
      .to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power4.out',
        onStart: () => {
          if (!curtainRef.current) return;
          // Drop curtain back down as content appears
          gsap.to(curtainRef.current, {
            scaleY: 0,
            transformOrigin: 'top',
            duration: 1,
            ease: 'power4.inOut',
            delay: 0.2
          });
        }
      }, "-=0.2")
      .fromTo(tickerRef.current, {
        scale: 1.1,
        filter: 'grayscale(100%)',
        opacity: 0
      }, {
        scale: 1,
        filter: 'grayscale(0%)',
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out'
      }, "-=0.8");
    });

    return () => {
      document.body.style.overflow = '';
      setLocked(false);
      ctx.revert();
    };
  }, [setLocked, project]);

  const handleClose = () => {
    if (!modalRef.current || !contentRef.current || !curtainRef.current) {
      onClose();
      return;
    }

    const tl = gsap.timeline({ 
      onComplete: () => {
        setLocked(false);
        onClose();
      } 
    });
    
    tl.to(contentRef.current, { y: 50, opacity: 0, duration: 0.4 })
      .to(curtainRef.current, {
        scaleY: 1,
        transformOrigin: 'bottom',
        duration: 0.6,
        ease: 'power4.inOut'
      })
      .to(modalRef.current, { 
        autoAlpha: 0, 
        duration: 0.4
      });
  };

  return (
    <div className={styles.modalOverlay} ref={modalRef}>
      <div className={styles.curtain} ref={curtainRef} />
      
      <div className={styles.container} data-lenis-prevent>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close modal">
          <span className={styles.closeIcon}>×</span>
          <span className={styles.closeText}>CLOSE</span>
        </button>

        <div className={styles.content} ref={contentRef}>
          <div className={styles.header}>
            <span className={styles.projectId}>{project.id}</span>
            <h2 className={styles.title}>{project.title}</h2>
          </div>

          <div className={styles.grid}>
            <div className={styles.imageCol}>
              <div className={styles.imageWrapper} ref={heroImageRef}>
                <Image
                  src={heroImage}
                  alt={project.title}
                  fill
                  sizes="(max-width: 968px) 100vw, 60vw"
                  quality={90}
                  priority
                  className={styles.image}
                  key={heroImage} // Ensure Next.js re-renders correctly on swap
                />
              </div>
            </div>

            <div className={styles.infoCol}>
              <div className={styles.infoBlock}>
                <h3 className={styles.label}>Overview</h3>
                <p className={styles.text}>
                  A masterclass in architectural engineering and brutalist aesthetics. This project redefines 
                  spatial presence through raw materials and geometric precision.
                </p>
              </div>

              {/* Enhanced Interactive Ticker: Focal Zoom + Multi-Asset Scroll */}
              <div className={styles.projectTicker} aria-hidden="true" ref={tickerRef}>
                <div className={styles.tickerTrack} ref={trackRef}>
                  {[
                    project.image,
                    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
                    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
                    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80',
                    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
                    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
                  ].map((src, i) => (
                    <div key={i} className={`${styles.tickerImageWrapper} js-ticker-item`}>
                      <Image
                        src={src}
                        alt={`${project.title} detail`}
                        fill
                        sizes="400px"
                        className={styles.tickerImage}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.infoBlock}>
                <h3 className={styles.label}>Execution</h3>
                <p className={styles.text}>
                  Engineered with sustainable concrete and advanced structural dynamics to ensure longevity 
                  and environmental harmony.
                </p>
              </div>

              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Location</span>
                  <span className={styles.metaValue}>Southeast Asia</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Client</span>
                  <span className={styles.metaValue}>Confidential</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Year</span>
                  <span className={styles.metaValue}>2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { setLocked } = useScrollLock();

  if (!project) return null;

  return (
    <Portal>
      <ModalInner project={project} onClose={onClose} setLocked={setLocked} />
    </Portal>
  );
}
