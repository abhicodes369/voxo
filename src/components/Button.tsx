import { motion } from 'framer-motion'
import type { ComponentProps, ReactNode } from 'react'
import { snappy } from '../lib/motion'

type Variant = 'primary' | 'ghost' | 'outline' | 'soft'

type Props = Omit<ComponentProps<typeof motion.button>, 'children'> & {
  variant?: Variant
  full?: boolean
  children: ReactNode
}

const base =
  'relative inline-flex items-center justify-center gap-2 rounded-2xl px-5 font-semibold ' +
  'select-none disabled:opacity-50 disabled:pointer-events-none overflow-hidden'

export function Button({ variant = 'primary', full, className = '', children, ...rest }: Props) {
  const look =
    variant === 'primary'
      ? 'brand-grad text-white h-13 text-[15px] shadow-[0_12px_30px_-10px_var(--color-brand-500)]'
      : variant === 'outline'
        ? 'h-13 text-[15px] border text-[color:var(--ink)]'
        : variant === 'soft'
          ? 'h-11 text-sm bg-[color:var(--bg-sunk)] text-[color:var(--ink)]'
          : 'h-11 text-sm text-[color:var(--ink-2)]'

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={variant === 'primary' ? { scale: 1.015 } : undefined}
      transition={snappy}
      className={`${base} ${look} ${full ? 'w-full' : ''} ${className}`}
      style={variant === 'outline' ? { borderColor: 'var(--line)', height: 52 } : variant === 'primary' ? { height: 52 } : undefined}
      {...rest}
    >
      {variant === 'primary' && (
        // A slow specular sweep so the primary CTA never reads as flat.
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(100deg, transparent 25%, rgba(255,255,255,0.35) 50%, transparent 75%)' }}
          initial={{ x: '-120%' }}
          animate={{ x: '120%' }}
          transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 2.4, ease: 'easeInOut' }}
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  )
}

/** Circular icon button used across top bars and media overlays. */
export function IconButton({
  className = '',
  children,
  ...rest
}: ComponentProps<typeof motion.button>) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      transition={snappy}
      className={`grid h-10 w-10 place-items-center rounded-full text-[color:var(--ink)] ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
