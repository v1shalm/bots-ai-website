import { ArrowUp, FileSpreadsheet, Paperclip } from 'lucide-react'
import { Bar, Check, Collapse, Count, Field, Stage, States, Stream, Text, Window, type Act, type Layout } from '../../kit'
import './train-session.css'

// A live training session workspace. A participant brings their own weekly
// task: the team's sales file is attached, the request is typed and sent, the
// answer streams in at its own height, the participant marks it for Monday's
// report, and the session tracker beside it rolls from 4 to 5 while the solved
// task joins the list. Plays once; the still is the payoff.
//
// Real strings: file name, request, answer line, the action, the tracker label
// and the solved task. Everything else is placeholder bars.

const FILE = 'Store sales, week 42.xlsx'
const Q = "Summarise this week's sales by region for the leadership call"
const A = 'West led at ₹18,40,000, up 6% on week 41. South was the only region to fall.'
const AC = 'West led at ₹18,40,000, up 6% on week 41.'
const WORDS = A.split(' ').length
const WORDS_C = AC.split(' ').length
const TASK = 'Weekly sales summary'

type S = {
  attached: boolean
  draft: string
  sent: boolean
  phase: 'idle' | 'thinking' | 'answer'
  words: number
  table: boolean
  action: boolean
  done: boolean
  solved: number
  joined: boolean
}

const initial: S = { attached: false, draft: '', sent: false, phase: 'idle', words: 0, table: false, action: false, done: false, solved: 4, joined: false }
const poster: S = { attached: false, draft: '', sent: true, phase: 'answer', words: 99, table: true, action: true, done: true, solved: 5, joined: true }

async function script(a: Act<S>) {
  const compact = a.layout === 'compact'
  await a.wait(800)

  // 1. The team's file is attached
  a.mark('attach')
  await a.move({ at: 'attach', x: 0.7, y: 0.75 })
  await a.click()
  await a.set({ attached: true })
  await a.wait(650)

  // 2. The request is typed
  a.mark('type')
  await a.type('draft', Q, { interval: 30 })
  await a.wait(350)

  // 3. Sent: the message lands, the file goes with it
  a.mark('send')
  await a.move({ at: 'send', x: 0.7, y: 0.75 })
  await a.click()
  a.put({ sent: true, draft: '', attached: false })
  await a.wait(500)
  a.put({ phase: 'thinking' })
  await a.wait(1000)

  // 4. The answer streams in at its own height, then its table
  a.mark('stream')
  a.put({ phase: 'answer' })
  const n = compact ? WORDS_C : WORDS
  for (let i = 1; i <= n; i++) {
    a.put({ words: i })
    await a.wait(42)
  }
  await a.wait(250)
  a.mark('table')
  a.put({ table: true })
  await a.wait(650)
  a.put({ action: true })
  await a.wait(750)

  // 5. Marked for Monday's report
  a.mark('use')
  await a.move({ at: 'use', x: 0.9, y: 0.75 })
  await a.click()
  a.put({ done: true })
  await a.wait(750)

  // 6. Payoff: the tracker rolls up and the task joins the list
  a.mark('payoff')
  a.put({ solved: 5, joined: true })
  await a.wait(3600)
}

