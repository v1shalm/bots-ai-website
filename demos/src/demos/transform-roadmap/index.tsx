import { ArrowDownWideNarrow } from 'lucide-react'
import { Check, Icon, Roll, Stage, type Act } from '../../kit'
import './roadmap.css'

// Transform roadmap: AI opportunities found in a company's workflows, ranked
// by return. Beats: the list sits unsorted with its values showing; the
// cursor presses "Rank by return"; the rows glide into value order; the top
// three are marked "Pursue" in a quick stagger; the potential annual value
// rolls up to their sum a beat after each mark. Plays once and rests on the
// payoff. Values are illustrative.
//
// What makes the ranking read as one move:
// - Every row sits at its slot by a transform, so a sort is a glide, never a
//   swap or a blink. Rows travel with a small stagger by destination.
// - The sorted column marks itself (an arrow and the accent) in the same
//   beat as the press, so the cause is visible on the thing that changed.
// - The total changes after the mark that caused it (Roll's delay), digits
//   only; the rupee sign and the unit hold still.
//
// Real strings: the title, the control, three column heads, six row names
// with values and efforts, the total's label and its qualifier.

type Opp = { id: string; name: string; lakh: number; effort: 'Low' | 'Medium' | 'High' }

const OPPS: Opp[] = [
  { id: 'sales', name: 'Sales report preparation', lakh: 24, effort: 'Low' },
  { id: 'stock', name: 'Stock reconciliation', lakh: 62, effort: 'High' },
  { id: 'vendor', name: 'Vendor comparison', lakh: 16, effort: 'Medium' },
  { id: 'triage', name: 'Customer query triage', lakh: 120, effort: 'Medium' },
  { id: 'deck', name: 'Onboarding decks', lakh: 9, effort: 'Low' },
  { id: 'invoice', name: 'Invoice validation', lakh: 38, effort: 'Low' },
]
const RANKED = [...OPPS].sort((a, b) => b.lakh - a.lakh)
const TOP = RANKED.slice(0, 3).map((o) => o.id)

type S = { sorted: boolean; pursued: string[] }
const initial: S = { sorted: false, pursued: [] }
const poster: S = { sorted: true, pursued: TOP }

const money = (lakh: number) => (lakh >= 100 ? `₹${(lakh / 100).toFixed(1).replace(/\.0$/, '')} crore` : `₹${lakh} lakh`)
const crore = (lakh: number) => (lakh / 100).toFixed(2)

async function script(a: Act<S>) {
  await a.wait(1400)
  a.mark('sort')
  await a.move({ at: 'rank', x: 0.5, y: 0.5 }, { duration: 800 })
  await a.wait(180)
  await a.click({ at: 'rank', x: 0.5, y: 0.5 })
  a.put({ sorted: true })
  await a.wait(300)
  await a.move(a.layout === 'compact' ? { x: 205, y: 28 } : { x: 330, y: 32 }, { duration: 700 })
  await a.wait(1100)
  a.mark('pursue')
  await a.stagger(TOP, (id) => a.put((s) => ({ pursued: [...s.pursued, id] })), 420)
  a.mark('payoff')
  await a.wait(3400)
}

export default function TransformRoadmap() {
  return (
    <Stage<S>
      width={600}
      height={400}
      compact={{ below: 600, width: 358, height: 312 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      cursor={{ at: { wide: { x: 470, y: 330 }, compact: { x: 280, y: 270 } }, ripple: true }}
      className="rm"
    >
      {(s, _rect, layout) => {
        const compact = layout === 'compact'
        const order = s.sorted ? RANKED : OPPS
        const total = OPPS.filter((o) => s.pursued.includes(o.id)).reduce((n, o) => n + o.lakh, 0)
        return (
          <div className="rm-panel">
            <div className="rm-bar">
              <div className="rm-title">AI opportunities</div>
              <button type="button" className="rm-rank" data-target="rank" data-cursor="pointer" data-active={s.sorted || undefined} tabIndex={-1}>
                <ArrowDownWideNarrow size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
                Rank by return
              </button>
            </div>
            {!compact && (
              <div className="rm-grid rm-head">
                <span>Opportunity</span>
                <span className="rm-num rm-sortcol" data-on={s.sorted || undefined}>
                  <Icon name="chevron-down" size={12} stroke={2} className="rm-sortmark" />
                  Annual value
                </span>
                <span className="rm-effort">Effort</span>
                <span />
              </div>
            )}
            <div className="rm-list">
              {OPPS.map((o) => {
                const slot = order.indexOf(o)
                const on = s.pursued.includes(o.id)
                const dim = s.pursued.length > 0 && !on
                return (
                  <div key={o.id} className="rm-slot" style={{ transform: `translateY(${slot * 100}%)`, transitionDelay: s.sorted ? `${slot * 40}ms` : '0ms', zIndex: 1 + Math.abs(slot - OPPS.indexOf(o)) }}>
                    <div className="rm-grid rm-row" data-on={on || undefined} data-dim={dim || undefined}>
                      <span className="rm-name">{o.name}</span>
                      <span className="rm-num rm-val">{money(o.lakh)}</span>
                      <span className="rm-effort">{o.effort}</span>
                      <span className="rm-pursue" data-on={on || undefined}>
                        <Check on={on} size={16} />
                        <span className="rm-pursue-label">Pursue</span>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="rm-foot">
              <div className="rm-foot-text">
                <div className="rm-foot-label">Potential annual value</div>
                <div className="rm-foot-sub">Identified opportunity, not realised savings</div>
              </div>
              <div className="rm-total">
                <span className="rm-rupee">₹</span>
                <Roll delay={260} stagger={50}>{crore(total)}</Roll>
                <span className="rm-unit">crore</span>
              </div>
            </div>
          </div>
        )
      }}
    </Stage>
  )
}
