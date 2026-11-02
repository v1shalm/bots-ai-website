import { Avatar, Bar, Badge, Check, Collapse, Count, Icon, Row, Spinner, Stage, States, Text, Window, type Act } from '../../kit'
import './build-agent.css'

// A custom invoice agent working a finance queue. A supplier invoice arrives at
// the top, the agent ticks its checks one by one, the amount check needs a
// person, the person approves, and the invoice posts to the ERP while the
// day's counter rolls up by one. An illustration of the kind of work an agent
// takes on, not a claim about any client.
//
// Real strings: the supplier and invoice, the three checks, the review reason,
// the two buttons, the status words, the counter label.

type S = {
  arrived: boolean
  checksOpen: boolean
  // how many checks have finished, and which one is being checked (-1: none)
  done: number
  pending: number
  review: boolean
  approved: boolean
  posted: boolean
  count: number
}

const START: S = { arrived: false, checksOpen: false, done: 0, pending: -1, review: false, approved: false, posted: false, count: 23 }
const POSTER: S = { arrived: true, checksOpen: true, done: 3, pending: -1, review: true, approved: true, posted: true, count: 24 }

async function script(a: Act<S>) {
  await a.wait(800)
  a.mark('arrive')
  await a.set({ arrived: true })
  await a.wait(1500)

  a.mark('checks')
  await a.set({ checksOpen: true })
  await a.wait(700)
  await a.set({ pending: 0 })
  await a.wait(750)
  await a.set({ done: 1, pending: 1 })
  await a.wait(750)
  await a.set({ done: 2, pending: 2 })
  await a.wait(900)

  // The amount check cannot clear on its own: the line says why, the status
  // changes on its own pill, and the person's two actions open under it
  a.mark('review')
  await a.set({ pending: -1, review: true })
  await a.wait(1700)

  a.mark('approve')
  await a.click({ at: 'approve', x: 0.72, y: 0.62 })
  await a.set({ approved: true, done: 3 })
  await a.wait(500)
  a.mark('posted')
  await a.set({ posted: true })
  await a.wait(550)
  await a.set({ count: 24 })
  a.move({ at: 'rest', x: 0.5, y: 0.5 })
  await a.wait(3600)
}

type Status = 'new' | 'checking' | 'review' | 'posted'

function StatusPill({ status }: { status: Status }) {
  return (
    <States
      className="ba-status"
      align="end"
      value={status}
      states={{
        new: <Badge tone="neutral">Received</Badge>,
        checking: <Badge tone="neutral" icon={<Spinner size={11} />}>Checking</Badge>,
        review: <Badge tone="warning" dot>Needs review</Badge>,
        posted: <Badge tone="success" icon={<Icon name="check" filled size={11} />}>Posted to ERP</Badge>,
      }}
    />
  )
}

function Line({ lead, children, tone }: { lead: React.ReactNode; children: React.ReactNode; tone?: 'wait' | 'done' }) {
  return (
    <div className="ba-line" data-tone={tone}>
      <span className="ba-line__lead">{lead}</span>
      {children}
    </div>
  )
}

function Checks({ s }: { s: S }) {
  const third = s.approved ? 'ok' : s.review ? 'review' : 'check'
  return (
    <div className="ba-checks">
      <Line lead={<Check on={s.done >= 1} pending={s.pending === 0} size={16} />} tone={s.done >= 1 ? 'done' : undefined}>
        Matches PO-4471
      </Line>
      <Line lead={<Check on={s.done >= 2} pending={s.pending === 1} size={16} />} tone={s.done >= 2 ? 'done' : undefined}>
        GST number valid
      </Line>
      <Line
        lead={
          <States
            value={s.review && !s.approved ? 'wait' : 'check'}
            states={{
              check: <Check on={s.done >= 3} pending={s.pending === 2} size={16} />,
              wait: <Icon name="clock" filled size={16} className="ba-wait" />,
            }}
          />
        }
        tone={third === 'review' ? 'wait' : s.done >= 3 ? 'done' : undefined}
      >
        <States
          align="start"
          value={third}
          states={{
            check: 'Amount within tolerance',
            review: '₹1,200 above the PO amount',
            ok: 'Amount approved',
          }}
        />
      </Line>
    </div>
  )
}

const FILLER = [
  { name: 78, sub: 44, amt: 40 },
  { name: 62, sub: 38, amt: 46 },
  { name: 86, sub: 50, amt: 40 },
  { name: 70, sub: 42, amt: 46 },
]

function Filler({ f, compact }: { f: (typeof FILLER)[number]; compact: boolean }) {
  return (
    <Row
      pad={12}
      lead={<Avatar plain size={24} />}
      title={<Bar w={f.name} h={6} tone={3} />}
      subtitle={<Bar w={f.sub} h={5} tone={2} />}
    >
      <span className="ba-cols">
        {!compact && <Bar w={f.amt} h={6} tone={3} className="ba-amt" />}
        <Bar w={64} h={18} r={9} tone={2} className="ba-pill" />
      </span>
    </Row>
  )
}

function Sidebar() {
  return (
    <div className="ba-side">
      {[44, 58, 40, 52, 36].map((w, i) => (
        <div key={i} className="ba-nav" data-on={i === 1 || undefined}>
          <Bar w={11} h={11} r={3} tone={i === 1 ? 4 : 3} />
          <Bar w={w} h={5} tone={i === 1 ? 4 : 2} />
        </div>
      ))}
    </div>
  )
}

export default function BuildAgent() {
  return (
    <Stage<S>
      width={600}
      height={400}
      compact={{ below: 480, width: 358, height: 300 }}
      initial={START}
      poster={POSTER}
      script={script}
      play="once"
      cursor={{ at: { wide: { x: 470, y: 330 }, compact: { x: 280, y: 262 } } }}
      className="ba"
    >
      {(s, _rect, layout) => {
        const compact = layout === 'compact'
        const status: Status = s.posted ? 'posted' : s.review ? 'review' : s.checksOpen ? 'checking' : 'new'
        return (
          <Window className="ba-win" sidebar={compact ? undefined : <Sidebar />} sidebarWidth={120}>
            <div className="ba-main">
              <div className="ba-head">
                <Text className="ba-title">Invoice queue</Text>
                <div className="ba-counter">
                  <span className="ba-counter__label">Posted today</span>
                  <Count className="ba-counter__value" value={s.count} duration={900} />
                </div>
              </div>
              <div className="ba-list">
                <Collapse open={s.arrived} reveal="drop">
                  <div className="ba-card" data-status={status}>
                    <Row
                      pad={12}
                      lead={<Avatar name="Kaveri Packaging" size={24} />}
                      title="Kaveri Packaging"
                      subtitle={compact ? 'INV-2291 · ₹1,24,500' : 'INV-2291'}
                    >
                      <span className="ba-cols">
                        {!compact && <span className="ba-amt ba-money">₹1,24,500</span>}
                        <StatusPill status={status} />
                      </span>
                    </Row>
                    <Collapse open={s.checksOpen}>
                      <Checks s={s} />
                    </Collapse>
                    <Collapse open={s.review && !s.approved}>
                      <div className="ba-actions">
                        <span className="ba-btn ba-btn--primary" data-target="approve">Approve</span>
                        <span className="ba-btn" data-target="reject">Reject</span>
                      </div>
                    </Collapse>
                  </div>
                </Collapse>
                {FILLER.map((f, i) => (
                  <Filler key={i} f={f} compact={compact} />
                ))}
              </div>
              <span className="ba-rest" data-target="rest" />
            </div>
          </Window>
        )
      }}
    </Stage>
  )
}
