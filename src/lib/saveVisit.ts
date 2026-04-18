import { supabase } from './supabase'
import type { Biomarker } from './analyzeLab'

export async function saveVisit(
  userId: string,
  rawText: string,
  visitDate: string,
  biomarkers: Biomarker[]
): Promise<string> {
  const { data: visit, error: visitError } = await supabase
    .from('visits')
    .insert({ user_id: userId, visit_date: visitDate, raw_text: rawText })
    .select('id')
    .single()

  if (visitError) throw visitError

  const { error: bmError } = await supabase.from('biomarkers').insert(
    biomarkers.map(b => ({
      visit_id: visit.id,
      name: b.name,
      value: b.value,
      unit: b.unit,
      reference_low: b.reference_low,
      reference_high: b.reference_high,
      status: b.status,
      explanation: b.explanation,
    }))
  )

  if (bmError) throw bmError
  return visit.id as string
}
