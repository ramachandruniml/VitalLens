import { AlertCircle, FileText, Sparkles, UploadCloud, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { PageIntro } from '../components/PageIntro'

type UploadState = 'idle' | 'selected' | 'error'

const acceptedMime = {
  'application/pdf': ['.pdf'],
}

export function UploadPage() {
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [statusMessage, setStatusMessage] = useState('Select a PDF report.')

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const [file] = acceptedFiles

    if (!file) {
      return
    }

    setSelectedFile(file)
    setUploadState('selected')
    setStatusMessage('PDF selected.')
  }, [])

  const handleReject = useCallback(() => {
    setSelectedFile(null)
    setUploadState('error')
    setStatusMessage('Only PDF files are supported.')
  }, [])

  const resetUpload = useCallback(() => {
    setSelectedFile(null)
    setUploadState('idle')
    setStatusMessage('Select a PDF report.')
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: acceptedMime,
    maxFiles: 1,
    multiple: false,
    noClick: true,
    onDropAccepted: handleDrop,
    onDropRejected: handleReject,
  })

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
          <span>Ready</span>
        </div>
      </div>

      <div className="panel-grid panel-grid-wide upload-layout">
        <article
          {...getRootProps()}
          className={[
            'panel',
            'upload-dropzone',
            isDragActive ? ' upload-dropzone-active' : '',
            uploadState === 'error' ? ' upload-dropzone-error' : '',
            uploadState === 'selected' ? ' upload-dropzone-success' : '',
          ].join('')}
        >
          <input {...getInputProps()} />

          <div className="upload-dropzone-inner">
            <div className="upload-icon-orb">
              {uploadState === 'error' ? (
                <AlertCircle size={30} />
              ) : uploadState === 'selected' ? (
                <FileText size={30} />
              ) : (
                <UploadCloud size={30} />
              )}
            </div>

            <div className="upload-copy">
              <h3>
                {uploadState === 'selected'
                  ? 'PDF selected'
                  : uploadState === 'error'
                    ? 'Upload needs attention'
                    : 'Drag and drop your PDF here'}
              </h3>
              <p>{statusMessage}</p>
            </div>

            <div className="upload-actions">
              <button type="button" className="primary-button" onClick={open}>
                Choose PDF
              </button>
              <span className="upload-note">
                Single PDF, max 25 MB, encrypted files unsupported
              </span>
            </div>
          </div>
        </article>

        <aside className="panel upload-side-panel">
          <div className="upload-side-header">
            <h3>Upload status</h3>
            {selectedFile ? (
              <button type="button" className="ghost-button" onClick={resetUpload}>
                <X size={16} />
                Clear
              </button>
            ) : null}
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
            <span className={`state-dot state-dot-${uploadState}`} />
            <div>
              <strong>
                {uploadState === 'idle'
                  ? 'Waiting for file'
                  : uploadState === 'selected'
                    ? 'File ready'
                    : 'Validation error'}
              </strong>
              <p>{statusMessage}</p>
            </div>
          </div>

          <div className="panel dashboard-shell-panel">
            <p className="eyebrow">Submission</p>
            <h3>Upload panel</h3>
            <p>Submission status and response details.</p>
          </div>

          {uploadState === 'error' ? (
            <div className="error-banner" role="alert">
              <AlertCircle size={18} />
              <p>Only PDF files are supported.</p>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  )
}
