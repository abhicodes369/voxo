import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { IconButton } from '../components/Button'
import { Wordmark } from '../components/Logo'
import { Art } from '../lib/art'
import { posts, stories, userById } from '../lib/data'
import type { Post } from '../lib/data'
import { useStore } from '../lib/store'
import { listVariants, riseVariants, snappy, spring } from '../lib/motion'

export function Home() {
  const nav = useNavigate()
  return (
    <Screen>
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="glass sticky top-0 z-30 flex h-14 items-center justify-between px-4"
        style={{ borderWidth: '0 0 1px' }}
      >
        <Wordmark className="text-xl" />
        <div className="flex items-center gap-1">
          <IconButton onClick={() => nav('/notifications')} aria-label="Notifications" className="relative">
            <Icon name="bell" size={22} />
            <span className="brand-grad absolute right-2 top-2 h-2 w-2 rounded-full ring-2" style={{ ['--tw-ring-color' as string]: 'var(--glass)' }} />
          </IconButton>
          <IconButton onClick={() => nav('/chats')} aria-label="Messages">
            <Icon name="message" size={22} />
          </IconButton>
          <IconButton onClick={() => nav('/menu')} aria-label="Menu">
            <Icon name="more" size={22} />
          </IconButton>
        </div>
      </motion.header>

      <StoryRail />

      <motion.div variants={listVariants} initial="initial" animate="animate" className="flex flex-col gap-2 pt-2">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </motion.div>

      <p className="py-10 text-center text-xs" style={{ color: 'var(--ink-3)' }}>
        You are all caught up
      </p>
    </Screen>
  )
}

function StoryRail() {
  const nav = useNavigate()
  return (
    <motion.div
      variants={riseVariants}
      initial="initial"
      animate="animate"
      className="no-scrollbar flex gap-4 overflow-x-auto px-4 py-4"
      style={{ borderBottom: '1px solid var(--line)' }}
    >
      {stories.map((s, i) => {
        const u = userById(s.userId)
        return (
          <motion.button
            key={s.id}
            onClick={() => nav(`/story/${s.id}`)}
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...spring, delay: 0.05 + i * 0.045 }}
            whileTap={{ scale: 0.92 }}
            className="flex w-16 shrink-0 flex-col items-center gap-1.5"
          >
            <span className="relative">
              <Avatar seed={u.handle} size={62} ring={s.own ? 'none' : s.seen ? 'seen' : 'live'} />
              {s.own && (
                <span
                  className="brand-grad absolute -bottom-0.5 -right-0.5 grid h-[22px] w-[22px] place-items-center rounded-full ring-2"
                  style={{ ['--tw-ring-color' as string]: 'var(--bg)' }}
                >
                  <Icon name="plus" size={13} style={{ color: '#fff' }} strokeWidth={2.6} />
                </span>
              )}
            </span>
            <span className="w-full truncate text-center text-[11px]" style={{ color: 'var(--ink-2)' }}>
              {s.label}
            </span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}

function PostCard({ post }: { post: Post }) {
  const u = userById(post.userId)
  const { liked, toggleLike, saved, toggleSave, say } = useStore()
  const isLiked = liked.has(post.id)
  const isSaved = saved.has(post.id)
  const [burst, setBurst] = useState(0)
  const lastTap = useRef(0)

  const doubleTap = () => {
    const now = Date.now()
    if (now - lastTap.current < 300) {
      if (!isLiked) toggleLike(post.id)
      setBurst((b) => b + 1)
    }
    lastTap.current = now
  }

  return (
    <motion.article variants={riseVariants} className="pb-2" style={{ background: 'var(--bg-elev)' }}>
      <div className="flex items-center gap-3 px-4 py-3">
        <Link to={`/profile/${u.id}`}>
          <Avatar seed={u.handle} size={40} ring="live" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-[14px] font-semibold">{u.handle}</span>
            {u.verified && <Icon name="verified" size={14} filled style={{ color: 'var(--color-brand-500)' }} />}
          </div>
          {post.location && (
            <span className="truncate text-[11px]" style={{ color: 'var(--ink-3)' }}>
              {post.location}
            </span>
          )}
        </div>
        <IconButton onClick={() => say('Post options')} aria-label="More options">
          <Icon name="more" size={20} />
        </IconButton>
      </div>

      <div className="relative aspect-[4/5] w-full overflow-hidden" onPointerDown={doubleTap}>
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-full"
        >
          <Art seed={post.id} className="h-full w-full" />
        </motion.div>

        {/* Heart that blooms on double tap. */}
        <AnimatePresence>
          {burst > 0 && (
            <motion.div
              key={burst}
              className="pointer-events-none absolute inset-0 grid place-items-center"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.25, 1, 1.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, times: [0, 0.2, 0.6, 1] }}
              onAnimationComplete={() => setBurst(0)}
            >
              <Icon name="heart" size={110} filled style={{ color: 'rgba(255,255,255,0.95)', filter: 'drop-shadow(0 6px 24px rgba(0,0,0,.35))' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1 px-2 pt-2">
        <ActionButton active={isLiked} onClick={() => toggleLike(post.id)} icon="heart" label="Like" activeColor="var(--color-brand-500)" />
        <ActionButton onClick={() => say('Comments')} icon="comment" label="Comment" />
        <ActionButton onClick={() => say('Shared to your story')} icon="send" label="Share" />
        <span className="flex-1" />
        <ActionButton active={isSaved} onClick={() => toggleSave(post.id)} icon="bookmark" label="Save" activeColor="var(--ink)" />
      </div>

      <div className="px-4 pb-1 pt-1">
        <motion.p key={String(isLiked)} initial={{ y: -6, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} className="text-[13px] font-semibold">
          {(post.likes + (isLiked ? 1 : 0)).toLocaleString()} likes
        </motion.p>
        <p className="mt-1 text-[14px] leading-snug">
          <span className="font-semibold">{u.handle}</span>{' '}
          <span style={{ color: 'var(--ink-2)' }}>{post.caption}</span>
        </p>
        <button className="mt-1 text-[13px]" style={{ color: 'var(--ink-3)' }} onClick={() => say('Comments')}>
          View all {post.comments} comments
        </button>
        <p className="mt-1 text-[11px] uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
          {post.ago} ago
        </p>
      </div>
    </motion.article>
  )
}

function ActionButton({
  icon,
  label,
  onClick,
  active,
  activeColor,
}: {
  icon: 'heart' | 'comment' | 'send' | 'bookmark'
  label: string
  onClick: () => void
  active?: boolean
  activeColor?: string
}) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      whileTap={{ scale: 0.8 }}
      transition={snappy}
      className="grid h-11 w-11 place-items-center rounded-full"
    >
      <motion.span
        animate={active ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ color: active ? activeColor : 'var(--ink)' }}
      >
        <Icon name={icon} size={23} filled={active} />
      </motion.span>
    </motion.button>
  )
}
