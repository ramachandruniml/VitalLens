import { TrendCharts } from '../components/TrendCharts'
import { PageIntro } from '../components/PageIntro'
import type { BiomarkerTrend } from '../types/biomarkers'

const trends: BiomarkerTrend[] = []

export function TrendsPage() {
  return (
    <section className="page-section">
      <PageIntro
        eyebrow="Trends"
        title="Trend charts"
        description="A longitudinal view for biomarker changes over time."
      />

      <TrendCharts trends={trends} />
    </section>
  )
}
