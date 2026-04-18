import { Copy, Printer } from 'lucide-react'
import type { DoctorQuestion } from '../lib/generateQuestions'

type DoctorPrepListProps = {
  questions: DoctorQuestion[]
}

export function DoctorPrepList({ questions }: DoctorPrepListProps) {
  const copyQuestions = async () => {
    if (!questions.length || !navigator.clipboard) return
    await navigator.clipboard.writeText(
      questions.map((q, i) => `${i + 1}. ${q.question}`).join('\n'),
    )
  }

  return (
    <section className="doctor-prep">
      <div className="doctor-prep-head">
        <div>
          <p className="eyebrow">Doctor Prep</p>
          <h3>Questions for the next visit</h3>
        </div>

        <div className="doctor-prep-actions">
          <button type="button" className="ghost-button" onClick={copyQuestions}>
            <Copy size={16} />
            Copy
          </button>
          <button type="button" className="primary-button" onClick={() => window.print()}>
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      <div className="doctor-prep-list">
        {questions.length === 0 ? (
          <article className="panel doctor-question-card doctor-question-card-empty">
            <span className="question-index">--</span>
            <p>No questions available.</p>
          </article>
        ) : (
          questions.map((q, index) => (
            <article key={index} className="panel doctor-question-card">
              <span className="question-index">{index + 1}</span>
              <div>
                <span style={{
                  display: 'inline-block',
                  marginBottom: '0.4rem',
                  padding: '2px 10px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: '#0c4a6e',
                  color: '#7dd3fc',
                  letterSpacing: '0.03em',
                }}>
                  {q.tag}
                </span>
                <p style={{ margin: 0 }}>{q.question}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
