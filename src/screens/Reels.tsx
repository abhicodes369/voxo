import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import type { IconName } from '../components/Icon'
import { Art } from '../lib/art'
import { reels, userById } from '../lib/data'
import type { Reel } from '../lib/data'
import { useStore } from '../lib/store'
import { snappy } from '../lib/motion'

export function Reels() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="no-scrollbar snap-y-mandatory h-full w-full overflow-y-scroll bg-black"
    >
      {reels.map((r) => (
        <ReelPane key={r.id} reel={r} />
      ))}
    </motion.main>
  )
}

function ReelPane({ reel }: { reel: Reel }) {
  const u = userById(reel.userId)
  const { liked, toggleLike, following, toggleFollow, say } = useStore()
  const isLiked = liked.has(reel.id)
  const [muted, setMuted] = useState(true)
  const isFollowing = following.has(u.id)

  return (
    <section className="snap-start-always relative h-full w-full overflow-hidden">
      {/* Slow Ken Burns push keeps a still frame feeling like footage. */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.12 }}
        transition={{ duration: 18, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
      >
        <Art seed={reel.id} className="h-full w-full" tall />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/75" />

      <header className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-4 text-white">
        <h1 className="text-[20px] font-extrabold tracking-tight drop-shadow">Reels</h1>
        <div className="flex gap-1">
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Unmute' : 'Mute'} className="grid h-10 w-10 place-items-center">
            <Icon name={muted ? 'mute' : 'volume'} size={22} />
          </motion.button>
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => say('Camera')} aria-label="Camera" className="grid h-10 w-10 place-items-center">
            <Icon name="camera" size={22} />
          </motion.button>
        </div>
      </header>

      {/* Right-hand action rail */}
      <div className="absolute bottom-44 right-3 flex flex-col items-center gap-5 text-white">
        <RailButton
          icon="heart"
          value={isLiked ? '124.1K' : reel.likes}
          onClick={() => toggleLike(reel.id)}
          active={isLiked}
        />
        <RailButton icon="comment" value={reel.comments} onClick={() => say('Comments')} />
        <RailButton icon="send" value={reel.shares} onClick={() => say('Shared')} />
        <RailButton icon="more" onClick={() => say('More')} />
        <motion.div
          className="mt-1 h-10 w-10 overflow-hidden rounded-xl ring-2 ring-white/70"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <Art seed={`disc-${reel.id}`} className="h-full w-full" figure={false} />
        </motion.div>
      </div>

      {/* Caption block */}
      <div className="absolute bottom-28 left-4 right-20 text-white">
        <div className="flex items-center gap-2.5">
          <Link to={`/profile/${u.id}`}>
            <Avatar seed={u.handle} size={36} />
          </Link>
          <span className="text-[14px] font-bold drop-shadow">{u.handle}</span>
          {u.verified && <Icon name="verified" size={14} filled />}
          <motion.button
            onClick={() => toggleFollow(u.id)}
            whileTap={{ scale: 0.92 }}
            transition={snappy}
            className="rounded-lg border border-white/70 px-3 py-1 text-[12px] font-bold"
            style={{ background: isFollowing ? 'rgba(255,255,255,0.18)' : 'transparent' }}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </motion.button>
        </div>

        <p className="mt-2.5 text-[14px] leading-snug drop-shadow">{reel.caption}</p>

        <div className="mt-2.5 flex items-center gap-2 overflow-hidden">
          <Icon name="music" size={13} />
          <div className="relative h-4 flex-1 overflow-hidden">
            <motion.span
              className="absolute whitespace-nowrap text-[12px]"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
              {reel.audio} &nbsp;·&nbsp; {reel.audio} &nbsp;·&nbsp;
            </motion.span>
          </div>
        </div>
      </div>

      {/* Playback progress */}
      <div className="absolute bottom-24 left-4 right-4 h-[2px] overflow-hidden rounded-full bg-white/25">
        <motion.div
          className="h-full origin-left bg-white"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
        />
      </div>
    </section>
  )
}

function RailButton({
  icon,
  value,
  onClick,
  active,
}: {
  icon: IconName
  value?: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.82 }} transition={snappy} className="flex flex-col items-center gap-1">
      <motion.span
        animate={active ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ color: active ? 'var(--color-brand-500)' : '#fff' }}
      >
        <Icon name={icon} size={27} filled={active} />
      </motion.span>
      {value && <span className="text-[11px] font-semibold drop-shadow">{value}</span>}
    </motion.button>
  )
}
