import { Bar, Check, Text } from '../../kit'
import { Head, IndStage } from '../_industries-shared/IndStage'
import './gems.css'

// Gems and jewellery: an invoice whose checks have all passed. The total is
// the one big value; two checks are named, the rest are placeholder lines.

const CHECKS: (string | number)[] = ['GSTIN matches supplier', 'Weight 18.40 g within tolerance', 118, 92]

export default function IndGems() {
  return (
    <IndStage tone="gems" name="gems">
      {() => (
        <>
          <Head title="Invoice 2481" badge="Validated" />
          <div className="ind-hero">
            <div>
              <Text className="ind-label">Invoice total</Text>
              <Text className="ind-value">₹4,82,000</Text>
            </div>
          </div>
          <div className="ind-rows">
            {CHECKS.map((c, i) => (
              <div key={i} className="ind-row">
                <Check on size={16} />
                {typeof c === 'string' ? <Text className="ind-row__text">{c}</Text> : <Bar w={c} h={6} tone={3} />}
              </div>
            ))}
          </div>
        </>
      )}
    </IndStage>
  )
}
