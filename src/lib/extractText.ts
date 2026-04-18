import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href

const DATE_PATTERNS = [
  /\b\d{4}-\d{2}-\d{2}\b/,
  /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/,
  /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/i,
]

export type ExtractResult =
  | { type: 'text'; text: string; date: string }
  | { type: 'images'; images: string[]; date: string }

export async function extractTextFromPDF(file: File): Promise<ExtractResult> {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise

  const pages = await Promise.all(
    Array.from({ length: pdf.numPages }, (_, i) =>
      pdf.getPage(i + 1)
        .then(p => p.getTextContent())
        .then(c => c.items.map((item: Record<string, unknown>) =>
          typeof item.str === 'string' ? item.str : '').join(' ')
        )
    )
  )

  const text = pages.join('\n').trim()

  // If meaningful text was found, use it
  if (text.length > 100) {
    return { type: 'text', text, date: extractDate(text) }
  }

  // Image-based PDF — render each page to JPEG and send to Claude as vision
  const images = await Promise.all(
    Array.from({ length: pdf.numPages }, (_, i) =>
      pdf.getPage(i + 1).then(page => renderPageToBase64(page))
    )
  )

  return { type: 'images', images, date: new Date().toISOString().split('T')[0] }
}

async function renderPageToBase64(page: pdfjsLib.PDFPageProxy): Promise<string> {
  const viewport = page.getViewport({ scale: 2 })
  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height
  await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
  return canvas.toDataURL('image/jpeg', 0.85).split(',')[1]
}

function extractDate(text: string): string {
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      const parsed = new Date(match[0])
      if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0]
    }
  }
  return new Date().toISOString().split('T')[0]
}
