import { supabase } from './supabase'

export async function generateDoctorQuestions(): Promise<string[]> {
  // Fetch raw biomarkers from latest visit (preserving real 'high'/'low'/'normal' status)
  const { data: visits, error } = await supabase
    .from('visits')
    .select('biomarkers(name, value, unit, status, explanation)')
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) throw error
  const biomarkers = (visits?.[0] as { biomarkers: { name: string; value: number; unit: string; status: string; explanation: string }[] })?.biomarkers ?? []
  if (!biomarkers.length) return []

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/doctor-prep`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ biomarkers }),
    }
  )

  if (!res.ok) throw new Error(`Doctor prep error ${res.status}: ${await res.text()}`)
  const { questions } = await res.json()
  return questions as string[]
}
