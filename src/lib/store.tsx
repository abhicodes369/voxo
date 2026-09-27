import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type Theme = 'light' | 'dark'

type Store = {
  theme: Theme
  toggleTheme: () => void
  signedIn: boolean
  signIn: () => void
  signOut: () => void
  seenIntro: boolean
  finishIntro: () => void
  liked: Set<string>
  toggleLike: (id: string) => void
  saved: Set<string>
  toggleSave: (id: string) => void
  following: Set<string>
  toggleFollow: (id: string) => void
  toast: string | null
  say: (message: string) => void
}

const Ctx = createContext<Store | null>(null)

const KEY = 'voxo.v1'

type Persisted = { theme: Theme; signedIn: boolean; seenIntro: boolean; liked: string[]; saved: string[]; following: string[] }

function load(): Partial<Persisted> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => load(), [])
  const [theme, setTheme] = useState<Theme>(initial.theme ?? 'light')
  const [signedIn, setSignedIn] = useState(initial.signedIn ?? false)
  const [seenIntro, setSeenIntro] = useState(initial.seenIntro ?? false)
  const [liked, setLiked] = useState<Set<string>>(new Set(initial.liked ?? []))
  const [saved, setSaved] = useState<Set<string>>(new Set(initial.saved ?? []))
  const [following, setFollowing] = useState<Set<string>>(new Set(initial.following ?? ['u1', 'u3']))
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0b0a12' : '#f6f4fb')
  }, [theme])

  useEffect(() => {
    const payload: Persisted = {
      theme,
      signedIn,
      seenIntro,
      liked: [...liked],
      saved: [...saved],
      following: [...following],
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(payload))
    } catch {
      /* private mode — session-only state is fine */
    }
  }, [theme, signedIn, seenIntro, liked, saved, following])

  const say = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast((t) => (t === message ? null : t)), 2200)
  }, [])

  const toggleIn = (set: (fn: (s: Set<string>) => Set<string>) => void) => (id: string) =>
    set((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const value: Store = {
    theme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    signedIn,
    signIn: () => setSignedIn(true),
    signOut: () => setSignedIn(false),
    seenIntro,
    finishIntro: () => setSeenIntro(true),
    liked,
    toggleLike: toggleIn(setLiked),
    saved,
    toggleSave: toggleIn(setSaved),
    following,
    toggleFollow: toggleIn(setFollowing),
    toast,
    say,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