export default function TrainSession() {
  return (
    <Stage<S>
      width={600}
      height={400}
      compact={{ below: 560, width: 358, height: 400 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      accent="#07c977"
      tokens={{
        '--ss-font': "'Geist', 'Helvetica Neue', Arial, sans-serif",
        '--ss-text-strong': '#0f0d14',
        '--ss-text': '#615d6a',
        '--ss-text-faint': '#736f7c',
        '--ss-accent-text': '#0a8f5a',
        '--ss-success': '#07c977',
        '--ss-line': 'rgba(15, 13, 20, 0.1)',
        '--ss-surface': '#ffffff',
      }}
      cursor={{ at: { wide: { x: 300, y: 250 }, compact: { x: 200, y: 200 } }, style: 'arrow', ripple: true }}
      className="ts"
    >
      {(s, _rect, layout) => {
        const compact = layout === 'compact'
        return (
          <Window title="Live session" className="ts-win" body={{ className: 'ts-body' }}>
            <div className="ts-main">
              {compact && <Tracker s={s} layout={layout} />}
              <div className="ts-thread">
                <Collapse open={s.sent} reveal="drop" from="below">
                  <div className="ts-msg">
                    {!compact && (
                      <span className="ts-file ts-file--sent">
                        <FileSpreadsheet size={14} strokeWidth={1.5} />
                        <Text>{FILE}</Text>
                      </span>
                    )}
                    <div className="ts-q">
                      <Text>{Q}</Text>
                    </div>
                  </div>
                </Collapse>
                <Collapse open={s.phase === 'thinking'}>
                  <Text className="ts-thinking">Thinking</Text>
                </Collapse>
                <Collapse open={s.phase === 'answer'}>
                  <div className="ts-a">
                    <Stream className="ts-stream" text={compact ? AC : A} count={s.words} />
                    <Collapse open={s.table}>
                      <Results compact={compact} on={s.table} />
                    </Collapse>
                    <Collapse open={s.action} reveal="drop">
                      <div className="ts-actions">
                        <States
                          data-target="use"
                          className="ts-use"
                          data-done={s.done || undefined}
                          value={s.done ? 'done' : 'ready'}
                          states={{
                            ready: <span className="ts-use__row">Use in Monday&apos;s report</span>,
                            done: (
                              <span className="ts-use__row">
                                <Check on={s.done} size={14} />
                                Added to report
                              </span>
                            ),
                          }}
                        />
                      </div>
                    </Collapse>
                  </div>
                </Collapse>
              </div>
              <div className="ts-dock">
                <Collapse open={s.attached} reveal="drop">
                  <div className="ts-attached">
                    <span className="ts-file">
                      <FileSpreadsheet size={14} strokeWidth={1.5} />
                      <Text>{FILE}</Text>
                    </span>
                  </div>
                </Collapse>
              <Field
                className="ts-composer"
                value={s.draft}
                placeholder="Ask about your work"
                focused={!s.sent}
                box={{ 'data-cursor': 'ibeam' }}
                leading={
                  <>
                    <span className="ts-attach" data-target="attach" data-cursor="pointer">
                      <Paperclip size={15} strokeWidth={1.5} />
                    </span>
                  </>
                }
                trailing={
                  <span className="ts-send" data-target="send" data-cursor="pointer" data-ready={s.draft.length > 0 || undefined}>
                    <ArrowUp size={15} strokeWidth={1.75} />
                  </span>
                }
              />
              </div>
            </div>
            {!compact && <Tracker s={s} layout={layout} />}
          </Window>
        )
      }}
    </Stage>
  )
}

/** A small table as bars: the biggest region is the accent one. */
function Results({ compact, on }: { compact: boolean; on: boolean }) {
  const rows = compact ? [78, 58, 44] : [78, 58, 44]
  return (
    <div className="ts-results" data-on={on || undefined} data-compact={compact || undefined}>
      {rows.map((w, i) => (
        <div className="ts-results__row" key={i} style={{ ['--i' as string]: i }}>
          <Bar w={compact ? 26 : 34} h={6} r={3} tone={2} />
          <span className="ts-track">
            <span className="ts-fill" data-lead={i === 0 || undefined} style={{ ['--w' as string]: `${w}%` }} />
          </span>
          <Bar w={compact ? 28 : 36} h={6} r={3} tone={3} />
        </div>
      ))}
    </div>
  )
}

const PREV = [96, 128, 84, 112]

function Tracker({ s, layout }: { s: S; layout: Layout }) {
  if (layout === 'compact') {
    return (
      <div className="ts-track-c">
        <div className="ts-track-c__top">
          <span className="ts-label">Use cases solved live</span>
          <Count className="ts-num ts-num--c" value={s.solved} duration={650} format={(n) => String(Math.round(n))} />
        </div>
        <States
          className="ts-track-c__line"
          value={s.joined ? 'new' : 'prev'}
          align="start"
          states={{
            prev: (
              <span className="ts-solved">
                <Check on size={14} />
                <Bar w={104} h={7} r={3.5} tone={3} />
              </span>
            ),
            new: (
              <span className="ts-solved">
                <Check on={s.joined} size={14} />
                <Text className="ts-solved__t">{TASK}</Text>
              </span>
            ),
          }}
        />
      </div>
    )
  }
  return (
    <aside className="ts-side">
      <span className="ts-label">Use cases solved live</span>
      <Count className="ts-num" value={s.solved} duration={650} format={(n) => String(Math.round(n))} />
      <div className="ts-list">
        <Collapse open={s.joined} reveal="drop">
          <div className="ts-solved ts-solved--new">
            <Check on={s.joined} size={16} />
            <Text className="ts-solved__t">{TASK}</Text>
          </div>
        </Collapse>
        {PREV.map((w, i) => (
          <div className="ts-solved" key={i}>
            <Check on size={16} />
            <Bar w={w} h={7} r={3.5} tone={i % 2 ? 2 : 3} />
          </div>
        ))}
      </div>
    </aside>
  )
}
