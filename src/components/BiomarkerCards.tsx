import { Volume2 } from 'lucide-react'
import type { BiomarkerResult } from '../types/biomarkers'

function speak(text: string) {
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
}

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>{biomarker.name}</h3>
                <button
                  onClick={() => speak(biomarker.name)}
                  title={`Pronounce ${biomarker.name}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                >
                  <Volume2 size={20} />
                </button>
              </div>
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
