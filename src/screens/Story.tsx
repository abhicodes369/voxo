import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { Art } from '../lib/art'
import { stories, userById } from '../lib/data'
import { useStore } from '../lib/store'
import { snappy } from '../lib/motion'

const SEGMENT_MS = 5000

export function Story() {
  const { id } = useParams()
  const nav = useNavigate()
  const { say } = useStore()

  const startIndex = Math.max(0, stories.findIndex((s) => s.id === id))
  const [index, setIndex] = useState(startIndex)
  const [paused, setPaused] = useState(false)
  const [liked, setLiked] = useState(false)

  const story = stories[index] ?? stories[0]
  const user = userById(story.userId)

  const advance = (step: number) => {
    const next = index + step
    if (next < 0) return
    if (next >= stories.length) {
      nav(-1)
      return
    }
    setIndex(next)
    setLiked(false)
  }

  // Auto-advance; the timer restarts whenever the segment or pause state changes.
  useEffect(() => {
    if (paused) return
    const t = window.setTimeout(() => advance(1), SEGMENT_MS)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused])

  return (
    <motion.div
      className="relative h-full w-full overflow-hidden bg-black"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={story.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <Art seed={`story-${story.id}`} className="h-full w-full" tall />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />

      {/* Segment progress */}
      <div className="absolute inset-x-3 top-3 z-20 flex gap-1">
        {stories.map((_, i) => (
          <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
            {i === index ? (
              // Remounting on index/pause change restarts the fill from zero.
              <motion.span
                key={`${index}-${paused}`}
                className="block h-full origin-left bg-white"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused ? 0.001 : 1 }}
                transition={{ duration: paused ? 0 : SEGMENT_MS / 1000, ease: 'linear' }}
              />
            ) : (
              <span className="block h-full origin-left bg-white" style={{ transform: `scaleX(${i < index ? 1 : 0})` }} />
            )}
          </span>
        ))}
      </div>

      <header className="absolute inset-x-3 top-8 z-20 flex items-center gap-3 pt-2 text-white">
        <Avatar seed={user.handle} size={36} />
        <span className="text-[14px] font-bold drop-shadow">{story.own ? 'Your story' : user.handle}</span>
        <span className="text-[12px] opacity-75">{4 + index}h</span>
        <span className="flex-1" />
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play' : 'Pause'}>
          <Icon name={paused ? 'reels' : 'activity'} size={20} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => nav(-1)} aria-label="Close">
          <Icon name="x" size={22} />
        </motion.button>
      </header>

      {/* Tap zones: left steps back, right steps forward. */}
      <button className="absolute inset-y-0 left-0 z-10 w-1/3" onClick={() => advance(-1)} aria-label="Previous story" />
      <button className="absolute inset-y-0 right-0 z-10 w-2/3" onClick={() => advance(1)} aria-label="Next story" />

      <footer className="absolute inset-x-4 bottom-6 z-20 flex items-center gap-2">
        <div className="flex h-12 flex-1 items-center rounded-full border border-white/40 px-4">
          <input
            placeholder={`Reply to ${story.own ? 'viewers' : user.handle}...`}
            className="h-full w-full bg-transparent text-[14px] text-white outline-none placeholder:text-white/65"
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.82 }}
          transition={snappy}
          onClick={() => setLiked((l) => !l)}
          aria-label="Like story"
          className="grid h-12 w-12 place-items-center text-white"
        >
          <motion.span animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }} style={{ color: liked ? 'var(--color-brand-500)' : '#fff' }}>
            <Icon name="heart" size={25} filled={liked} />
          </motion.span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.82 }}
          transition={snappy}
          onClick={() => say('Story shared')}
          aria-label="Share story"
          className="grid h-12 w-12 place-items-center text-white"
        >
          <Icon name="send" size={24} />
        </motion.button>
      </footer>
    </motion.div>
  )
}
