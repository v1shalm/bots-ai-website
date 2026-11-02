import type { ReactNode } from 'react'
import { Stage, Text, type Layout } from '../../kit'
import './industries.css'

// One frame for the six industry tiles. Every still is the same hero card:
// pinned a gutter from the left, hung 6px under the title slot, run off the
// right and bottom edges of the tile. Same header, same type steps, same
// hairlines, same surface steps; only the object inside the card changes.

export type Industry = 'gems' | 'bfsi' | 'retail' | 'hospitality' | 'realestate' | 'manufacturing'

// [accent, darker shade for small text]
const ACCENT: Record<Industry, [string, string]> = {
  gems: ['#c724f2', '#b016d0'],
  bfsi: ['#459ce7', '#2f7fd0'],
  retail: ['#07c977', '#0a8f5a'],
  hospitality: ['#8a5cf0', '#6b3fd4'],
  realestate: ['#459ce7', '#2f7fd0'],
  manufacturing: ['#c724f2', '#b016d0'],
}

// Content width of the card in each layout (stage width minus both gutters
// and the card's left padding), for charts that need a pixel width
export const CONTENT_W = { wide: 336, compact: 302 }

export function IndStage({ tone, name, children }: { tone: Industry; name: string; children: (layout: Layout) => ReactNode }) {
  const [accent, text] = ACCENT[tone]
  return (
    <Stage
      width={400}
      height={260}
      compact={{ below: 400, width: 358, height: 240 }}
      accent={accent}
      className={`ind ind-${name}`}
      tokens={{
        '--ss-font': "'Geist', 'Helvetica Neue', Arial, sans-serif",
        '--ss-text-strong': '#0f0d14',
        '--ss-text': '#615d6a',
        '--ss-text-faint': '#736f7c',
        '--ss-line': 'rgba(15, 13, 20, 0.1)',
        '--ss-line-faint': 'rgba(15, 13, 20, 0.06)',
        '--ss-surface': '#ffffff',
        '--ss-canvas': '#f6f6f3',
        '--ss-well': '#f6f6f3',
        '--ss-ink-1': 'rgba(15, 13, 20, 0.04)',
        '--ss-ink-2': 'rgba(15, 13, 20, 0.06)',
        '--ss-ink-3': 'rgba(15, 13, 20, 0.08)',
        '--ss-ink-4': 'rgba(15, 13, 20, 0.11)',
        '--ss-ink-5': 'rgba(15, 13, 20, 0.16)',
        '--ss-accent-text': text,
        '--ss-success': accent,
      }}
    >
      {(_s, _r, layout) => <section className="ind-card">{children(layout)}</section>}
    </Stage>
  )
}

export function Head({ title, badge }: { title: string; badge: string }) {
  return (
    <header className="ind-head">
      <Text className="ind-title">{title}</Text>
      <Text className="ind-badge">{badge}</Text>
    </header>
  )
}
