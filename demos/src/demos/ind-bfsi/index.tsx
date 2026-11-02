import { Bar, Text } from '../../kit'
import { Head, IndStage } from '../_industries-shared/IndStage'
import './bfsi.css'

// BFSI: a compliance question answered, with the regulation it rests on
// cited underneath. The answer is the one big value; two sources are named.

const SOURCES: (string | number)[] = ['KYC Master Direction, para 18', 'PMLA Rules, rule 9', 120]

export default function IndBfsi() {
  return (
    <IndStage tone="bfsi" name="bfsi">
      {() => (
        <>
          <Head title="Compliance answer" badge="2 sources" />
          <div className="ind-hero">
            <div>
              <Text className="ind-label">Is video KYC allowed for a current account?</Text>
              <Text className="ind-value">Yes, with conditions</Text>
            </div>
          </div>
          <div className="bf-lines">
            <Bar w="100%" h={6} tone={2} />
            <Bar w="72%" h={6} tone={2} />
          </div>
          <div className="ind-rows">
            {SOURCES.map((s, i) => (
              <div key={i} className="ind-row">
                <span className="bf-num">{i + 1}</span>
                {typeof s === 'string' ? <Text className="ind-row__text">{s}</Text> : <Bar w={s} h={6} tone={3} />}
              </div>
            ))}
          </div>
        </>
      )}
    </IndStage>
  )
}
