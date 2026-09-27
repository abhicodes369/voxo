import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { pageVariants } from '../lib/motion'

/** Every route mounts inside this so enter/exit motion is identical app-wide. */
export function Screen({
  children,
  className = '',
  padded = true,
}: {
  children: ReactNode
  className?: string
  padded?: boolean
}) {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`no-scrollbar h-full w-full overflow-y-auto ${padded ? 'pb-24' : ''} ${className}`}
    >
      {children}
    </motion.main>
  )
}
