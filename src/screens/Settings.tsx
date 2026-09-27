import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen } from '../components/Screen'
import { TopBar } from '../components/TopBar'
import { Group, Row, Toggle } from '../components/Row'
import { useStore } from '../lib/store'

export function Settings() {
  const nav = useNavigate()
  const { say, theme, toggleTheme } = useStore()
  const [flags, setFlags] = useState({ private: false, push: true, reduceData: false, readReceipts: true })

  const set = (k: keyof typeof flags) => (v: boolean) => setFlags((f) => ({ ...f, [k]: v }))

  return (
    <Screen>
      <TopBar title="Settings" back />

      <Group title="Account">
        <Row icon="user" label="Account" hint="Details, linked accounts" onClick={() => nav('/account')} />
        <Row icon="lock" label="Private account" hint="Only approved followers see your posts" right={<Toggle on={flags.private} onChange={set('private')} />} onClick={() => set('private')(!flags.private)} />
        <Row icon="key" label="Password & security" onClick={() => say('Security centre')} />
      </Group>

      <Group title="Notifications">
        <Row icon="bell" label="Push notifications" right={<Toggle on={flags.push} onChange={set('push')} />} onClick={() => set('push')(!flags.push)} />
        <Row icon="heart" label="Likes and comments" value="From everyone" onClick={() => say('Notification detail')} />
        <Row icon="message" label="Read receipts" right={<Toggle on={flags.readReceipts} onChange={set('readReceipts')} />} onClick={() => set('readReceipts')(!flags.readReceipts)} />
      </Group>

      <Group title="Appearance & data">
        <Row icon={theme === 'dark' ? 'moon' : 'sun'} label="Theme" value={theme === 'dark' ? 'Dark' : 'Light'} onClick={toggleTheme} />
        <Row icon="download" label="Data saver" hint="Load media at lower quality" right={<Toggle on={flags.reduceData} onChange={set('reduceData')} />} onClick={() => set('reduceData')(!flags.reduceData)} />
        <Row icon="globe" label="Language" value="English" onClick={() => say('Language')} />
      </Group>

      <Group title="Privacy">
        <Row icon="shield" label="Privacy policy" onClick={() => say('Privacy policy')} />
        <Row icon="eye" label="Blocked accounts" value="2" onClick={() => say('Blocked accounts')} />
        <Row icon="flag" label="Community guidelines" onClick={() => say('Community guidelines')} />
      </Group>

      <Group title="More">
        <Row icon="help" label="Help & support" onClick={() => say('Help centre')} />
        <Row icon="info" label="Terms of service" onClick={() => say('Terms of service')} />
        <Row icon="sparkle" label="About" value="v1.0.0" onClick={() => say('VOXO 1.0.0')} />
      </Group>
    </Screen>
  )
}
