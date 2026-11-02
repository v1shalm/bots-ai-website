import { Stage, Window, Bar, Avatar, Check, Swap, type Act } from '../../kit'
import './sustain.css'

// BOTS.AI, school for AI trainers: the handover, shown as an illustration.
// A cohort of internal trainer candidates. One final assessment completes,
// the candidate becomes a certified trainer, and the next session's "Led by"
// slot passes from the external facilitator to that person. No cursor: the
// cause of each change is the previous change, so each beat starts as the
// last one settles. The payoff (the client's own trainer leading) holds.

type S = {
  pending: boolean // the assessment is being graded
  full: boolean // Priya's progress reaches the end
  cert: boolean // certified trainer lands on her row
  go: boolean // her name travels to the session slot
  landed: boolean // the real name sits in the slot
  inside: boolean // the slot's tag reads Internal
}

const START: S = { pending: false, full: false, cert: false, go: false, landed: false, inside: false }
const END: S = { pending: false, full: true, cert: true, go: false, landed: true, inside: true }

const PEOPLE = [
  { name: 'Arjun K.', fill: 0.7, bar: 58 },
  { name: 'Priya S.', fill: 0.88, bar: 0 },
  { name: 'Meera N.', fill: 0.5, bar: 46 },
  { name: 'Kabir D.', fill: 0.28, bar: 62 },
]

const SESSIONS = [{ bar: 128 }, { bar: 104 }, { bar: 144 }]

const script = async (a: Act<S>) => {
  await a.wait(1600)
  a.mark('grading')
  a.put({ pending: true }) // her assessment is being graded
  await a.wait(1400)
  a.mark('fill')
  a.put({ full: true }) // progress fills slowly to complete
  await a.wait(2300)
  a.mark('certified')
  a.put({ pending: false, cert: true }) // the check lands, the label changes
  await a.wait(2700)
  a.mark('handover')
  a.put({ go: true }) // her name leaves her row for the session slot
  await a.wait(1050)
  a.put({ landed: true, go: false }) // the real name takes the slot
  await a.wait(450)
  a.put({ inside: true }) // the tag follows
}

export default function SustainCert() {
  return (
    <Stage<S>
      width={600}
      height={400}
      compact={{ below: 520, width: 358, height: 300 }}
      initial={START}
      play="once"
      poster={END}
      script={script}
      className="sc"
    >
      {(s, rect) => {
        const src = rect('who-src')
        const dst = rect('who-dst')
        return (
          <>
            <Window
              className="sc-win"
              title="Learning workspace"
              toolbar={<Bar w={44} h={6} tone={2} />}
              body={{ className: 'sc-body' }}
            >
              <section className="sc-sec">
                <header className="sc-head">
                  <span className="sc-strong">Trainer cohort</span>
                  <Bar w={52} h={6} tone={2} />
                </header>
                {PEOPLE.map((p, i) => {
                  const hero = p.name === 'Priya S.'
                  return (
                    <div key={p.name} className="sc-row sc-cohort" data-cert={(hero && s.cert) || undefined} data-n={i}>
                      <span className="sc-who" data-target={hero ? 'who-src' : undefined}>
                        <Avatar name={p.name} size={20} />
                        <span>{p.name}</span>
                      </span>
                      <span className="sc-track">
                        <span
                          className="sc-fill"
                          data-hero={hero || undefined}
                          data-cert={(hero && s.cert) || undefined}
                          style={{ transform: `scaleX(${hero ? (s.full ? 1 : p.fill) : p.fill})` }}
                        />
                      </span>
                      <span className="sc-status">
                        {hero ? (
                          <span className="sc-state" data-cert={s.cert || undefined}>
                            <Check on={s.cert} pending={s.pending} size={14} />
                            <Swap id={s.cert ? 'cert' : 'assess'}>{s.cert ? 'Certified trainer' : 'Final assessment'}</Swap>
                          </span>
                        ) : (
                          <Bar w={p.bar} h={6} tone={2} />
                        )}
                      </span>
                    </div>
                  )
                })}
              </section>

              <section className="sc-sec sc-sched">
                <header className="sc-head sc-sessrow">
                  <span className="sc-strong">Next week</span>
                  <span className="sc-led">Led by</span>
                </header>
                {SESSIONS.map((x, i) => (
                  <div key={i} className="sc-row sc-sessrow" data-n={i}>
                    <span className="sc-when">
                      <Bar w={26} h={6} tone={3} />
                      <Bar w={x.bar} h={6} tone={2} />
                    </span>
                    {i === 0 ? (
                      <span className="sc-slot">
                        <span className="sc-stack">
                          <span className="sc-who sc-ext" data-gone={s.go || s.landed || undefined}>
                            <Avatar name="Dev M." size={20} />
                            <span>Dev M.</span>
                          </span>
                          <span className="sc-who sc-new" data-target="who-dst" data-on={s.landed || undefined}>
                            <Avatar name="Priya S." size={20} />
                            <span>Priya S.</span>
                          </span>
                        </span>
                        <span className="sc-tag">
                          <Swap id={s.inside ? 'in' : 'ex'}>{s.inside ? 'Internal' : 'External'}</Swap>
                        </span>
                      </span>
                    ) : (
                      <span className="sc-slot">
                        <Avatar plain size={20} />
                        <Bar w={i === 1 ? 42 : 36} h={6} tone={2} />
                      </span>
                    )}
                  </div>
                ))}
              </section>
            </Window>

            {src.width > 0 && dst.width > 0 && !s.landed && (
              <Flyer s={s} src={src} dst={dst} />
            )}
          </>
        )
      }}
    </Stage>
  )
}

import { Fly, type Rect } from '../../kit'
function Flyer({ s, src, dst }: { s: S; src: Rect; dst: Rect }) {
  return (
    <Fly from={src} to={dst} go={s.go} duration={1000}>
      <span className="sc-who sc-fly">
        <Avatar name="Priya S." size={20} />
        <span>Priya S.</span>
      </span>
    </Fly>
  )
}
