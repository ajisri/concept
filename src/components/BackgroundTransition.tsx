'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TRANSITIONS = [
  { trigger: '#journey', color: '#ffffff' },
  { trigger: '#vision', color: '#fdfaf6' }, // Soft warm for calm reflection
  { trigger: '#projects', color: '#ffffff' }, // Pure white for high-contrast projects
  { trigger: '#gallery', color: '#fefcf9' }, // Nearly white but warm for continuity
  { trigger: '#expertise', color: '#f5f0e8' }, // Linen for technical expertise
  { trigger: '#clients', color: '#faf5f0' }, // Sand for approachable human elements
  { trigger: '#contact', color: '#ffffff' }, // Return to white for final impact
];

export default function BackgroundTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      TRANSITIONS.forEach((t) => {
        const el = document.querySelector(t.trigger);
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => {
            gsap.to('body', {
              backgroundColor: t.color,
              duration: 1.2,
              ease: 'power2.inOut',
            });
          },
          onEnterBack: () => {
            gsap.to('body', {
              backgroundColor: t.color,
              duration: 1.2,
              ease: 'power2.inOut',
            });
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
