import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Field } from '../components/Field'
import { Icon } from '../components/Icon'
import { IconButton } from '../components/Button'
import { useStore } from '../lib/store'
import { riseVariants, snappy } from '../lib/motion'

export function Signup() {
  const nav = useNavigate()
  const { signIn, say } = useStore()
  const [agreed, setAgreed] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      say('Please accept the terms to continue')
      return
    }
    signIn()
    say('Account created. Welcome to VOXO')
    nav('/home', { replace: true })
  }

  return (
    <motion.div
      className="aurora no-scrollbar relative h-full w-full overflow-y-auto"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="relative z-10 mx-auto flex min-h-full w-full max-w-sm flex-col px-7 pb-10 pt-6"
        variants={{ animate: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={riseVariants} className="-ml-2">
          <IconButton onClick={() => nav(-1)} aria-label="Go back">
            <Icon name="back" size={21} />
          </IconButton>
        </motion.div>

        <motion.h1 variants={riseVariants} className="mt-5 text-[30px] font-extrabold leading-tight tracking-tight">
          Create Account
        </motion.h1>
        <motion.p variants={riseVariants} className="mt-2 text-sm" style={{ color: 'var(--ink-3)' }}>
          A handle, a password, and you are in.
        </motion.p>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
          {(
            [
              { label: 'Full name', icon: 'user', autoComplete: 'name' },
              { label: 'Username', icon: 'at', autoComplete: 'username' },
              { label: 'Email', icon: 'send', type: 'email', autoComplete: 'email' },
              { label: 'Password', icon: 'lock', type: 'password', autoComplete: 'new-password' },
              { label: 'Confirm password', icon: 'key', type: 'password', autoComplete: 'new-password' },
            ] as const
          ).map((f) => (
            <motion.div key={f.label} variants={riseVariants}>
              <Field {...f} />
            </motion.div>
          ))}

          <motion.label variants={riseVariants} className="flex cursor-pointer items-start gap-3 pt-1">
            <motion.span
              onClick={() => setAgreed((a) => !a)}
              whileTap={{ scale: 0.88 }}
              transition={snappy}
              className="mt-[2px] grid h-5 w-5 shrink-0 place-items-center rounded-md border"
              style={{
                borderColor: agreed ? 'transparent' : 'var(--line)',
                background: agreed ? 'var(--color-brand-500)' : 'transparent',
              }}
            >
              <motion.span animate={{ scale: agreed ? 1 : 0, opacity: agreed ? 1 : 0 }} transition={snappy}>
                <Icon name="check" size={13} style={{ color: '#fff' }} strokeWidth={3} />
              </motion.span>
            </motion.span>
            <span className="text-[13px] leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              I agree to the{' '}
              <b style={{ color: 'var(--color-brand-500)' }}>Terms of Service</b> and{' '}
              <b style={{ color: 'var(--color-brand-500)' }}>Privacy Policy</b>
            </span>
          </motion.label>

          <motion.div variants={riseVariants}>
            <Button full type="submit">
              Sign Up
            </Button>
          </motion.div>
        </form>

        <motion.p variants={riseVariants} className="mt-auto pt-10 text-center text-sm" style={{ color: 'var(--ink-2)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-bold" style={{ color: 'var(--color-brand-500)' }}>
            Login
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
