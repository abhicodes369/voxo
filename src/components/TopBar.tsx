import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { IconButton } from './Button'

export function TopBar({
  title,
  back,
  right,
  center,
  subtitle,
  transparent,
}: {
  title?: ReactNode
  back?: boolean
  right?: ReactNode
  center?: boolean
  subtitle?: ReactNode
  transparent?: boolean
}) {
  const nav = useNavigate()
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-30 flex h-14 items-center gap-2 px-3 ${transparent ? '' : 'glass'}`}
      style={transparent ? undefined : { borderWidth: '0 0 1px' }}
    >
      {back && (
        <IconButton onClick={() => nav(-1)} aria-label="Go back">
          <Icon name="back" size={21} />
        </IconButton>
      )}
      <div className={`min-w-0 flex-1 ${center ? 'text-center' : back ? '' : 'pl-2'}`}>
        {typeof title === 'string' ? (
          <h1 className="truncate text-[17px] font-bold tracking-tight">{title}</h1>
        ) : (
          title
        )}
        {subtitle && <p className="truncate text-xs" style={{ color: 'var(--ink-3)' }}>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-1">{right}</div>
    </motion.header>
  )
}
