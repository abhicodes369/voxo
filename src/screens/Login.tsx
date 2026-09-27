import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Field } from '../components/Field'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { useStore } from '../lib/store'
import { riseVariants } from '../lib/motion'

export function Login() {
  const nav = useNavigate()
  const { signIn, say } = useStore()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    signIn()
    say('Welcome back, Mukesh')
    nav('/home', { replace: true })
  }

  return (
    <motion.div
      className="aurora no-scrollbar relative h-full w-full overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="relative z-10 mx-auto flex min-h-full w-full max-w-sm flex-col px-7 pb-10 pt-14"
        variants={{ animate: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={riseVariants} className="flex flex-col items-center gap-3">
          <Logo size={54} animated />
          <h1 className="text-[26px] font-extrabold tracking-tight">Welcome Back</h1>
          <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
            Sign in to pick up where you left off
          </p>
        </motion.div>

        <form onSubmit={submit} className="mt-10 flex flex-col gap-5">
          <motion.div variants={riseVariants}>
            <Field label="Email or username" icon="at" autoComplete="username" />
          </motion.div>
          <motion.div variants={riseVariants}>
            <Field label="Password" icon="lock" type="password" autoComplete="current-password" />
          </motion.div>

          <motion.button
            type="button"
            variants={riseVariants}
            onClick={() => say('Reset link sent to your inbox')}
            className="self-end text-[13px] font-semibold"
            style={{ color: 'var(--color-brand-500)' }}
          >
            Forgot password?
          </motion.button>

          <motion.div variants={riseVariants}>
            <Button full type="submit">
              Login
            </Button>
          </motion.div>
        </form>

        <motion.div variants={riseVariants} className="my-7 flex items-center gap-4">
          <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--ink-3)' }}>
            or continue with
          </span>
          <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
        </motion.div>

        <motion.div variants={riseVariants} className="flex flex-col gap-3">
          <SocialButton label="Continue with Google" onClick={() => say('Google sign-in is a demo here')}>
            <GoogleGlyph />
          </SocialButton>
          <SocialButton label="Continue with Apple" onClick={() => say('Apple sign-in is a demo here')}>
            <Icon name="sparkle" size={18} />
          </SocialButton>
        </motion.div>

        <motion.p variants={riseVariants} className="mt-auto pt-10 text-center text-sm" style={{ color: 'var(--ink-2)' }}>
          New here?{' '}
          <Link to="/signup" className="font-bold" style={{ color: 'var(--color-brand-500)' }}>
            Create an account
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

function SocialButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      className="surface flex h-13 items-center justify-center gap-3 rounded-2xl text-[15px] font-semibold"
      style={{ height: 52 }}
    >
      {children}
      {label}
    </motion.button>
  )
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36a12 12 0 1 1 7.9-21l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5Z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7Z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5A20 20 0 0 0 24 44Z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 40.2 44 35 44 24c0-1.2-.1-2.4-.4-3.5Z" />
    </svg>
  )
}
