'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useScrollLock, scrollLockStore } from '@/store/settings';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ─── Listen for scroll lock changes ──────────────────────────────────
    const unsubscribe = scrollLockStore.subscribe(() => {
      if (lenisRef.current) {
        if (scrollLockStore.getSnapshot()) {
          lenisRef.current.stop();
        } else {
          lenisRef.current.start();
        }
      }
    });

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      ScrollTrigger.normalizeScroll(false);
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    // ─── Velocity-Based Skew (Awwwards signature effect) ───────────────────
    // Track scroll velocity and apply skewY to the page wrapper.
    // This makes the entire page feel "elastic" — content leans forward when
    // scrolling fast, then springs back when stopping.
    let currentSkew = 0;
    let lastScrollY = 0;
    let velocity = 0;
    const maxSkew = 4; // degrees — a subtle but noticeable lean
    const skewLerpFactor = 0.08; // how fast skew catches up to velocity

    const skewScrollContent = (scrollY: number) => {
      velocity = scrollY - lastScrollY;
      lastScrollY = scrollY;
    };

    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      skewScrollContent(scroll);
    });

    const tick = (time: number) => {
      lenis.raf(time * 1000);

      // Lerp toward target skew
      const targetSkew = gsap.utils.clamp(-maxSkew, maxSkew, velocity * 0.04);
      currentSkew += (targetSkew - currentSkew) * skewLerpFactor;

      if (wrapperRef.current && Math.abs(currentSkew) > 0.001) {
        // Apply on the wrapper — CSS: transform-style:flat + backface-visibility:hidden
        // prevents subpixel rendering artifacts on children
        wrapperRef.current.style.transform = `skewY(${currentSkew.toFixed(3)}deg)`;
      } else if (wrapperRef.current) {
        wrapperRef.current.style.transform = '';
      }
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      unsubscribe();
      lenis.destroy();
      gsap.ticker.remove(tick);
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = '';
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        // Critical: backface-visibility prevents "shimmering" text during skew
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
