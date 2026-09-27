import { AvatarArt } from '../lib/art'

type Props = {
  seed: string
  size?: number
  /** 'live' = unseen story ring, 'seen' = muted ring, 'none' = bare. */
  ring?: 'live' | 'seen' | 'none'
  online?: boolean
  className?: string
}

export function Avatar({ seed, size = 44, ring = 'none', online, className = '' }: Props) {
  const pad = ring === 'none' ? 0 : 3
  return (
    <span className={`relative inline-grid shrink-0 place-items-center ${className}`} style={{ width: size, height: size }}>
      {ring !== 'none' && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background:
              ring === 'live'
                ? 'conic-gradient(from 210deg, var(--color-brand-500), var(--color-ember-500), var(--color-violet-400), var(--color-brand-500))'
                : 'var(--line)',
          }}
        />
      )}
      <span
        className="absolute overflow-hidden rounded-full"
        style={{ inset: pad, background: 'var(--bg-elev)', padding: ring === 'none' ? 0 : 2 }}
      >
        <AvatarArt seed={seed} className="h-full w-full rounded-full object-cover" />
      </span>
      {online && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2"
          style={{ width: size * 0.26, height: size * 0.26, background: '#2dd4a7', borderColor: 'var(--bg-elev)' }}
        />
      )}
    </span>
  )
}
