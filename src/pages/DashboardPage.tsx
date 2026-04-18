import { useEffect, useState } from 'react'
import { BiomarkerCards } from '../components/BiomarkerCards'
import { PageIntro } from '../components/PageIntro'
import { clearAllVisits, fetchLatestBiomarkers } from '../lib/fetchVisits'
import type { BiomarkerResult } from '../types/biomarkers'

export function DashboardPage() {
  const [biomarkers, setBiomarkers] = useState<BiomarkerResult[]>([])
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)

  useEffect(() => {
    fetchLatestBiomarkers()
      .then(setBiomarkers)
      .finally(() => setLoading(false))
  }, [])

  async function handleClear() {
    if (!confirm('Delete all uploaded reports and biomarker data? This cannot be undone.')) return
    setClearing(true)
    try {
      await clearAllVisits()
      setBiomarkers([])
    } finally {
      setClearing(false)
    }
  }

  return (
    <section className="page-section">
      <PageIntro
        eyebrow="Dashboard"
        title="Biomarker dashboard"
        description="A structured view for biomarker results and clinical summaries."
      />

      <div className="dashboard-shell">
        <article className="panel dashboard-shell-panel dashboard-shell-hero">
          <p className="eyebrow">Overview</p>
          <h3>Latest results</h3>
          <p>Most recent lab report biomarkers.</p>
          {biomarkers.length > 0 && (
            <button
              onClick={handleClear}
              disabled={clearing}
              style={{
                marginTop: '1rem',
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
              {clearing ? 'Clearing…' : 'Clear all data'}
            </button>
          )}
        </article>

        {loading ? (
          <div className="panel biomarker-card" style={{ color: '#94a3b8', padding: '2rem' }}>
            Loading…
          </div>
        ) : (
          <BiomarkerCards biomarkers={biomarkers} />
        )}
      </div>
    </section>
  )
}
