'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CustomCursor.module.css';
import { gsap } from 'gsap';

type CursorState = 'default' | 'hover' | 'drag' | 'view' | 'link';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const touchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(touchDevice);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    const label = labelRef.current;
    if (!cursor || !follower || !label) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    // ─── Mouse position tracking with lerp ─────────────────────────────────
    // Instead of GSAP, we manually lerp in a RAF loop for precise control
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let followerX = mouseX;
    let followerY = mouseY;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      // Cursor: very fast (near-instant)
      cursorX = lerp(cursorX, mouseX, 0.85);
      cursorY = lerp(cursorY, mouseY, 0.85);
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

      // Follower: slower, creates the "trailing" effect
      followerX = lerp(followerX, mouseX, 0.1);
      followerY = lerp(followerY, mouseY, 0.1);
      follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;

      rafId = requestAnimationFrame(animate);
    };

    animate();

    // ─── Context-Aware Cursor States ─────────────────────────────────────
    const setState = (state: CursorState) => {
      follower.dataset.state = state;

      switch (state) {
        case 'hover':
          gsap.to(follower, { scale: 2.5, duration: 0.4, ease: 'power2.out' });
          gsap.to(cursor, { scale: 0, duration: 0.2 });
          label.textContent = '';
          break;
        case 'view':
          gsap.to(follower, { scale: 4, duration: 0.4, ease: 'power2.out' });
          gsap.to(cursor, { scale: 0, duration: 0.2 });
          label.textContent = 'VIEW';
          break;
        case 'drag':
          gsap.to(follower, { scale: 3.5, duration: 0.4, ease: 'power2.out' });
          gsap.to(cursor, { scale: 0, duration: 0.2 });
          label.textContent = 'DRAG';
          break;
        case 'link':
          gsap.to(follower, { scale: 2, duration: 0.4, ease: 'power2.out' });
          gsap.to(cursor, { scale: 0, duration: 0.2 });
          label.textContent = 'OPEN';
          break;
        default:
          gsap.to(follower, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
          gsap.to(cursor, { scale: 1, duration: 0.3 });
          label.textContent = '';
      }
    };

    // Register interactive elements with cursor data attributes
    const bindElement = (el: Element) => {
      const cursorType = (el as HTMLElement).dataset.cursor as CursorState | undefined;

      // Determine state from data attribute or element type
      const getState = (): CursorState => {
        if (cursorType) return cursorType;
        if (el.tagName === 'A') return 'link';
        if (el.tagName === 'BUTTON') return 'hover';
        return 'hover';
      };

      const enter = () => setState(getState());
      const leave = () => setState('default');
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
      return () => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      };
    };

    const interactiveEls = document.querySelectorAll(
      'a, button, [data-cursor]'
    );
    const cleanups = Array.from(interactiveEls).map(bindElement);

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
      cleanups.forEach((fn) => fn());
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      {/* The dot (innermost, fast) */}
      <div ref={cursorRef} className={styles.cursor} />

      {/* The ring (follower, slow, context-aware) */}
      <div ref={followerRef} className={styles.follower}>
        <span ref={labelRef} className={styles.label} />
      </div>
    </>
  );
}
