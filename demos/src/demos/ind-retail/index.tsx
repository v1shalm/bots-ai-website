import { Text } from '../../kit'
import { Head, IndStage } from '../_industries-shared/IndStage'
import './retail.css'

// Retail: a leadership summary with sales by region. The leading region is
// the solid bar; the others sit a step back in the same hue.

const REGIONS = [
  { name: 'West', v: 100, lead: true },
  { name: 'South', v: 78 },
  { name: 'North', v: 61 },
  { name: 'East', v: 44 },
]

export default function IndRetail() {
  return (
    <IndStage tone="retail" name="retail">
      {() => (
        <>
          <Head title="Net sales summary" badge="Ready to send" />
          <div className="ind-hero">
            <div>
              <Text className="ind-label">This week</Text>
              <Text className="ind-value">₹18.4 crore</Text>
            </div>
            <Text className="ind-delta">+6.2% vs last week</Text>
          </div>
          <div className="rt-rows">
            {REGIONS.map((r) => (
              <div key={r.name} className="rt-row">
                <Text className="rt-name">{r.name}</Text>
                <span className="rt-track">
                  <span className="rt-bar" data-lead={r.lead || undefined} style={{ width: `${r.v}%` }} />
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </IndStage>
  )
}
