import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import type { IconName } from '../components/Icon'
import { Button, IconButton } from '../components/Button'
import { Art } from '../lib/art'
import { me, userById } from '../lib/data'
import { useStore } from '../lib/store'
import { riseVariants, snappy, spring } from '../lib/motion'

const TABS: { key: string; icon: IconName }[] = [
  { key: 'grid', icon: 'grid' },
  { key: 'reels', icon: 'reels' },
  { key: 'saved', icon: 'bookmark' },
]

const HIGHLIGHTS = ['Dunes', 'Film', '2024', 'Travel', 'BTS']

export function Profile() {
  const { id } = useParams()
  const nav = useNavigate()
  const user = id ? userById(id) : me
  const isMe = user.id === me.id
  const { following, toggleFollow, say } = useStore()
  const [tab, setTab] = useState('grid')

  const isFollowing = following.has(user.id)
  const tiles = Array.from({ length: 12 }, (_, i) => `${user.handle}-${tab}-${i}`)

  return (
    <Screen>
      <TopBar
        back={!isMe}
        title={
          <span className="flex items-center gap-1.5">
            <span className="text-[17px] font-bold">{user.handle}</span>
            {user.verified && <Icon name="verified" size={15} filled style={{ color: 'var(--color-brand-500)' }} />}
          </span>
        }
        right={
          isMe ? (
            <>
              <IconButton onClick={() => nav('/create')} aria-label="Create">
                <Icon name="plus" size={22} />
              </IconButton>
              <IconButton onClick={() => nav('/menu')} aria-label="Menu">
                <Icon name="more" size={22} />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={() => say('Profile options')} aria-label="Options">
              <Icon name="more" size={22} />
            </IconButton>
          )
        }
      />

      <motion.section variants={riseVariants} initial="initial" animate="animate" className="px-4 pt-4">
        <div className="flex items-center gap-6">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...spring, delay: 0.05 }}
          >
            <Avatar seed={user.handle} size={88} ring="live" />
          </motion.div>
          <div className="flex flex-1 justify-around">
            <Stat value={String(user.posts)} label="Posts" />
            <Stat value={user.followers} label="Followers" />
            <Stat value={user.following} label="Following" />
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-[15px] font-bold">{user.name}</h2>
          <p className="mt-0.5 whitespace-pre-line text-[14px] leading-relaxed" style={{ color: 'var(--ink-2)' }}>
            {user.bio}
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          {isMe ? (
            <>
              <Button variant="soft" full onClick={() => say('Edit profile')}>
                Edit Profile
              </Button>
              <Button variant="soft" full onClick={() => say('Profile link copied')}>
                Share Profile
              </Button>
            </>
          ) : (
            <>
              <motion.button
                onClick={() => toggleFollow(user.id)}
                whileTap={{ scale: 0.96 }}
                transition={snappy}
                className="h-11 flex-1 rounded-2xl text-[14px] font-bold"
                style={
                  isFollowing
                    ? { background: 'var(--bg-sunk)', color: 'var(--ink)' }
                    : { backgroundImage: 'linear-gradient(115deg,var(--color-brand-500),var(--color-ember-500))', color: '#fff' }
                }
              >
                {isFollowing ? 'Following' : 'Follow'}
              </motion.button>
              <Button variant="soft" className="flex-1" onClick={() => nav('/chats')}>
                Message
              </Button>
            </>
          )}
        </div>

        <div className="no-scrollbar -mx-4 mt-5 flex gap-4 overflow-x-auto px-4">
          {HIGHLIGHTS.map((h, i) => (
            <motion.button
              key={h}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, ...spring }}
              whileTap={{ scale: 0.92 }}
              className="flex w-16 shrink-0 flex-col items-center gap-1.5"
            >
              <span className="h-16 w-16 overflow-hidden rounded-full p-[3px]" style={{ background: 'var(--line)' }}>
                <Art seed={`hl-${h}`} className="h-full w-full rounded-full" />
              </span>
              <span className="truncate text-[11px]" style={{ color: 'var(--ink-2)' }}>
                {h}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      <div className="sticky top-14 z-20 mt-5 flex" style={{ background: 'var(--bg)', borderTop: '1px solid var(--line)' }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className="relative flex-1 py-3" aria-label={t.key}>
            <motion.span
              className="mx-auto block w-fit"
              animate={{ color: tab === t.key ? 'var(--ink)' : 'var(--ink-3)', scale: tab === t.key ? 1.05 : 1 }}
              transition={snappy}
            >
              <Icon name={t.icon} size={21} />
            </motion.span>
            {tab === t.key && (
              <motion.span
                layoutId="profile-tab"
                className="brand-grad absolute inset-x-6 bottom-0 h-[2px] rounded-full"
                transition={{ type: 'spring', stiffness: 520, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>

      <motion.div
        key={tab}
        variants={{ animate: { transition: { staggerChildren: 0.025 } } }}
        initial="initial"
        animate="animate"
        className="grid grid-cols-3 gap-[2px] pt-[2px]"
      >
        {tiles.map((seed, i) => (
          <motion.button
            key={seed}
            variants={riseVariants}
            whileTap={{ scale: 0.97 }}
            onClick={() => nav(`/story/${seed}`)}
            className="relative aspect-square overflow-hidden"
          >
            <Art seed={seed} className="h-full w-full" />
            {tab === 'reels' && (
              <span className="absolute right-1.5 top-1.5 text-white drop-shadow">
                <Icon name="reels" size={15} />
              </span>
            )}
            {tab === 'grid' && i % 5 === 1 && (
              <span className="absolute right-1.5 top-1.5 text-white drop-shadow">
                <Icon name="image" size={15} />
              </span>
            )}
          </motion.button>
        ))}
      </motion.div>
    </Screen>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <motion.div whileTap={{ scale: 0.94 }} className="flex flex-col items-center">
      <span className="text-[17px] font-bold">{value}</span>
      <span className="text-[12px]" style={{ color: 'var(--ink-3)' }}>
        {label}
      </span>
    </motion.div>
  )
}
