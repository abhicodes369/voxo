import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { Group, Row, Toggle } from '../components/Row'
import { me } from '../lib/data'
import { useStore } from '../lib/store'
import { riseVariants } from '../lib/motion'

export function Menu() {
  const nav = useNavigate()
  const { say, theme, toggleTheme, saved, signOut } = useStore()

  return (
    <Screen>
      <TopBar title="Menu" back />

      <motion.button
        variants={riseVariants}
        initial="initial"
        animate="animate"
        onClick={() => nav('/profile')}
        whileTap={{ scale: 0.99 }}
        className="mx-4 mt-4 flex w-[calc(100%-2rem)] items-center gap-4 rounded-3xl p-4 text-left"
        style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' }}
      >
        <Avatar seed={me.handle} size={56} ring="live" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[16px] font-bold">
            {me.name}
            <Icon name="verified" size={14} filled style={{ color: 'var(--color-brand-500)' }} />
          </p>
          <p className="truncate text-[13px]" style={{ color: 'var(--ink-3)' }}>
            @{me.handle} · View profile
          </p>
        </div>
        <Icon name="chevron" size={18} style={{ color: 'var(--ink-3)' }} />
      </motion.button>

      <Group>
        <Row icon="bookmark" label="Saved" hint={`${saved.size} items`} onClick={() => say('Saved collection')} />
        <Row icon="activity" label="Your activity" hint="Time spent, interactions" onClick={() => say('Your activity')} />
        <Row icon="reels" label="Archive" hint="Stories and posts you hid" onClick={() => say('Archive')} />
        <Row icon="star" label="Close Friends" hint="7 people" onClick={() => say('Close friends')} />
        <Row icon="users" label="Discover People" onClick={() => nav('/search')} />
      </Group>

      <Group title="Preferences">
        <Row
          icon={theme === 'dark' ? 'moon' : 'sun'}
          label="Dark mode"
          hint="Follows your taps, not your system"
          right={<Toggle on={theme === 'dark'} onChange={toggleTheme} />}
          onClick={toggleTheme}
        />
        <Row icon="settings" label="Settings" hint="Privacy, notifications, security" onClick={() => nav('/settings')} />
        <Row icon="user" label="Account" hint="Personal details and data" onClick={() => nav('/account')} />
      </Group>

      <Group title="Support">
        <Row icon="help" label="Help & Support" onClick={() => say('Help centre')} />
        <Row icon="info" label="About VOXO" value="v1.0.0" onClick={() => say('VOXO 1.0.0')} />
      </Group>

      <Group>
        <Row
          icon="logout"
          label="Log Out"
          danger
          onClick={() => {
            signOut()
            say('Signed out')
            nav('/login', { replace: true })
          }}
        />
      </Group>

      <p className="px-4 pb-4 pt-8 text-center text-[11px]" style={{ color: 'var(--ink-3)' }}>
        VOXO · made for the quiet frames
      </p>
    </Screen>
  )
}
