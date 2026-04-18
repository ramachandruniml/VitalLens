import { Copy, Printer } from 'lucide-react'

type DoctorPrepListProps = {
  questions: string[]
}

export function DoctorPrepList({ questions }: DoctorPrepListProps) {
  const copyQuestions = async () => {
    if (questions.length === 0) {
      return
    }

    if (!navigator.clipboard) {
      return
    }

    await navigator.clipboard.writeText(
      questions.map((question, index) => `${index + 1}. ${question}`).join('\n'),
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
          questions.map((question, index) => (
            <article key={question} className="panel doctor-question-card">
              <span className="question-index">{index + 1}</span>
              <p>{question}</p>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
