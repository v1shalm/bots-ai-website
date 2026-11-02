import { Bar, Text } from '../../kit'
import { Head, IndStage } from '../_industries-shared/IndStage'
import './realestate.css'

// Real estate and construction: a cost-variance table with one site flagged.
// The flagged row carries the only words; its neighbours are placeholder rows.

const Filler = ({ a, b }: { a: number; b: number }) => (
  <div className="re-row">
    <Bar w={20} h={20} r={6} tone={2} />
    <Bar w={a} h={6} tone={3} />
    <Bar w={b} h={6} tone={2} style={{ marginLeft: 'auto' }} />
  </div>
)

export default function IndRealestate() {
  return (
    <IndStage tone="realestate" name="realestate">
      {() => (
        <>
          <Head title="Cost variance" badge="1 site flagged" />
          <div className="re-table">
            <Filler a={110} b={44} />
            <div className="re-row re-row--flag">
              <Bar w={20} h={20} r={6} tone={4} />
              <div className="re-who">
                <Text className="re-name">Whitefield tower B</Text>
                <Text className="re-sub">Over ₹42.6 crore budget</Text>
              </div>
              <Text className="ind-value re-var">+8.4%</Text>
            </div>
            <Filler a={96} b={36} />
            <Filler a={124} b={44} />
            <Filler a={88} b={40} />
          </div>
        </>
      )}
    </IndStage>
  )
}
