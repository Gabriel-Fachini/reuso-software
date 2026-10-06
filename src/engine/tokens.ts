/**
 * Reads a design token (CSS custom property) at runtime, for the few places
 * that need a concrete value: GSAP color tweens and the token demo.
 */
export function cssVar(name: `--${string}`): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
