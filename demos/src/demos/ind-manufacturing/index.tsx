import { Chart, Text } from '../../kit'
import { CONTENT_W, Head, IndStage } from '../_industries-shared/IndStage'
import './manufacturing.css'

// Manufacturing: an OEE baseline over twelve weeks, with the target as a
// dashed line above it. The baseline value is the one big number.

const DATA = [58, 60, 57, 63, 65, 62, 66, 68, 67, 70, 69, 72]
const MAX = 90
const H = 150
const TARGET = 85

export default function IndManufacturing() {
  const top = 4 + (H - 8) * (1 - TARGET / MAX)
  return (
    <IndStage tone="manufacturing" name="manufacturing">
      {(layout) => (
        <>
          <Head title="OEE baseline, line 3" badge="Baseline set" />
          <div className="ind-hero">
            <div>
              <Text className="ind-label">Last 12 weeks</Text>
              <Text className="ind-value">72%</Text>
            </div>
          </div>
          <div className="mf-plot" style={{ height: H }}>
            {[0.25, 0.5, 0.75].map((f) => (
              <span key={f} className="mf-grid" style={{ top: f * H }} />
            ))}
            <span className="mf-target" style={{ top }} />
            <Text className="mf-tag" style={{ top: top - 20 }}>Target 85%</Text>
            <Chart data={DATA} max={MAX} width={CONTENT_W[layout]} height={H} />
          </div>
        </>
      )}
    </IndStage>
  )
}
