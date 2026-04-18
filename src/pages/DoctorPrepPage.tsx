import { useEffect, useState } from 'react'
import { DoctorPrepList } from '../components/DoctorPrepList'
import { PageIntro } from '../components/PageIntro'
import { generateDoctorQuestions } from '../lib/generateQuestions'

export function DoctorPrepPage() {
  const [questions, setQuestions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const q = await generateDoctorQuestions()
      setQuestions(q)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <section className="page-section">
      <PageIntro
        eyebrow="Doctor Prep"
        title="Doctor prep"
        description="Questions generated from your concerning biomarkers — bring these to your next visit."
      />

      {loading ? (
        <div className="panel" style={{ color: '#94a3b8', padding: '2rem' }}>
          Generating questions…
        </div>
      ) : error ? (
        <div className="panel" style={{ color: '#f87171', padding: '2rem' }}>
          {error}
          <br />
          <button
            onClick={load}
            style={{ marginTop: '1rem', padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none', background: '#334155', color: '#f1f5f9', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
            <button
              onClick={load}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#334155', color: '#f1f5f9', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
            >
              Regenerate
            </button>
          </div>
          <DoctorPrepList questions={questions} />
        </>
      )}
    </section>
  )
}
