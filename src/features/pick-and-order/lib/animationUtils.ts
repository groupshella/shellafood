/**
 * Animation helpers for Pick & Order landing sections
 */

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});
