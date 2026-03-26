'use client';

import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const onMouseEnterInteractive = () => {
      gsap.to(cursor, { scale: 0, duration: 0.3 });
      gsap.to(follower, {
        scale: 3,
        duration: 0.4,
        ease: 'power2.out',
      });
      follower.classList.add(styles.active);
    };

    const onMouseLeaveInteractive = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      gsap.to(follower, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
      follower.classList.remove(styles.active);
    };

    window.addEventListener('mousemove', onMouseMove);

    const interactiveElements = document.querySelectorAll(
      'a, button, [data-cursor-hover]'
    );
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterInteractive);
      el.addEventListener('mouseleave', onMouseLeaveInteractive);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };
  }, []);

  // Only show custom cursor on non-touch devices
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  if (typeof window !== 'undefined' && isTouchDevice) return null;

  return (
    <>
      <div ref={cursorRef} className={styles.cursor} />
      <div ref={followerRef} className={styles.follower} />
    </>
  );
}
