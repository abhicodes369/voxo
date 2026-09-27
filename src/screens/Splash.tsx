import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { useStore } from '../lib/store'

const LETTERS = ['V', 'O', 'X', 'O']

export function Splash() {
  const nav = useNavigate()
  const { signedIn, seenIntro } = useStore()

  useEffect(() => {
    const next = signedIn ? '/home' : seenIntro ? '/login' : '/onboarding'
    const t = window.setTimeout(() => nav(next, { replace: true }), 2400)
    return () => window.clearTimeout(t)
  }, [nav, signedIn, seenIntro])

  return (
    <motion.div
      className="aurora relative grid h-full w-full place-items-center overflow-hidden"
      exit={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
      transition={{ duration: 0.5, ease: [0.4, 0, 1, 1] }}
    >
      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        >
          <Logo size={92} animated />
        </motion.div>

        <div className="flex gap-[3px] overflow-hidden">
          {LETTERS.map((l, i) => (
            <motion.span
              key={i}
              className="brand-text text-4xl font-extrabold tracking-[0.3em]"
              initial={{ y: 40, opacity: 0, rotateX: -60 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.9 + i * 0.08, type: 'spring', stiffness: 300, damping: 22 }}
            >
              {l}
            </motion.span>
          ))}
        </div>

        <motion.p
          className="text-sm"
          style={{ color: 'var(--ink-3)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.45, duration: 0.6 }}
        >
          express yourself
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-16 h-[3px] w-36 overflow-hidden rounded-full"
        style={{ background: 'var(--line)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="brand-grad h-full w-full origin-left rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </motion.div>
  )
}
