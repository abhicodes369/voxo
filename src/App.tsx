import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { Toast } from './components/Toast'
import { Splash } from './screens/Splash'
import { Onboarding } from './screens/Onboarding'
import { Login } from './screens/Login'
import { Signup } from './screens/Signup'
import { Home } from './screens/Home'
import { Search } from './screens/Search'
import { Create } from './screens/Create'
import { Reels } from './screens/Reels'
import { Profile } from './screens/Profile'
import { Story } from './screens/Story'
import { Chats } from './screens/Chats'
import { Chat } from './screens/Chat'
import { Notifications } from './screens/Notifications'
import { Menu } from './screens/Menu'
import { Settings } from './screens/Settings'
import { Account } from './screens/Account'

export default function App() {
  const location = useLocation()

  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden" style={{ background: 'var(--bg-sunk)' }}>
      <AmbientBackdrop />

      {/* Phone-shaped viewport: edge to edge on mobile, a device on desktop. */}
      <div
        className="relative z-10 flex h-dvh w-full flex-col overflow-hidden sm:h-[min(880px,94dvh)] sm:w-[min(430px,96vw)] sm:rounded-[44px] sm:border-8"
        style={{
          background: 'var(--bg)',
          borderColor: 'var(--ink)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Splash />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/create" element={<Create />} />
              <Route path="/reels" element={<Reels />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/story/:id" element={<Story />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/chat/:id" element={<Chat />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/account" element={<Account />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </AnimatePresence>
          <BottomNav />
          <Toast />
        </div>
      </div>
    </div>
  )
}

/** Soft colour wash behind the device on wide screens. */
function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
      <div
        className="absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle at 35% 35%, var(--color-brand-400), transparent 60%)' }}
      />
      <div
        className="absolute left-[70%] top-[60%] h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-[120px]"
        style={{ background: 'radial-gradient(circle at 50% 50%, var(--color-ember-500), transparent 62%)' }}
      />
    </div>
  )
}
