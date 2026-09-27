import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { IconButton } from '../components/Button'
import { threads, userById } from '../lib/data'
import { useStore } from '../lib/store'
import { listVariants, riseVariants, spring } from '../lib/motion'

export function Chats() {
  const nav = useNavigate()
  const { say } = useStore()
  const [q, setQ] = useState('')

  const shown = threads.filter((t) => userById(t.userId).handle.includes(q.trim().toLowerCase()))
  const active = threads.filter((t) => t.online)

  return (
    <Screen>
      <TopBar
        title="Chats"
        back
        right={
          <>
            <IconButton onClick={() => say('New group')} aria-label="New group">
              <Icon name="users" size={21} />
            </IconButton>
            <IconButton onClick={() => say('New message')} aria-label="New message">
              <Icon name="plus" size={22} />
            </IconButton>
          </>
        }
      />

      <div className="px-4 pt-3">
        <div className="flex h-11 items-center gap-3 rounded-2xl px-4" style={{ background: 'var(--bg-sunk)' }}>
          <Icon name="search" size={18} style={{ color: 'var(--ink-3)' }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search messages"
            className="h-full w-full bg-transparent text-[14px] outline-none"
            style={{ color: 'var(--ink)' }}
          />
        </div>
      </div>

      <motion.div variants={riseVariants} initial="initial" animate="animate" className="no-scrollbar mt-4 flex gap-4 overflow-x-auto px-4 pb-4" style={{ borderBottom: '1px solid var(--line)' }}>
        {active.map((t, i) => {
          const u = userById(t.userId)
          return (
            <motion.button
              key={t.id}
              onClick={() => nav(`/chat/${t.id}`)}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.05 * i }}
              whileTap={{ scale: 0.92 }}
              className="flex w-16 shrink-0 flex-col items-center gap-1.5"
            >
              <Avatar seed={u.handle} size={56} online />
              <span className="w-full truncate text-center text-[11px]" style={{ color: 'var(--ink-2)' }}>
                {u.handle}
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      <motion.ul variants={listVariants} initial="initial" animate="animate" className="px-2 pt-1">
        {shown.map((t) => {
          const u = userById(t.userId)
          return (
            <motion.li key={t.id} variants={riseVariants}>
              <motion.button
                onClick={() => nav(`/chat/${t.id}`)}
                whileTap={{ scale: 0.985, backgroundColor: 'var(--bg-sunk)' }}
                className="flex w-full items-center gap-3 rounded-2xl px-2 py-3 text-left"
              >
                <Avatar seed={u.handle} size={54} online={t.online} ring={t.unread ? 'live' : 'none'} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[15px] font-semibold">{u.name}</span>
                    {u.verified && <Icon name="verified" size={13} filled style={{ color: 'var(--color-brand-500)' }} />}
                  </div>
                  {t.typing ? (
                    <TypingLine />
                  ) : (
                    <span
                      className="mt-0.5 block truncate text-[13px]"
                      style={{ color: t.unread ? 'var(--ink)' : 'var(--ink-3)', fontWeight: t.unread ? 600 : 400 }}
                    >
                      {t.last}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[11px]" style={{ color: t.unread ? 'var(--color-brand-500)' : 'var(--ink-3)' }}>
                    {t.ago}
                  </span>
                  {t.unread && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={spring}
                      className="brand-grad grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold text-white"
                    >
                      {t.unread}
                    </motion.span>
                  )}
                </div>
              </motion.button>
            </motion.li>
          )
        })}
      </motion.ul>
    </Screen>
  )
}

function TypingLine() {
  return (
    <span className="mt-1 flex items-center gap-1 text-[13px]" style={{ color: 'var(--color-brand-500)' }}>
      typing
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1 w-1 rounded-full"
          style={{ background: 'var(--color-brand-500)' }}
          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  )
}
