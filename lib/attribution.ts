// "How did you hear about us?" — one list, shared by the checkout dropdown, the
// confirmation email's one-click links, and the admin breakdown, so a source
// can never be spelled two different ways.

export interface Source {
  key: string
  label: string
  emoji: string
}

export const SOURCES: Source[] = [
  { key: 'google', label: 'Google search', emoji: '🔍' },
  { key: 'facebook', label: 'Facebook', emoji: '👍' },
  { key: 'instagram', label: 'Instagram', emoji: '📷' },
  { key: 'tiktok', label: 'TikTok', emoji: '🎵' },
  { key: 'telegram', label: 'Telegram', emoji: '✈️' },
  { key: 'friend', label: 'Friend or family', emoji: '💬' },
  { key: 'returning', label: "I've ordered before", emoji: '🌸' },
  { key: 'other', label: 'Somewhere else', emoji: '✨' },
]

const byKey = new Map(SOURCES.map(s => [s.key, s]))

export function isSourceKey(key: unknown): key is string {
  return typeof key === 'string' && byKey.has(key)
}

export function sourceLabel(key: string | null | undefined, detail?: string | null): string {
  if (!key) return ''
  const source = byKey.get(key)
  if (!source) return key
  if (key === 'other' && detail) return `${source.label} — ${detail}`
  return source.label
}

export function sourceEmoji(key: string | null | undefined): string {
  return (key && byKey.get(key)?.emoji) || '❓'
}
