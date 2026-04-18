import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { BiomarkerTrend } from '../types/biomarkers'

type TrendChartsProps = {
  trends: BiomarkerTrend[]
}

export function TrendCharts({ trends }: TrendChartsProps) {
  if (trends.length === 0) {
    return (
      <div className="trend-grid">
        <article className="panel trend-card trend-card-empty">
          <div className="trend-card-head">
            <div>
              <p className="eyebrow">Trend</p>
              <h3>No trend data</h3>
            </div>
            <span className="status-badge status-badge-empty">Waiting</span>
          </div>

          <div className="trend-chart-wrap trend-chart-empty" aria-hidden="true">
            <div className="trend-empty-line" />
            <div className="trend-empty-dots">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <p className="trend-caption">Trend data will appear here.</p>
        </article>
      </div>
    )
  }

  return (
    <div className="trend-grid">
      {trends.map((trend) => {
        const firstPoint = trend.data[0]
        const lastPoint = trend.data[trend.data.length - 1]

        const allValues = trend.data.map(d => d.value)
        const refLow = firstPoint.low
        const refHigh = firstPoint.high
        const yMin = Math.min(...allValues, refLow ?? Infinity) * 0.9
        const yMax = Math.max(...allValues, refHigh ?? -Infinity) * 1.1

        return (
          <article key={trend.id} className="panel trend-card">
            <div className="trend-card-head">
              <div>
                <p className="eyebrow">Trend</p>
                <h3>{trend.name}</h3>
              </div>
              <span className={`status-badge status-badge-${trend.status}`}>
                {trend.unit}
              </span>
            </div>

            <div className="trend-chart-wrap">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart
                  data={trend.data}
                  margin={{ top: 12, right: 10, left: -18, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 33, 44, 0.08)" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={42} domain={[yMin, yMax]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '16px',
                      border: '1px solid rgba(16, 33, 44, 0.08)',
                      boxShadow: '0 18px 40px rgba(14, 45, 58, 0.08)',
                    }}
                  />
                  {firstPoint.low != null && firstPoint.high != null && (
                    <>
                      <ReferenceArea
                        y1={firstPoint.low}
                        y2={firstPoint.high}
                        fill="rgba(34, 197, 94, 0.15)"
                        stroke="rgba(34, 197, 94, 0.4)"
                        strokeDasharray="4 4"
                      />
                      <ReferenceLine y={firstPoint.high} stroke="rgba(34, 197, 94, 0.5)" strokeDasharray="4 4">
                        <Label value="Normal range" position="insideTopRight" fontSize={10} fill="rgba(34,197,94,0.8)" />
                      </ReferenceLine>
                      <ReferenceLine y={firstPoint.low} stroke="rgba(34, 197, 94, 0.5)" strokeDasharray="4 4" />
                    </>
                  )}
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#38bdf8', stroke: '#0f172a', strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="trend-caption" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.75rem' }}>
              {firstPoint.low != null && firstPoint.high != null && (
                <p style={{ margin: 0 }}>
                  <strong>Normal range:</strong> {firstPoint.low} – {firstPoint.high} {trend.unit}
                </p>
              )}
              <p style={{ margin: 0 }}>
                <strong>Latest reading:</strong> {lastPoint.value} {trend.unit}
              </p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
