import { BiomarkerCards } from '../components/BiomarkerCards'
import { PageIntro } from '../components/PageIntro'
import type { BiomarkerResult } from '../types/biomarkers'

const biomarkers: BiomarkerResult[] = []

export function DashboardPage() {
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
          <h3>Biomarker results</h3>
          <p>Clinical metrics and interpretation.</p>
        </article>

        <BiomarkerCards biomarkers={biomarkers} />
      </div>
    </section>
  )
}
