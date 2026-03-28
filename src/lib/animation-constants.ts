/**
 * Shared animation timing constants.
 * Single source of truth — change here, all components stay in sync.
 */

/** Total duration of the preloader animation in seconds */
export const PRELOADER_DURATION = 3.8;

/** Delay for hero entrance (after preloader completes) */
export const HERO_ENTRANCE_DELAY = PRELOADER_DURATION - 0.6;

/** Delay for navbar entrance */
export const NAVBAR_ENTRANCE_DELAY = PRELOADER_DURATION - 0.3;

/** Standard GSAP easing curves */
export const EASE = {
  out: 'power3.out',
  in: 'power3.in',
  inOut: 'power4.inOut',
  expo: 'expo.out',
} as const;
