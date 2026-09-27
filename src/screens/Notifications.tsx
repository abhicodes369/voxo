import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { Art } from '../lib/art'
import { notifications, userById } from '../lib/data'
import { useStore } from '../lib/store'
import { listVariants, riseVariants, snappy, spring } from '../lib/motion'

const GROUPS = [
  { key: 'new', label: 'New', ids: ['n1', 'n2', 'n3'] },
  { key: 'week', label: 'This week', ids: ['n4', 'n5'] },
  { key: 'earlier', label: 'Earlier', ids: ['n6', 'n7'] },
]

export function Notifications() {
  const { following, toggleFollow } = useStore()
  const [tab, setTab] = useState<'all' | 'mentions'>('all')

  return (
    <Screen>
      <TopBar title="Notifications" back />

      <div className="flex gap-2 px-4 pt-4">
        {(['all', 'mentions'] as const).map((t) => (
          <motion.button
            key={t}
            onClick={() => setTab(t)}
            whileTap={{ scale: 0.95 }}
            transition={snappy}
            className="relative rounded-full px-4 py-2 text-[13px] font-semibold capitalize"
            style={{ color: tab === t ? '#fff' : 'var(--ink-2)' }}
          >
            {tab === t && <motion.span layoutId="notif-pill" className="brand-grad absolute inset-0 rounded-full" transition={spring} />}
            {tab !== t && <span className="absolute inset-0 rounded-full" style={{ background: 'var(--bg-sunk)' }} />}
            <span className="relative z-10">{t}</span>
          </motion.button>
        ))}
      </div>

      {GROUPS.map((g) => {
        const rows = notifications.filter(
          (n) => g.ids.includes(n.id) && (tab === 'all' || n.kind === 'mention'),
        )
        if (rows.length === 0) return null
        return (
          <section key={g.key} className="pt-6">
            <h2 className="px-4 pb-1 text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--ink-3)' }}>
              {g.label}
            </h2>
            <motion.ul variants={listVariants} initial="initial" animate="animate" className="px-2">
              {rows.map((n) => {
                const u = userById(n.userId)
                const isFollowing = following.has(u.id)
                return (
                  <motion.li
                    key={n.id}
                    variants={riseVariants}
                    className="flex items-center gap-3 rounded-2xl px-2 py-3"
                    style={{ background: g.key === 'new' ? 'color-mix(in oklab, var(--color-brand-500) 5%, transparent)' : 'transparent' }}
                  >
                    <Link to={`/profile/${u.id}`} className="relative">
                      <Avatar seed={u.handle} size={48} />
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ ...spring, delay: 0.15 }}
                        className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full ring-2"
                        style={{ background: badgeColor(n.kind), ['--tw-ring-color' as string]: 'var(--bg)' }}
                      >
                        <Icon name={badgeIcon(n.kind)} size={11} filled style={{ color: '#fff' }} />
                      </motion.span>
                    </Link>

                    <p className="min-w-0 flex-1 text-[14px] leading-snug">
                      <span className="font-semibold">{u.handle}</span>{' '}
                      <span style={{ color: 'var(--ink-2)' }}>{n.text}</span>{' '}
                      <span className="text-[12px]" style={{ color: 'var(--ink-3)' }}>
                        {n.ago}
                      </span>
                    </p>

                    {n.kind === 'follow' ? (
                      <motion.button
                        onClick={() => toggleFollow(u.id)}
                        whileTap={{ scale: 0.93 }}
                        transition={snappy}
                        className="shrink-0 rounded-xl px-3.5 py-2 text-[13px] font-bold"
                        style={
                          isFollowing
                            ? { background: 'var(--bg-sunk)', color: 'var(--ink)' }
                            : { backgroundImage: 'linear-gradient(115deg,var(--color-brand-500),var(--color-ember-500))', color: '#fff' }
                        }
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </motion.button>
                    ) : (
                      <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                        <Art seed={`nt-${n.id}`} className="h-full w-full" />
                      </span>
                    )}
                  </motion.li>
                )
              })}
            </motion.ul>
          </section>
        )
      })}
    </Screen>
  )
}

function badgeIcon(kind: string) {
  return kind === 'like' ? 'heart' : kind === 'follow' ? 'user' : kind === 'comment' ? 'comment' : 'at'
}

function badgeColor(kind: string) {
  return kind === 'like'
    ? 'var(--color-brand-500)'
    : kind === 'follow'
      ? 'var(--color-violet-500)'
      : kind === 'comment'
        ? 'var(--color-ember-500)'
        : '#2dd4a7'
}
