import { PageIntro } from '../components/PageIntro'

export function TrendsPage() {
  return (
    <section className="page-section">
      <PageIntro
        eyebrow="Trends"
        title="Trends setup"
        description="Clean page structure for future charts, patient history, and comparison tools."
      />

      <div className="panel-grid dashboard-shell-grid">
        <article className="panel dashboard-shell-panel trends-shell-panel">
          <p className="eyebrow">Primary Area</p>
          <h3>Chart section</h3>
          <p>Reserved for trend graphs and longitudinal analysis components.</p>
        </article>

        <article className="panel dashboard-shell-panel trends-shell-panel">
          <p className="eyebrow">Secondary Area</p>
          <h3>Details section</h3>
          <p>Reserved for filters, comparison inputs, and supporting patient details.</p>
        </article>
      </div>
    </section>
  )
}
