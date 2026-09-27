import { motion } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import { Icon } from './Icon'
import type { IconName } from './Icon'
import { snappy } from '../lib/motion'

const TABS: { to: string; icon: IconName; label: string }[] = [
  { to: '/home', icon: 'home', label: 'Home' },
  { to: '/search', icon: 'search', label: 'Search' },
  { to: '/create', icon: 'plus', label: 'Create' },
  { to: '/reels', icon: 'reels', label: 'Reels' },
  { to: '/profile', icon: 'user', label: 'Profile' },
]

/** Routes that own the full viewport and therefore hide the tab bar. */
const HIDDEN = ['/', '/onboarding', '/login', '/signup', '/story', '/chat/']

export function BottomNav() {
  const { pathname } = useLocation()
  if (HIDDEN.some((p) => (p === '/' ? pathname === '/' : pathname.startsWith(p)))) return null

  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-4 pb-4">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30, delay: 0.1 }}
        className="glass pointer-events-auto mx-auto flex h-16 max-w-md items-center justify-around rounded-[26px] px-2"
        style={{ boxShadow: 'var(--shadow-lg)' }}
      >
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} aria-label={tab.label} className="relative grid h-12 w-14 place-items-center">
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: 'color-mix(in oklab, var(--color-brand-500) 12%, transparent)' }}
                    transition={{ type: 'spring', stiffness: 520, damping: 38 }}
                  />
                )}
                <motion.span
                  className="relative z-10 grid place-items-center"
                  animate={{
                    scale: isActive ? 1.06 : 1,
                    y: isActive ? -1 : 0,
                    color: isActive ? 'var(--color-brand-500)' : 'var(--ink-3)',
                  }}
                  whileTap={{ scale: 0.86 }}
                  transition={snappy}
                >
                  <Icon name={tab.icon} size={tab.icon === 'plus' ? 26 : 23} />
                </motion.span>
                {isActive && (
                  <motion.span
                    layoutId="tab-dot"
                    className="brand-grad absolute bottom-0 h-1 w-1 rounded-full"
                    transition={{ type: 'spring', stiffness: 520, damping: 38 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </motion.div>
    </nav>
  )
}
