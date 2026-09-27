export type User = {
  id: string
  handle: string
  name: string
  bio: string
  verified?: boolean
  followers: string
  following: string
  posts: number
}

export type Post = {
  id: string
  userId: string
  caption: string
  likes: number
  comments: number
  ago: string
  location?: string
}

export type Reel = {
  id: string
  userId: string
  caption: string
  audio: string
  likes: string
  comments: string
  shares: string
}

export type ChatThread = {
  id: string
  userId: string
  last: string
  ago: string
  unread?: number
  online?: boolean
  typing?: boolean
}

export type Message = {
  id: string
  from: 'me' | 'them'
  text?: string
  art?: string
  time: string
  reaction?: string
}

export type Notification = {
  id: string
  userId: string
  kind: 'like' | 'follow' | 'comment' | 'mention'
  text: string
  ago: string
  actioned?: boolean
}

export const me: User = {
  id: 'me',
  handle: 'mukesh_echo',
  name: 'Mukesh Anand',
  bio: 'Chasing golden hours and quiet frames.\nDesign - Film - Coffee\nCalicut, everywhere else next',
  verified: true,
  followers: '12.4K',
  following: '642',
  posts: 128,
}

export const users: User[] = [
  { id: 'u1', handle: 'adithi', name: 'Adithi Raman', bio: 'Light chaser', followers: '8.2K', following: '310', posts: 74, verified: true },
  { id: 'u2', handle: 'vibin', name: 'Vibin Joseph', bio: 'Frames and footnotes', followers: '2.1K', following: '480', posts: 39 },
  { id: 'u3', handle: 'meghna', name: 'Meghna Pillai', bio: 'Slow mornings', followers: '15.9K', following: '204', posts: 212, verified: true },
  { id: 'u4', handle: 'arjun', name: 'Arjun Nair', bio: 'Shoots on film only', followers: '940', following: '1.2K', posts: 18 },
  { id: 'u5', handle: 'yashik', name: 'Yashika Dev', bio: 'Colour theory nerd', followers: '4.6K', following: '150', posts: 86 },
  { id: 'u6', handle: 'nila', name: 'Nila Thomas', bio: 'Dunes and duets', followers: '23.1K', following: '98', posts: 301, verified: true },
  { id: 'u7', handle: 'karthik', name: 'Karthik S', bio: 'Editing in the dark', followers: '1.8K', following: '760', posts: 45 },
  { id: 'u8', handle: 'reva', name: 'Reva Menon', bio: 'Sound and silence', followers: '6.3K', following: '221', posts: 57 },
]

export const allUsers = [me, ...users]

export function userById(id: string): User {
  return allUsers.find((u) => u.id === id) ?? users[0]
}

export const posts: Post[] = [
  { id: 'p1', userId: 'u3', caption: 'Stood still until the sky ran out of colour.', likes: 2481, comments: 64, ago: '2h', location: 'Varkala Cliff' },
  { id: 'p2', userId: 'u1', caption: 'Some evenings only make sense in silhouette.', likes: 1204, comments: 31, ago: '5h', location: 'Kovalam' },
  { id: 'p3', userId: 'u6', caption: 'Dunes hum a little before dusk. You can hear it if you stop walking.', likes: 8932, comments: 214, ago: '9h', location: 'Jaisalmer' },
  { id: 'p4', userId: 'u5', caption: 'Colour study no. 14 - peach into plum.', likes: 640, comments: 12, ago: '14h' },
  { id: 'p5', userId: 'u2', caption: 'Shot this on the last frame of the roll. Worth it.', likes: 1876, comments: 48, ago: '1d', location: 'Munnar' },
  { id: 'p6', userId: 'u8', caption: 'No caption does this one justice.', likes: 3320, comments: 97, ago: '1d' },
  { id: 'p7', userId: 'u4', caption: 'Waiting for the tide to finish its sentence.', likes: 512, comments: 9, ago: '2d', location: 'Bekal' },
]

export const stories = [
  { id: 's0', userId: 'me', label: 'Your story', own: true, seen: false },
  ...users.slice(0, 6).map((u, i) => ({ id: `s${i + 1}`, userId: u.id, label: u.handle, own: false, seen: i > 3 })),
]

