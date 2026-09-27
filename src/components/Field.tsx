import { motion } from 'framer-motion'
import { useId, useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Icon } from './Icon'
import type { IconName } from './Icon'
import { spring } from '../lib/motion'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon?: IconName
}

/**
 * Text input with a label that lifts into the border on focus, and a gradient
 * underline that wipes in from the left.
 */
export function Field({ label, icon, type = 'text', className = '', ...rest }: Props) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState('')
  const [reveal, setReveal] = useState(false)
  const lifted = focused || value.length > 0
  const isPassword = type === 'password'

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="relative flex h-14 items-center gap-3 rounded-2xl border px-4"
        animate={{
          borderColor: focused ? 'var(--color-brand-400)' : 'var(--line)',
          backgroundColor: 'var(--bg-elev)',
        }}
        transition={{ duration: 0.2 }}
      >
        {icon && (
          <Icon
            name={icon}
            size={19}
            style={{ color: focused ? 'var(--color-brand-500)' : 'var(--ink-3)', transition: 'color .2s' }}
          />
        )}
        <input
          id={id}
          type={isPassword && reveal ? 'text' : type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="peer h-full w-full bg-transparent text-[15px] outline-none placeholder:text-transparent"
          placeholder={label}
          {...rest}
        />
        <motion.label
          htmlFor={id}
          className="pointer-events-none absolute left-4 origin-left px-1"
          style={{ color: lifted ? 'var(--ink-3)' : 'var(--ink-3)', background: lifted ? 'var(--bg-elev)' : 'transparent' }}
          animate={{
            y: lifted ? -28 : 0,
            x: lifted ? (icon ? -4 : 0) : icon ? 28 : 0,
            scale: lifted ? 0.8 : 1,
          }}
          transition={spring}
        >
          {label}
        </motion.label>
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? 'Hide password' : 'Show password'}
            style={{ color: 'var(--ink-3)' }}
          >
            <Icon name="eye" size={19} />
          </button>
        )}
      </motion.div>
      <motion.span
        aria-hidden
        className="brand-grad absolute -bottom-px left-4 right-4 h-[2px] origin-left rounded-full"
        initial={false}
        animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}
