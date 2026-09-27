import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconName } from './Icon'
import { riseVariants, snappy } from '../lib/motion'

/** One settings/menu line. Shared by Menu, Settings and Account. */
export function Row({
  icon,
  label,
  hint,
  value,
  onClick,
  danger,
  right,
}: {
  icon?: IconName
  label: string
  hint?: string
  value?: string
  onClick?: () => void
  danger?: boolean
  right?: ReactNode
}) {
  return (
    <motion.button
      variants={riseVariants}
      onClick={onClick}
      whileTap={{ scale: 0.99, backgroundColor: 'var(--bg-sunk)' }}
      transition={snappy}
      className="flex w-full items-center gap-4 rounded-2xl px-3 py-3.5 text-left"
    >
      {icon && (
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
          style={{
            background: danger ? 'color-mix(in oklab, var(--color-brand-500) 12%, transparent)' : 'var(--bg-sunk)',
            color: danger ? 'var(--color-brand-500)' : 'var(--ink-2)',
          }}
        >
          <Icon name={icon} size={18} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14.5px] font-semibold" style={{ color: danger ? 'var(--color-brand-500)' : 'var(--ink)' }}>
          {label}
        </span>
        {hint && (
          <span className="block truncate text-[12px]" style={{ color: 'var(--ink-3)' }}>
            {hint}
          </span>
        )}
      </span>
      {value && (
        <span className="shrink-0 text-[13px]" style={{ color: 'var(--ink-3)' }}>
          {value}
        </span>
      )}
      {right ?? (!danger && <Icon name="chevron" size={16} style={{ color: 'var(--ink-3)' }} />)}
    </motion.button>
  )
}

/** iOS-style switch with a spring knob. */
export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={(e) => {
        e.stopPropagation()
        onChange(!on)
      }}
      className="relative h-7 w-12 shrink-0 rounded-full transition-colors"
      style={{ background: on ? 'var(--color-brand-500)' : 'var(--line)' }}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 34 }}
        className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
        style={{ left: on ? 26 : 4 }}
      />
    </button>
  )
}

export function Group({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="px-2 pt-6">
      {title && (
        <h2 className="px-3 pb-1 text-[12px] font-bold uppercase tracking-wider" style={{ color: 'var(--ink-3)' }}>
          {title}
        </h2>
      )}
      <motion.div
        variants={{ animate: { transition: { staggerChildren: 0.035 } } }}
        initial="initial"
        animate="animate"
        className="flex flex-col"
      >
        {children}
      </motion.div>
    </section>
  )
}
