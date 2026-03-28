/**
 * RevealText — Awwwards-level text mask reveal component.
 *
 * Wraps each line in `overflow: hidden` and animates translateY from 110% → 0%,
 * creating the signature "text slides up through a slot" effect seen on creative agency sites.
 *
 * Usage:
 *   <RevealText as="h2" delay={0.2}>Your Heading Text</RevealText>
 *   <RevealText lines={["Line One", "Line Two"]} stagger={0.12} />
 */

'use client';

import { useEffect, useRef, ElementType, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './RevealText.module.css';

gsap.registerPlugin(ScrollTrigger);

interface RevealTextProps {
  children?: ReactNode;
  /** Pre-split array of text lines. If provided, each item becomes one masked line. */
  lines?: string[];
  as?: ElementType;
  className?: string;
  /** Delay before animation starts (seconds), useful for entrance sequencing */
  delay?: number;
  /** Stagger between lines (seconds) */
  stagger?: number;
  /** Duration of each line animation (seconds) */
  duration?: number;
  /** Trigger start position (GSAP ScrollTrigger start value) */
  start?: string;
  /** If true, animates immediately without ScrollTrigger (for hero entrance) */
  instant?: boolean;
  /** Additional delay if instant=true */
  instantDelay?: number;
}

export default function RevealText({
  children,
  lines,
  as: Tag = 'div',
  className,
  delay = 0,
  stagger = 0.1,
  duration = 0.9,
  start = 'top 85%',
  instant = false,
  instantDelay = 0,
}: RevealTextProps) {
  const wrapperRef = useRef<HTMLElement>(null);
  const innerRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Use gsap.context for React StrictMode compatibility (cleans up ScrollTriggers properly)
    const ctx = gsap.context(() => {
      const targets = innerRefs.current.filter(Boolean);

      // Force initial state instantly to avoid FOUC before ScrollTrigger fires
      gsap.set(targets, { yPercent: 110 });

      if (prefersReducedMotion) {
        gsap.set(targets, { yPercent: 0 });
        return;
      }

      if (instant) {
        gsap.to(targets, {
          yPercent: 0,
          duration,
          ease: 'power4.out',
          stagger,
          delay: instantDelay,
        });
      } else {
        gsap.to(targets, {
          yPercent: 0,
          duration,
          ease: 'power4.out',
          stagger,
          delay,
          scrollTrigger: {
            trigger: wrapperRef.current,
            start,
            once: true,
          },
        });
      }
    }, wrapperRef);

    return () => ctx.revert(); // Essential cleanup for ScrollTrigger in React
  }, [delay, duration, instant, instantDelay, stagger, start]);

  // Lines mode: render each string as a masked line
  if (lines) {
    return (
      <Tag ref={wrapperRef} className={className}>
        {lines.map((line, i) => (
          <span key={i} className={styles.lineWrapper} aria-hidden={i > 0 ? undefined : undefined}>
            <span
              ref={(el) => {
                if (el) innerRefs.current[i] = el;
              }}
              className={styles.lineInner}
            >
              {line}
            </span>
          </span>
        ))}
      </Tag>
    );
  }

  // Children mode: single line wrapper
  return (
    <Tag ref={wrapperRef} className={className}>
      <span className={styles.lineWrapper}>
        <span
          ref={(el) => {
            if (el) innerRefs.current[0] = el;
          }}
          className={styles.lineInner}
        >
          {children}
        </span>
      </span>
    </Tag>
  );
}
