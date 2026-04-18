import { DoctorPrepList } from '../components/DoctorPrepList'
import { PageIntro } from '../components/PageIntro'

const questions: string[] = []

export function DoctorPrepPage() {
  return (
    <section className="page-section">
      <PageIntro
        eyebrow="Doctor Prep"
        title="Doctor prep"
        description="Questions prepared for the next clinical visit."
      />

      <DoctorPrepList questions={questions} />
    </section>
  )
}
