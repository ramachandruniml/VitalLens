import { AlertCircle, CheckCircle, FileText, Loader2, Sparkles, UploadCloud, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { PageIntro } from '../components/PageIntro'
import { analyzeLab, type Biomarker } from '../lib/analyzeLab'
import { extractTextFromPDF } from '../lib/extractText'
import { saveVisit } from '../lib/saveVisit'
import { supabase } from '../lib/supabase'

type PipelineState = 'idle' | 'selected' | 'extracting' | 'analyzing' | 'saving' | 'done' | 'error'

const acceptedMime = { 'application/pdf': ['.pdf'] }

const STATUS_LABELS: Record<PipelineState, string> = {
  idle: 'Waiting for file',
  selected: 'File ready',
  extracting: 'Extracting text from PDF…',
  analyzing: 'Analyzing…',
  saving: 'Saving to database…',
  done: 'Complete',
  error: 'Error',
}

export function UploadPage() {
  const [state, setState] = useState<PipelineState>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const [file] = acceptedFiles
    if (!file) return
    setSelectedFile(file)
    setState('selected')
    setErrorMsg(null)
    setBiomarkers([])
  }, [])

  const handleReject = useCallback(() => {
    setSelectedFile(null)
    setState('error')
    setErrorMsg('Only PDF files are supported.')
  }, [])

  const reset = useCallback(() => {
    setSelectedFile(null)
    setState('idle')
    setErrorMsg(null)
    setBiomarkers([])
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: acceptedMime,
    maxFiles: 1,
    multiple: false,
    noClick: true,
    onDropAccepted: handleDrop,
    onDropRejected: handleReject,
  })

  async function runPipeline() {
    if (!selectedFile) return
    setErrorMsg(null)

    try {
      setState('extracting')
      const extracted = await extractTextFromPDF(selectedFile)

      setState('analyzing')
      const results = await analyzeLab(extracted)

      setState('saving')
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')
      const rawText = extracted.type === 'text' ? extracted.text : '[image-based PDF]'
      await saveVisit(user.id, rawText, extracted.date, results)

      setBiomarkers(results)
      setState('done')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
      setState('error')
    }
  }

  const isProcessing = ['extracting', 'analyzing', 'saving'].includes(state)

  return (
    <section className="page-section">
      <PageIntro
        eyebrow="Upload"
        title="Upload report"
        description="Secure intake for clinical PDF files."
      />

      <div className="upload-hero">
        <div>
          <p className="eyebrow">Intake</p>
          <h3>Upload a patient report.</h3>
        </div>
        <div className="status-pill">
          <Sparkles size={16} />
          <span>{STATUS_LABELS[state]}</span>
        </div>
      </div>

      <div className="panel-grid panel-grid-wide upload-layout">
        <article
          {...getRootProps()}
          className={[
            'panel',
            'upload-dropzone',
            isDragActive ? ' upload-dropzone-active' : '',
            state === 'error' ? ' upload-dropzone-error' : '',
            state === 'selected' || state === 'done' ? ' upload-dropzone-success' : '',
          ].join('')}
        >
          <input {...getInputProps()} />

          <div className="upload-dropzone-inner">
            <div className="upload-icon-orb">
              {state === 'error' ? (
                <AlertCircle size={30} />
              ) : state === 'done' ? (
                <CheckCircle size={30} />
              ) : isProcessing ? (
                <Loader2 size={30} className="spin" />
              ) : state === 'selected' ? (
                <FileText size={30} />
              ) : (
                <UploadCloud size={30} />
              )}
            </div>

            <div className="upload-copy">
              <h3>
                {state === 'done'
                  ? 'Analysis complete'
                  : state === 'error'
                    ? 'Something went wrong'
                    : isProcessing
                      ? STATUS_LABELS[state]
                      : state === 'selected'
                        ? 'PDF selected'
                        : 'Drag and drop your PDF here'}
              </h3>
              <p>
                {state === 'done'
                  ? `${biomarkers.length} biomarkers saved to your account.`
                  : errorMsg ?? 'Single PDF, max 25 MB, encrypted files unsupported'}
              </p>
            </div>

            <div className="upload-actions">
              <button type="button" className="primary-button" onClick={open} disabled={isProcessing}>
                Choose PDF
              </button>
              {state === 'selected' && (
                <button type="button" className="primary-button" onClick={runPipeline}>
                  Analyze Lab Report
                </button>
              )}
            </div>
          </div>
        </article>

        <aside className="panel upload-side-panel">
          <div className="upload-side-header">
            <h3>Upload status</h3>
            {selectedFile && !isProcessing && (
              <button type="button" className="ghost-button" onClick={reset}>
                <X size={16} />
                Clear
              </button>
            )}
          </div>

          <div className="file-chip">
            <FileText size={18} />
            <div>
              <strong>{selectedFile ? selectedFile.name : 'No file selected'}</strong>
              <span>
                {selectedFile
                  ? `${Math.max(selectedFile.size / 1024 / 1024, 0.1).toFixed(1)} MB PDF`
                  : 'No file selected'}
              </span>
            </div>
          </div>

          <div className="upload-state-card">
            <span className={`state-dot state-dot-${state === 'done' ? 'selected' : state === 'error' ? 'error' : state === 'idle' ? 'idle' : 'selected'}`} />
            <div>
              {state !== 'idle' && <strong>{STATUS_LABELS[state]}</strong>}
              {isProcessing && <p>This may take a few seconds…</p>}
              {state === 'done' && <p>{biomarkers.length} biomarkers extracted and saved.</p>}
              {errorMsg && <p style={{ color: '#f87171' }}>{errorMsg}</p>}
            </div>
          </div>

          {state === 'done' && biomarkers.length > 0 && (
            <div className="panel" style={{ marginTop: '0.75rem', maxHeight: 320, overflowY: 'auto' }}>
              <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>Results</p>
              {biomarkers.map((b, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid #1e293b' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>{b.name}</strong>
                    <span style={{ marginLeft: '0.5rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                      {b.value} {b.unit}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: b.status === 'normal' ? '#14532d' : '#7f1d1d',
                    color: b.status === 'normal' ? '#4ade80' : '#f87171',
                  }}>
                    {b.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {state === 'error' && (
            <div className="error-banner" role="alert">
              <AlertCircle size={18} />
              <p>{errorMsg ?? 'An unexpected error occurred.'}</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
