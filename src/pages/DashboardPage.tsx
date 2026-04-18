import { useEffect, useState } from 'react'
import { BiomarkerCards } from '../components/BiomarkerCards'
import { PageIntro } from '../components/PageIntro'
import { clearAllVisits, fetchAllVisitsGrouped, type VisitGroup } from '../lib/fetchVisits'

export function DashboardPage() {
  const [visits, setVisits] = useState<VisitGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)

  useEffect(() => {
    fetchAllVisitsGrouped()
      .then(v => setVisits(v.slice().reverse())) // newest first
      .finally(() => setLoading(false))
  }, [])

  async function handleClear() {
    if (!confirm('Delete all uploaded reports and biomarker data? This cannot be undone.')) return
    setClearing(true)
    try {
      await clearAllVisits()
      localStorage.removeItem('doctor-prep-questions')
      setVisits([])
    } finally {
      setClearing(false)
    }
  }

  return (
    <section className="page-section">
      <PageIntro
        eyebrow="Dashboard"
        title="Biomarker dashboard"
        description="All uploaded lab reports and their biomarker results."
      />

      <div className="dashboard-shell">
        <article className="panel dashboard-shell-panel dashboard-shell-hero">
          <p className="eyebrow">Overview</p>
          <h3>{visits.length} report{visits.length !== 1 ? 's' : ''} uploaded</h3>
          <p>Each upload is shown below with its biomarkers.</p>
          {visits.length > 0 && (
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
        ) : visits.length === 0 ? (
          <div className="panel biomarker-card" style={{ color: '#94a3b8', padding: '2rem' }}>
            No reports uploaded yet.
          </div>
        ) : (
          visits.map(visit => (
            <div key={visit.id}>
              <p className="eyebrow" style={{ margin: '1.5rem 0 0.5rem' }}>{visit.label}</p>
              <BiomarkerCards biomarkers={visit.biomarkers} />
            </div>
          ))
        )}
      </div>
    </section>
  )
}
