import type { Transition, Variants } from 'framer-motion'

/** One spring vocabulary, reused everywhere, so the whole app moves alike. */
export const spring: Transition = { type: 'spring', stiffness: 420, damping: 34, mass: 0.9 }
export const softSpring: Transition = { type: 'spring', stiffness: 260, damping: 30 }
export const snappy: Transition = { type: 'spring', stiffness: 700, damping: 30 }
export const glide: Transition = { duration: 0.55, ease: [0.16, 1, 0.3, 1] }

/** Page-level enter/exit used by the router's AnimatePresence. */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 14, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { ...glide, staggerChildren: 0.045, delayChildren: 0.05 } },
  exit: { opacity: 0, y: -10, scale: 0.99, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } },
}

/** Children of a page stagger in behind it. */
export const riseVariants: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: softSpring },
  exit: { opacity: 0, y: -8 },
}

export const listVariants: Variants = {
  animate: { transition: { staggerChildren: 0.05 } },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: spring },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
}

export const tap = { scale: 0.95 }
export const press = { whileTap: tap, transition: snappy }
