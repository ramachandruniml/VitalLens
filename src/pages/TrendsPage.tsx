import { useEffect, useState } from 'react'
import { PageIntro } from '../components/PageIntro'
import { TrendCharts } from '../components/TrendCharts'
import { fetchBiomarkerTrends } from '../lib/fetchVisits'
import type { BiomarkerTrend } from '../types/biomarkers'

export function TrendsPage() {
  const [trends, setTrends] = useState<BiomarkerTrend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBiomarkerTrends()
      .then(setTrends)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="page-section">
      <PageIntro
        eyebrow="Trends"
        title="Trend charts"
        description="A longitudinal view for biomarker changes over time. Upload more reports to see trends build."
      />

      {loading ? (
        <div className="panel" style={{ color: '#94a3b8', padding: '2rem' }}>Loading…</div>
      ) : (
        <TrendCharts trends={trends} />
      )}
    </section>
  )
}
