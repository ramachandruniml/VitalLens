import { PageIntro } from '../components/PageIntro'

export function DashboardPage() {
  return (
    <section className="page-section">
      <PageIntro
        eyebrow="Dashboard"
        title="Dashboard setup"
        description="Clean page structure for future summary cards, activity feeds, and backend-connected widgets."
      />

      <div className="dashboard-shell">
        <article className="panel dashboard-shell-panel">
          <p className="eyebrow">Top Section</p>
          <h3>Summary area</h3>
          <p>This space is ready for overview cards or status modules.</p>
        </article>

        <div className="panel-grid dashboard-shell-grid">
          <article className="panel dashboard-shell-panel">
            <p className="eyebrow">Left Column</p>
            <h3>Main content area</h3>
            <p>Reserved for recent uploads, results, or dashboard content.</p>
          </article>

          <article className="panel dashboard-shell-panel">
            <p className="eyebrow">Right Column</p>
            <h3>Side panel area</h3>
            <p>Reserved for quick actions, filters, or account-related modules.</p>
          </article>
        </div>
      </div>
    </section>
  )
}
