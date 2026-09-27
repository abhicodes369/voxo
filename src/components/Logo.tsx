import { motion } from 'framer-motion'

/**
 * The VOXO mark: an open ring with an orbiting dot. `animated` draws the ring
 * stroke on first paint — used by the splash screen.
 */
export function Logo({ size = 64, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="VOXO">
      <defs>
        <linearGradient id="voxo-ring" x1="8" y1="14" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-brand-500)" />
          <stop offset="0.55" stopColor="var(--color-brand-400)" />
          <stop offset="1" stopColor="var(--color-ember-500)" />
        </linearGradient>
      </defs>
      <motion.circle
        cx="29"
        cy="35"
        r="19"
        stroke="url(#voxo-ring)"
        strokeWidth="7"
        strokeLinecap="round"
        pathLength={1}
        initial={animated ? { pathLength: 0, rotate: -90 } : false}
        animate={animated ? { pathLength: 1, rotate: 0 } : undefined}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: '29px', originY: '35px' }}
      />
      <motion.circle
        cx="50"
        cy="15"
        r="7"
        fill="var(--color-brand-500)"
        initial={animated ? { scale: 0, opacity: 0 } : false}
        animate={animated ? { scale: 1, opacity: 1 } : undefined}
        transition={{ type: 'spring', stiffness: 460, damping: 18, delay: 0.75 }}
        style={{ originX: '50px', originY: '15px' }}
      />
    </svg>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`brand-text font-extrabold tracking-[0.22em] ${className}`}>VOXO</span>
  )
}
