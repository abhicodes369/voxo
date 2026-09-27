/**
 * Procedural artwork. Every "photo" in VOXO is a seeded SVG scene rather than a
 * binary asset, so the bundle stays tiny and the whole feed still feels shot by
 * the same photographer.
 */

const PALETTES = [
  { sky: ['#f8c9b4', '#e79a86', '#b06f7a'], sun: '#ffd9a0', land: ['#4a4a63', '#2f3047', '#1d1e2e'] },
  { sky: ['#ffd8c2', '#f2a07f', '#9f6d80'], sun: '#ffe7b8', land: ['#565273', '#363353', '#211f36'] },
  { sky: ['#e9c7d8', '#c58fa8', '#7d5f80'], sun: '#ffd3c4', land: ['#4b4465', '#332e4f', '#1c1930'] },
  { sky: ['#fbd3a7', '#ef9d7c', '#a3667a'], sun: '#fff0c9', land: ['#44485f', '#2b3047', '#191c2c'] },
  { sky: ['#cfd6f2', '#a9a6d6', '#7d6f9e'], sun: '#ffe1cf', land: ['#3f4260', '#2a2b45', '#17182a'] },
  { sky: ['#ffe0cc', '#ffab8c', '#c77a86'], sun: '#fff4d6', land: ['#4e4668', '#332c4d', '#1e1a2f'] },
]

/** Cheap deterministic hash, then an xorshift stream — stable per seed. */
function rng(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5
    return ((h >>> 0) % 10000) / 10000
  }
}

type ArtProps = {
  seed: string
  className?: string
  /** Draw the lone figure that anchors most of the feed's compositions. */
  figure?: boolean
  /**
   * Portrait canvas for full-bleed surfaces (reels, stories). Without it a tall
   * container slices a square viewBox and blows the figure up to a dark blob.
   */
  tall?: boolean
  rounded?: number
}

export function Art({ seed, className, figure = true, tall = false, rounded = 0 }: ArtProps) {
  const r = rng(seed)
  const p = PALETTES[Math.floor(r() * PALETTES.length)]
  const id = seed.replace(/[^a-z0-9]/gi, '')
  const H = tall ? 200 : 100

  const sunX = 24 + r() * 52
  const sunY = (18 + r() * 22) * (H / 100)
  const sunR = 7 + r() * 7
  const figureX = 20 + r() * 60
  const showFigure = figure && r() > 0.18

  // Three dune bands, each a smooth cubic ridge at a different depth.
  const bands = p.land.map((fill, i) => {
    const base = (52 + i * 13 + r() * 6) * (H / 100)
    const lift = 8 + r() * 14
    return {
      fill,
      d: `M0 ${base} C 22 ${base - lift}, 38 ${base + lift * 0.6}, 60 ${base - lift * 0.4}
          S 88 ${base + lift * 0.5}, 100 ${base - lift * 0.2} L100 ${H} L0 ${H} Z`,
    }
  })

  const horizon = 52 * (H / 100)

  return (
    <svg
      viewBox={`0 0 100 ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Abstract dusk landscape"
    >
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="52%" stopColor={p.sky[1]} />
          <stop offset="100%" stopColor={p.sky[2]} />
        </linearGradient>
        <radialGradient id={`glow${id}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={p.sun} stopOpacity="0.95" />
          <stop offset="100%" stopColor={p.sun} stopOpacity="0" />
        </radialGradient>
        <clipPath id={`clip${id}`}>
          <rect width="100" height={H} rx={rounded} />
        </clipPath>
      </defs>

      <g clipPath={`url(#clip${id})`}>
        <rect width="100" height={H} fill={`url(#sky${id})`} />
        <circle cx={sunX} cy={sunY} r={sunR * 3.4} fill={`url(#glow${id})`} />
        <circle cx={sunX} cy={sunY} r={sunR} fill={p.sun} />
        {bands.map((b, i) => (
          <path key={i} d={b.d} fill={b.fill} />
        ))}
        {showFigure && <Figure x={figureX} y={horizon + 14} scale={0.85 + r() * 0.4} fill={p.land[2]} />}
        <rect width="100" height={H} fill={p.land[2]} opacity="0.05" />
      </g>
    </svg>
  )
}

/**
 * The robed standing silhouette that recurs across the reference designs:
 * narrow at the shoulders, flaring to the ground, so it still reads as a person
 * when a reel blows it up to a third of the screen.
 */
const FIGURE_BODY =
  'M0 -25 C 3 -25, 4.3 -21.2, 4.9 -15.5 C 5.6 -8.8, 6.3 -2.6, 6.6 0 ' +
  'L -6.6 0 C -6.3 -2.6, -5.6 -8.8, -4.9 -15.5 C -4.3 -21.2, -3 -25, 0 -25 Z'

function Figure({ x, y, scale, fill }: { x: number; y: number; scale: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={fill}>
      <path d={FIGURE_BODY} />
      <ellipse cx="0" cy="-27.6" rx="2.9" ry="3.4" />
    </g>
  )
}

/** Small circular avatar art — same engine, tighter crop, no horizon. */
export function AvatarArt({ seed, className }: { seed: string; className?: string }) {
  const r = rng(seed + 'av')
  const p = PALETTES[Math.floor(r() * PALETTES.length)]
  const id = 'a' + seed.replace(/[^a-z0-9]/gi, '')
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="100%" stopColor={p.sky[2]} />
        </linearGradient>
      </defs>
      <rect width="40" height="40" fill={`url(#${id})`} />
      <circle cx={12 + r() * 16} cy={11 + r() * 5} r={4 + r() * 3} fill={p.sun} opacity="0.9" />
      <path d="M0 30 C 10 22, 16 34, 26 27 S 36 24, 40 28 L40 40 L0 40 Z" fill={p.land[1]} />
      <g transform="translate(20 34) scale(0.72)" fill={p.land[2]}>
        <path d={FIGURE_BODY} />
        <ellipse cx="0" cy="-27.6" rx="2.9" ry="3.4" />
      </g>
    </svg>
  )
}
