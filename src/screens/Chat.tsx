import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { IconButton } from '../components/Button'
import { Art } from '../lib/art'
import { threadMessages, threads, userById } from '../lib/data'
import type { Message } from '../lib/data'
import { snappy, spring } from '../lib/motion'

export function Chat() {
  const { id = 't1' } = useParams()
  const nav = useNavigate()
  const thread = threads.find((t) => t.id === id) ?? threads[0]
  const user = userById(thread.userId)

  const [list, setList] = useState<Message[]>(() => threadMessages(id))
  const [draft, setDraft] = useState('')
  const [theyType, setTheyType] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [list, theyType])

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    setList((l) => [...l, { id: `s${Date.now()}`, from: 'me', text, time }])
    setDraft('')

    // Canned reply so the thread feels alive without a backend.
    setTheyType(true)
    window.setTimeout(() => {
      setTheyType(false)
      setList((l) => [...l, { id: `r${Date.now()}`, from: 'them', text: REPLIES[l.length % REPLIES.length], time }])
    }, 1800)
  }

  return (
    <motion.div
      className="flex h-full w-full flex-col"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="glass flex h-16 shrink-0 items-center gap-3 px-2" style={{ borderWidth: '0 0 1px' }}>
        <IconButton onClick={() => nav(-1)} aria-label="Back">
          <Icon name="back" size={21} />
        </IconButton>
        <Avatar seed={user.handle} size={40} online={thread.online} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-[15px] font-bold">{user.name}</span>
            {user.verified && <Icon name="verified" size={13} filled style={{ color: 'var(--color-brand-500)' }} />}
          </div>
          <span className="text-[11px]" style={{ color: thread.online ? '#2dd4a7' : 'var(--ink-3)' }}>
            {thread.online ? 'Active now' : 'Active 2h ago'}
          </span>
        </div>
        <IconButton aria-label="Call">
          <Icon name="mic" size={20} />
        </IconButton>
        <IconButton aria-label="Video call">
          <Icon name="video" size={20} />
        </IconButton>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-5 flex flex-col items-center gap-2">
          <Avatar seed={user.handle} size={76} ring="live" />
          <p className="text-[15px] font-bold">{user.name}</p>
          <p className="text-[12px]" style={{ color: 'var(--ink-3)' }}>
            {user.followers} followers · {user.posts} posts
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          {list.map((m, i) => (
            <Bubble key={m.id} m={m} grouped={list[i - 1]?.from === m.from} />
          ))}
          <AnimatePresence>{theyType && <TypingBubble />}</AnimatePresence>
        </div>
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="glass flex shrink-0 items-center gap-2 px-3 py-3" style={{ borderWidth: '1px 0 0' }}>
        <motion.button type="button" whileTap={{ scale: 0.85 }} className="brand-grad grid h-10 w-10 shrink-0 place-items-center rounded-full text-white" aria-label="Camera">
          <Icon name="camera" size={19} />
        </motion.button>
        <div className="flex h-11 flex-1 items-center gap-2 rounded-full px-4" style={{ background: 'var(--bg-sunk)' }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message..."
            className="h-full w-full bg-transparent text-[14px] outline-none"
            style={{ color: 'var(--ink)' }}
          />
          <Icon name="smile" size={18} style={{ color: 'var(--ink-3)' }} />
        </div>
        <AnimatePresence mode="popLayout" initial={false}>
          {draft.trim() ? (
            <motion.button
              key="send"
              type="submit"
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 40 }}
              transition={snappy}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
              style={{ color: 'var(--color-brand-500)' }}
              aria-label="Send"
            >
              <Icon name="send" size={22} />
            </motion.button>
          ) : (
            <motion.button
              key="mic"
              type="button"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={snappy}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
              style={{ color: 'var(--ink-2)' }}
              aria-label="Voice message"
            >
              <Icon name="mic" size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  )
}

const REPLIES = [
  'okay that is genuinely good',
  'send me the raw file?',
  'ha, knew it',
  'when are you shooting next',
  'saving this one',
]

function Bubble({ m, grouped }: { m: Message; grouped: boolean }) {
  const mine = m.from === 'me'
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={spring}
      className={`flex ${mine ? 'justify-end' : 'justify-start'} ${grouped ? '' : 'mt-2'}`}
    >
      <div className="relative max-w-[78%]">
        {m.art ? (
          <div className="overflow-hidden rounded-3xl">
            <Art seed={m.art} className="h-48 w-44" />
          </div>
        ) : (
          <div
            className="rounded-3xl px-4 py-2.5 text-[14px] leading-snug"
            style={
              mine
                ? { backgroundImage: 'linear-gradient(115deg,var(--color-brand-500),var(--color-ember-500))', color: '#fff' }
                : { background: 'var(--bg-sunk)', color: 'var(--ink)' }
            }
          >
            {m.text}
          </div>
        )}
        {m.reaction && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...spring, delay: 0.2 }}
            className="absolute -bottom-2 right-3 grid h-6 w-6 place-items-center rounded-full"
            style={{ background: 'var(--bg-elev)', boxShadow: 'var(--shadow-sm)', color: 'var(--color-ember-500)' }}
          >
            <Icon name="heart" size={13} filled />
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}

function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={spring}
      className="mt-2 flex justify-start"
    >
      <div className="flex items-center gap-1.5 rounded-3xl px-4 py-3.5" style={{ background: 'var(--bg-sunk)' }}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--ink-3)' }}
            animate={{ y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  )
}
