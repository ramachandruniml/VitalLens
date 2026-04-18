import { useEffect, useState } from 'react'
import { PageIntro } from '../components/PageIntro'
import { TrendCharts } from '../components/TrendCharts'
import { clearAllVisits, fetchBiomarkerTrends } from '../lib/fetchVisits'
import type { BiomarkerTrend } from '../types/biomarkers'

export function TrendsPage() {
  const [trends, setTrends] = useState<BiomarkerTrend[]>([])
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)

  useEffect(() => {
    fetchBiomarkerTrends()
      .then(setTrends)
      .finally(() => setLoading(false))
  }, [])

  async function handleClear() {
    if (!confirm('Delete all uploaded reports and trend data? This cannot be undone.')) return
    setClearing(true)
    try {
      await clearAllVisits()
      setTrends([])
    } finally {
      setClearing(false)
    }
  }

  return (
    <section className="page-section">
      <PageIntro
        eyebrow="Trends"
        title="Trend charts"
        description="A longitudinal view for biomarker changes over time. Upload more reports to see trends build."
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        {trends.length > 0 && (
          <button
            onClick={handleClear}
            disabled={clearing}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: '#7f1d1d',
              color: '#fca5a5',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            {clearing ? 'Clearing…' : 'Clear trends'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="panel" style={{ color: '#94a3b8', padding: '2rem' }}>Loading…</div>
      ) : (
        <TrendCharts trends={trends} />
      )}
    </section>
  )
}
