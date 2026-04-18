import type { BiomarkerResult } from '../types/biomarkers'

type BiomarkerCardsProps = {
  biomarkers: BiomarkerResult[]
}

const statusLabels: Record<BiomarkerResult['status'], string> = {
  normal: 'In range',
  watch: 'Watch',
  high: 'High',
}

export function BiomarkerCards({ biomarkers }: BiomarkerCardsProps) {
  if (biomarkers.length === 0) {
    return (
      <div className="biomarker-grid">
        <article className="panel biomarker-card biomarker-card-empty">
          <div className="biomarker-card-head">
            <div>
              <p className="eyebrow">Biomarker</p>
              <h3>No results available</h3>
            </div>
            <span className="status-badge status-badge-empty">Waiting</span>
          </div>

          <div className="biomarker-value-row">
            <strong>--</strong>
            <span>unit</span>
          </div>

          <p className="biomarker-explainer">Results will appear here.</p>
        </article>
      </div>
    )
  }

  return (
    <div className="biomarker-grid">
      {biomarkers.map((biomarker) => (
        <article key={biomarker.id} className="panel biomarker-card">
          <div className="biomarker-card-head">
            <div>
              <p className="eyebrow">Biomarker</p>
              <h3>{biomarker.name}</h3>
            </div>
            <span className={`status-badge status-badge-${biomarker.status}`}>
              {statusLabels[biomarker.status]}
            </span>
          </div>

          <div className="biomarker-value-row">
            <strong>{biomarker.value}</strong>
            <span>{biomarker.unit}</span>
          </div>

          <p className="biomarker-explainer">{biomarker.explanation}</p>
        </article>
      ))}
    </div>
  )
}
