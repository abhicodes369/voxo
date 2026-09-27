import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Art } from '../lib/art'
import { Button } from '../components/Button'
import { useStore } from '../lib/store'
import { spring } from '../lib/motion'

const SLIDES = [
  {
    title: 'Share Your\nMoments',
    body: 'Post the frames worth keeping. VOXO keeps them looking exactly how you shot them.',
    seeds: ['onb-a1', 'onb-a2', 'onb-a3'],
  },
  {
    title: 'Connect\nWith People',
    body: 'Find the people making work you love, and the ones who will love yours.',
    seeds: ['onb-b1', 'onb-b2', 'onb-b3'],
  },
  {
    title: 'Express\nYourself',
    body: 'Reels, stories, long captions at 2am. However it comes out, it belongs here.',
    seeds: ['onb-c1', 'onb-c2', 'onb-c3'],
  },
]

export function Onboarding() {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const nav = useNavigate()
  const { finishIntro } = useStore()
  const drag = useMotionValue(0)
  const tilt = useTransform(drag, [-200, 200], [8, -8])

  const last = i === SLIDES.length - 1

  const go = (next: number) => {
    if (next < 0 || next >= SLIDES.length) return
    setDir(next > i ? 1 : -1)
    setI(next)
  }

  const finish = () => {
    finishIntro()
    nav('/login')
  }

  const slide = SLIDES[i]

  return (
    <motion.div className="aurora relative flex h-full w-full flex-col overflow-hidden" exit={{ opacity: 0 }}>
      <div className="relative z-10 flex justify-end px-5 pt-5">
        <button onClick={finish} className="text-sm font-medium" style={{ color: 'var(--ink-3)' }}>
          Skip
        </button>
      </div>

      {/* Card stack — drag horizontally or use the button. */}
      <div className="relative z-10 grid flex-1 place-items-center px-6">
        <motion.div
          className="relative h-[46vh] max-h-[380px] w-full max-w-[300px]"
          style={{ perspective: 1200 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDrag={(_, info) => drag.set(info.offset.x)}
          onDragEnd={(_, info) => {
            drag.set(0)
            if (info.offset.x < -60) go(i + 1)
            else if (info.offset.x > 60) go(i - 1)
          }}
        >
          <AnimatePresence mode="popLayout" custom={dir}>
            {slide.seeds.map((seed, n) => (
              <motion.div
                key={seed}
                custom={dir}
                initial={{ opacity: 0, x: dir * 120, rotate: dir * 6, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  x: (n - 1) * 26,
                  y: n === 1 ? -10 : 14,
                  rotate: (n - 1) * 7,
                  scale: n === 1 ? 1 : 0.86,
                  zIndex: n === 1 ? 3 : 1,
                }}
                exit={{ opacity: 0, x: -dir * 120, rotate: -dir * 6, scale: 0.9 }}
                transition={{ ...spring, delay: n * 0.05 }}
                style={{ rotateY: tilt }}
                className="absolute inset-0 overflow-hidden rounded-[28px]"
              >
                <Art seed={seed} className="h-full w-full" rounded={0} />
                <div className="absolute inset-0 rounded-[28px] ring-1 ring-white/25" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="relative z-10 px-7 pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="whitespace-pre-line text-[34px] font-extrabold leading-[1.08] tracking-tight">
              {slide.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex items-center gap-2">
          {SLIDES.map((_, n) => (
            <button key={n} onClick={() => go(n)} aria-label={`Slide ${n + 1}`} className="py-2">
              <motion.span
                className="block h-[6px] rounded-full"
                animate={{
                  width: n === i ? 26 : 6,
                  background: n === i ? 'var(--color-brand-500)' : 'var(--line)',
                }}
                transition={spring}
              />
            </button>
          ))}
        </div>

        <Button full className="mt-6" onClick={() => (last ? finish() : go(i + 1))}>
          {last ? 'Get Started' : 'Next'}
        </Button>
      </div>
    </motion.div>
  )
}