export const reels: Reel[] = [
  { id: 'r1', userId: 'u6', caption: 'The dunes at 6:42pm. No filter, just patience. #goldenhour', audio: 'Nila - original audio', likes: '124K', comments: '1.2K', shares: '8.4K' },
  { id: 'r2', userId: 'u3', caption: 'Turn your sound on for this one', audio: 'slowed reverb - ambient', likes: '89K', comments: '904', shares: '3.1K' },
  { id: 'r3', userId: 'u1', caption: 'One take, one breath, one horizon.', audio: 'Adithi - original audio', likes: '41K', comments: '612', shares: '2.7K' },
  { id: 'r4', userId: 'u5', caption: 'Colour grading this took longer than the shoot.', audio: 'lo-fi dusk - loop', likes: '17K', comments: '288', shares: '910' },
]

export const threads: ChatThread[] = [
  { id: 't1', userId: 'u1', last: 'okay but that last frame though', ago: '2m', unread: 2, online: true },
  { id: 't2', userId: 'u3', last: 'sending the presets tonight', ago: '18m', online: true, typing: true },
  { id: 't3', userId: 'u6', last: 'You: are we still on for sunrise?', ago: '1h' },
  { id: 't4', userId: 'u5', last: 'Reacted to your story', ago: '3h', unread: 1 },
  { id: 't5', userId: 'u2', last: 'haha fair. next roll is on me', ago: 'Yesterday' },
  { id: 't6', userId: 'u7', last: 'Sent an attachment', ago: 'Yesterday' },
  { id: 't7', userId: 'u8', last: 'the audio mix is finally done', ago: 'Mon' },
  { id: 't8', userId: 'u4', last: 'You: saw it, incredible', ago: 'Sun' },
]

export const messages: Record<string, Message[]> = {
  t1: [
    { id: 'm1', from: 'them', text: 'just saw the new set you posted', time: '9:41' },
    { id: 'm2', from: 'them', text: 'okay but that last frame though', time: '9:41' },
    { id: 'm3', from: 'me', text: 'took about forty minutes of standing in one spot', time: '9:44' },
    { id: 'm4', from: 'me', art: 'chat-a', time: '9:44' },
    { id: 'm5', from: 'them', text: 'worth every minute. what were you shooting on?', time: '9:46', reaction: 'fire' },
    { id: 'm6', from: 'me', text: '35mm, wide open, pushed a stop in post', time: '9:47' },
    { id: 'm7', from: 'them', text: 'teach me your ways', time: '9:48' },
  ],
}

export function threadMessages(id: string): Message[] {
  if (messages[id]) return messages[id]
  const t = threads.find((x) => x.id === id)
  return [
    { id: 'a', from: 'them', text: 'hey! you around this weekend?', time: '10:02' },
    { id: 'b', from: 'me', text: 'should be. what are you thinking?', time: '10:09' },
    { id: 'c', from: 'them', art: `chat-${id}`, time: '10:11' },
    { id: 'd', from: 'them', text: t?.last ?? 'let me know', time: '10:11' },
  ]
}

export const notifications: Notification[] = [
  { id: 'n1', userId: 'u1', kind: 'like', text: 'liked your photo', ago: '2m' },
  { id: 'n2', userId: 'u3', kind: 'follow', text: 'started following you', ago: '14m' },
  { id: 'n3', userId: 'u6', kind: 'comment', text: 'commented: this is unreal', ago: '1h' },
  { id: 'n4', userId: 'u5', kind: 'mention', text: 'mentioned you in a comment', ago: '3h' },
  { id: 'n5', userId: 'u2', kind: 'like', text: 'and 24 others liked your reel', ago: '5h' },
  { id: 'n6', userId: 'u7', kind: 'follow', text: 'started following you', ago: '1d', actioned: true },
  { id: 'n7', userId: 'u8', kind: 'like', text: 'liked your story', ago: '2d' },
]

export const trending = ['#goldenhour', '#filmisnotdead', '#dunes', '#slowliving', '#35mm', '#duskdiaries', '#quietframes']

export const searchCategories = ['For you', 'Travel', 'Film', 'Design', 'Music', 'Food', 'Art']

export const filters = ['Original', 'Dusk', 'Ember', 'Ash', 'Bloom', 'Noir', 'Haze']
