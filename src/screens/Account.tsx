import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { Avatar } from '../components/Avatar'
import { Group, Row } from '../components/Row'
import { Wordmark } from '../components/Logo'
import { me } from '../lib/data'
import { useStore } from '../lib/store'
import { riseVariants } from '../lib/motion'

export function Account() {
  const nav = useNavigate()
  const { say, signOut, liked, saved, following } = useStore()

  return (
    <Screen>
      <TopBar title={<Wordmark className="text-lg" />} back />

      <motion.div
        variants={riseVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center gap-3 px-6 pt-6"
      >
        <Avatar seed={me.handle} size={92} ring="live" />
        <div className="text-center">
          <p className="text-[18px] font-bold">{me.name}</p>
          <p className="text-[13px]" style={{ color: 'var(--ink-3)' }}>
            @{me.handle} · mukesh@voxo.app
          </p>
        </div>
        <div className="mt-2 flex w-full justify-around rounded-3xl py-4" style={{ background: 'var(--bg-sunk)' }}>
          <Metric value={String(liked.size)} label="Liked" />
          <Metric value={String(saved.size)} label="Saved" />
          <Metric value={String(following.size)} label="Following" />
        </div>
      </motion.div>

      <Group title="Profile">
        <Row icon="user" label="Edit profile" hint="Name, bio, links" onClick={() => say('Edit profile')} />
        <Row icon="at" label="Username" value={`@${me.handle}`} onClick={() => say('Change username')} />
        <Row icon="image" label="Profile photo" onClick={() => say('Change photo')} />
      </Group>

      <Group title="Account">
        <Row icon="settings" label="Settings" onClick={() => nav('/settings')} />
        <Row icon="shield" label="Security" hint="Two-factor, login activity" onClick={() => say('Security')} />
        <Row icon="download" label="Download your data" onClick={() => say('We will email you a link')} />
        <Row icon="users" label="Switch account" value="1 saved" onClick={() => say('Switch account')} />
      </Group>

      <Group title="Danger zone">
        <Row
          icon="logout"
          label="Log out"
          danger
          onClick={() => {
            signOut()
            say('Signed out')
            nav('/login', { replace: true })
          }}
        />
        <Row icon="trash" label="Delete account" danger onClick={() => say('Account deletion is disabled in the demo')} />
      </Group>
    </Screen>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[19px] font-bold">{value}</span>
      <span className="text-[12px]" style={{ color: 'var(--ink-3)' }}>
        {label}
      </span>
    </div>
  )
}
