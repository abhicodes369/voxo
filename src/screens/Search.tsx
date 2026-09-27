import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { Art } from '../lib/art'
import { posts, searchCategories, trending, users } from '../lib/data'
import { useStore } from '../lib/store'
import { riseVariants, snappy, spring } from '../lib/motion'

export function Search() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState(searchCategories[0])
  const nav = useNavigate()
  const { following, toggleFollow } = useStore()

  const matches = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return users
    return users.filter((u) => u.handle.includes(needle) || u.name.toLowerCase().includes(needle))
  }, [q])

  // Deterministic tile sizes keep the explore grid from looking like a plain grid.
  const tiles = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({ seed: `ex${i}`, tall: i % 7 === 2 || i % 11 === 5 })),
    [],
  )

  return (
    <Screen>
      <div className="glass sticky top-0 z-30 px-4 pb-3 pt-4" style={{ borderWidth: '0 0 1px' }}>
        <h1 className="mb-3 text-[22px] font-extrabold tracking-tight">Search</h1>
        <motion.div
          layout
          className="flex h-12 items-center gap-3 rounded-2xl px-4"
          style={{ background: 'var(--bg-sunk)' }}
        >
          <Icon name="search" size={19} style={{ color: 'var(--ink-3)' }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search people, tags, places"
            className="h-full w-full bg-transparent text-[15px] outline-none"
            style={{ color: 'var(--ink)' }}
          />
          {q && (
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => setQ('')} aria-label="Clear">
              <Icon name="x" size={17} style={{ color: 'var(--ink-3)' }} />
            </motion.button>
          )}
        </motion.div>

        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
          {searchCategories.map((c) => {
            const on = c === cat
            return (
              <motion.button
                key={c}
                onClick={() => setCat(c)}
                whileTap={{ scale: 0.94 }}
                transition={snappy}
                className="relative shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold"
                style={{ color: on ? '#fff' : 'var(--ink-2)' }}
              >
                {on && (
                  <motion.span layoutId="cat-pill" className="brand-grad absolute inset-0 rounded-full" transition={spring} />
                )}
                {!on && <span className="absolute inset-0 rounded-full" style={{ background: 'var(--bg-sunk)' }} />}
                <span className="relative z-10">{c}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <section className="px-4 pt-5">
        <h2 className="mb-3 text-[15px] font-bold">Trending</h2>
        <div className="flex flex-wrap gap-2">
          {trending.map((t, i) => (
            <motion.button
              key={t}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, ...spring }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setQ(t.replace('#', ''))}
              className="rounded-full px-3.5 py-2 text-[13px] font-semibold"
              style={{ background: 'var(--bg-sunk)', color: 'var(--color-brand-500)' }}
            >
              {t}
            </motion.button>
          ))}
        </div>
      </section>

      <section className="px-4 pt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-bold">{q ? 'People' : 'Suggested for you'}</h2>
          <span className="text-[13px] font-semibold" style={{ color: 'var(--color-brand-500)' }}>
            See all
          </span>
        </div>
        <div className="flex flex-col">
          {matches.slice(0, 5).map((u, i) => {
            const isFollowing = following.has(u.id)
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i, ...spring }}
                className="flex items-center gap-3 py-2.5"
              >
                <Link to={`/profile/${u.id}`}>
                  <Avatar seed={u.handle} size={46} />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-[14px] font-semibold">{u.handle}</span>
                    {u.verified && <Icon name="verified" size={13} filled style={{ color: 'var(--color-brand-500)' }} />}
                  </div>
                  <span className="truncate text-[12px]" style={{ color: 'var(--ink-3)' }}>
                    {u.name} · {u.followers} followers
                  </span>
                </div>
                <motion.button
                  onClick={() => toggleFollow(u.id)}
                  whileTap={{ scale: 0.93 }}
                  transition={snappy}
                  className="rounded-xl px-4 py-2 text-[13px] font-bold"
                  style={
                    isFollowing
                      ? { background: 'var(--bg-sunk)', color: 'var(--ink)' }
                      : { backgroundImage: 'linear-gradient(115deg,var(--color-brand-500),var(--color-ember-500))', color: '#fff' }
                  }
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="px-4 pt-7">
        <h2 className="mb-3 text-[15px] font-bold">Explore</h2>
        <motion.div
          variants={{ animate: { transition: { staggerChildren: 0.03 } } }}
          initial="initial"
          animate="animate"
          className="grid grid-cols-3 gap-1.5"
        >
          {tiles.map((t) => (
            <motion.button
              key={t.seed}
              variants={riseVariants}
              whileTap={{ scale: 0.96 }}
              onClick={() => nav(`/story/${t.seed}`)}
              className={`relative overflow-hidden rounded-xl ${t.tall ? 'row-span-2 aspect-[1/2.06]' : 'aspect-square'}`}
            >
              <Art seed={t.seed} className="h-full w-full" tall={t.tall} />
              {t.tall && (
                <span className="absolute right-2 top-2" style={{ color: '#fff' }}>
                  <Icon name="reels" size={16} />
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Nothing matched — only reachable while typing. */}
      {q && matches.length === 0 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-8 text-center text-sm" style={{ color: 'var(--ink-3)' }}>
          No one here goes by “{q}”.
        </motion.p>
      )}

      {/* Live post count keeps the section honest as data grows. */}
      <p className="px-4 pb-4 pt-8 text-center text-xs" style={{ color: 'var(--ink-3)' }}>
        {posts.length} posts from people you follow today
      </p>
    </Screen>
  )
}
