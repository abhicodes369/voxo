import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { Icon } from '../components/Icon'
import { Art } from '../lib/art'
import { filters } from '../lib/data'
import { useStore } from '../lib/store'
import { riseVariants, snappy, spring } from '../lib/motion'

const LIBRARY = Array.from({ length: 12 }, (_, i) => `lib${i}`)

/** CSS approximations of the filter names — applied live to the SVG preview. */
const FILTER_CSS: Record<string, string> = {
  Original: 'none',
  Dusk: 'saturate(1.25) contrast(1.05) hue-rotate(-8deg)',
  Ember: 'saturate(1.4) sepia(0.25) contrast(1.08)',
  Ash: 'grayscale(0.55) contrast(1.1)',
  Bloom: 'brightness(1.08) saturate(1.3) blur(0.2px)',
  Noir: 'grayscale(1) contrast(1.3) brightness(0.95)',
  Haze: 'saturate(0.85) brightness(1.06) contrast(0.92)',
}

export function Create() {
  const nav = useNavigate()
  const { say } = useStore()
  const [selected, setSelected] = useState(LIBRARY[0])
  const [filter, setFilter] = useState(filters[0])
  const [caption, setCaption] = useState('')

  const share = () => {
    say('Post shared to your feed')
    nav('/home')
  }

  return (
    <Screen>
      <TopBar
        title="Create Post"
        back
        right={
          <motion.button
            onClick={share}
            whileTap={{ scale: 0.93 }}
            transition={snappy}
            className="rounded-xl px-4 py-2 text-[14px] font-bold"
            style={{ color: 'var(--color-brand-500)' }}
          >
            Share
          </motion.button>
        }
      />

      <motion.div variants={riseVariants} initial="initial" animate="animate" className="px-4 pt-4">
        <motion.div layoutId={`create-${selected}`} className="relative aspect-square w-full overflow-hidden rounded-[26px]">
          <div className="h-full w-full" style={{ filter: FILTER_CSS[filter], transition: 'filter .35s ease' }}>
            <Art seed={selected} className="h-full w-full" />
          </div>
          <div className="absolute inset-0 rounded-[26px] ring-1 ring-black/5" />
          <motion.span
            key={filter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass absolute bottom-3 left-3 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest"
          >
            {filter}
          </motion.span>
        </motion.div>
      </motion.div>

      <section className="pt-5">
        <h2 className="px-4 pb-2 text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--ink-3)' }}>
          Choose a filter
        </h2>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
          {filters.map((f) => {
            const on = f === filter
            return (
              <motion.button
                key={f}
                onClick={() => setFilter(f)}
                whileTap={{ scale: 0.92 }}
                transition={snappy}
                className="flex w-[62px] shrink-0 flex-col items-center gap-1.5"
              >
                <motion.span
                  animate={{ scale: on ? 1 : 0.94 }}
                  transition={spring}
                  className="relative block h-[62px] w-[62px] overflow-hidden rounded-2xl"
                  style={{ filter: FILTER_CSS[f] }}
                >
                  <Art seed={selected} className="h-full w-full" />
                </motion.span>
                <span className="text-[11px] font-semibold" style={{ color: on ? 'var(--color-brand-500)' : 'var(--ink-3)' }}>
                  {f}
                </span>
              </motion.button>
            )
          })}
        </div>
      </section>

      <section className="px-4 pt-6">
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          maxLength={280}
          placeholder="Write a caption..."
          className="w-full resize-none rounded-2xl p-4 text-[15px] leading-relaxed outline-none"
          style={{ background: 'var(--bg-sunk)', color: 'var(--ink)' }}
        />
        <div className="mt-1 flex justify-end text-[11px]" style={{ color: 'var(--ink-3)' }}>
          {caption.length}/280
        </div>

        <div className="mt-3 flex flex-col" style={{ borderTop: '1px solid var(--line)' }}>
          {(
            [
              { icon: 'pin', label: 'Add location' },
              { icon: 'users', label: 'Tag people' },
              { icon: 'music', label: 'Add music' },
              { icon: 'globe', label: 'Audience', value: 'Everyone' },
            ] as const
          ).map((row) => (
            <button
              key={row.label}
              onClick={() => say(`${row.label} — coming soon`)}
              className="flex items-center gap-3 py-3.5 text-left"
              style={{ borderBottom: '1px solid var(--line)' }}
            >
              <Icon name={row.icon} size={19} style={{ color: 'var(--ink-2)' }} />
              <span className="flex-1 text-[14px] font-medium">{row.label}</span>
              {'value' in row && (
                <span className="text-[13px]" style={{ color: 'var(--ink-3)' }}>
                  {row.value}
                </span>
              )}
              <Icon name="chevron" size={16} style={{ color: 'var(--ink-3)' }} />
            </button>
          ))}
        </div>
      </section>

      <section className="pt-6">
        <h2 className="px-4 pb-2 text-[13px] font-bold uppercase tracking-wider" style={{ color: 'var(--ink-3)' }}>
          Recent
        </h2>
        <motion.div
          variants={{ animate: { transition: { staggerChildren: 0.025 } } }}
          initial="initial"
          animate="animate"
          className="grid grid-cols-4 gap-1 px-1"
        >
          {LIBRARY.map((seed) => (
            <motion.button
              key={seed}
              variants={riseVariants}
              onClick={() => setSelected(seed)}
              whileTap={{ scale: 0.94 }}
              className="relative aspect-square overflow-hidden rounded-lg"
            >
              <Art seed={seed} className="h-full w-full" />
              <motion.span
                className="absolute inset-0 rounded-lg"
                animate={{
                  boxShadow: seed === selected ? 'inset 0 0 0 3px var(--color-brand-500)' : 'inset 0 0 0 0px transparent',
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          ))}
        </motion.div>
      </section>
    </Screen>
  )
}
