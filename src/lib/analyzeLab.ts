import type { ExtractResult } from './extractText'

export type Biomarker = {
  name: string
  value: number
  unit: string
  reference_low: number | null
  reference_high: number | null
  status: 'normal' | 'high' | 'low'
  explanation: string
  category: string
}

export async function analyzeLab(extracted: ExtractResult): Promise<Biomarker[]> {
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-lab`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ extracted }),
    }
  )

  if (!res.ok) throw new Error(`Analyze error ${res.status}: ${await res.text()}`)

  const data = await res.json()
  const raw = (data.content[0].text as string).trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(raw) as Biomarker[]
}
