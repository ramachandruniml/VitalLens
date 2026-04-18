import { supabase } from './supabase'
import { fetchLatestBiomarkers } from './fetchVisits'

export async function generateDoctorQuestions(): Promise<string[]> {
  const biomarkers = await fetchLatestBiomarkers()
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
