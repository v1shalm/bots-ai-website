import { Bar, Text } from '../../kit'
import { Head, IndStage } from '../_industries-shared/IndStage'
import './hospitality.css'

// Hospitality: three vendor quotes stacked at one width, the recommended one
// lifted onto a white card with its price; the others stay filled and quiet.

export default function IndHospitality() {
  return (
    <IndStage tone="hospitality" name="hospitality">
      {() => (
        <>
          <Head title="Vendor comparison" badge="3 quotes" />
          <div className="hs-stack">
            <div className="hs-card hs-card--pick">
              <div className="hs-who">
                <Text className="hs-name">Sagar Provisions</Text>
                <Text className="hs-tag">Recommended</Text>
              </div>
              <Text className="ind-value hs-price">₹212/kg</Text>
            </div>
            {[
              [104, 52],
              [86, 44],
              [96, 48],
            ].map(([a, b], i) => (
              <div key={i} className="hs-card">
                <Bar w={a} h={6} tone={3} />
                <Bar w={b} h={6} tone={3} />
              </div>
            ))}
          </div>
        </>
      )}
    </IndStage>
  )
}
