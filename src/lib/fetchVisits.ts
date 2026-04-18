import { supabase } from './supabase'
import type { BiomarkerResult, BiomarkerTrend } from '../types/biomarkers'

type RawBiomarker = {
  id: string
  name: string
  value: number
  unit: string
  reference_low: number | null
  reference_high: number | null
  status: string
  explanation: string
  category: string
}

type RawVisit = {
  id: string
  visit_date: string
  created_at: string
  biomarkers: RawBiomarker[]
}

function mapStatus(s: string): BiomarkerResult['status'] {
  if (s === 'high') return 'high'
  if (s === 'low') return 'watch'
  return 'normal'
}

// Orders by created_at so repeated same-PDF uploads get unique timestamps
async function fetchAllVisits(): Promise<RawVisit[]> {
  const { data, error } = await supabase
    .from('visits')
    .select('id, visit_date, created_at, biomarkers(*)')
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data as RawVisit[]) ?? []
}

// Latest visit's biomarkers formatted for BiomarkerCards
export async function fetchLatestBiomarkers(): Promise<BiomarkerResult[]> {
  const visits = await fetchAllVisits()
  if (!visits.length) return []

  const latest = visits[visits.length - 1]
  return latest.biomarkers.map(b => ({
    id: b.id,
    name: b.name,
    value: String(b.value),
    unit: b.unit,
    status: mapStatus(b.status),
    explanation: b.explanation,
  }))
}

// All biomarkers grouped by name as time-series for TrendCharts
// Uses created_at date so each upload is a distinct point even if PDF date is the same
export async function fetchBiomarkerTrends(): Promise<BiomarkerTrend[]> {
  const visits = await fetchAllVisits()
  if (!visits.length) return []

  const map = new Map<string, BiomarkerTrend>()

  for (const visit of visits) {
    const label = visit.created_at.slice(0, 10) // YYYY-MM-DD of upload time

    for (const b of visit.biomarkers) {
      if (!map.has(b.name)) {
        map.set(b.name, {
          id: b.name,
          name: b.name,
          unit: b.unit,
          status: mapStatus(b.status),
          data: [],
        })
      }
      map.get(b.name)!.data.push({
        date: label,
        value: b.value,
        low: b.reference_low ?? 0,
        high: b.reference_high ?? 0,
      })
    }
  }

  return Array.from(map.values())
}

export type CategoryGroup = {
  category: string
  description: string
  biomarkers: BiomarkerResult[]
}

export type VisitGroup = {
  id: string
  label: string
  categories: CategoryGroup[]
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Hematology': 'Measures your blood cells — red cells carry oxygen, white cells fight infection, and platelets help clotting.',
  'Biochemistry': 'Key chemical markers that reflect how your organs and metabolism are functioning.',
  'Liver Function': 'Shows how well your liver is filtering toxins, producing proteins, and processing nutrients.',
  'Kidney Function': 'Measures how effectively your kidneys are filtering waste and balancing fluids.',
  'Electrolytes': 'Essential minerals that regulate fluid balance, nerve signals, and muscle function.',
  'Thyroid Function': 'Assesses how well your thyroid is regulating your metabolism and energy levels.',
  'Lipid Panel': 'Measures fats in your blood that influence your risk of heart disease.',
  'Diabetes': 'Tracks blood sugar levels to screen for or monitor diabetes.',
  'Vitamins': 'Checks key vitamin levels your body needs for energy, immunity, and cell repair.',
  'General': 'Additional lab markers from your report.',
}

export async function fetchAllVisitsGrouped(): Promise<VisitGroup[]> {
  const visits = await fetchAllVisits()
  return visits.map((visit, i) => {
    const categoryMap = new Map<string, BiomarkerResult[]>()
    for (const b of visit.biomarkers) {
      const cat = b.category || 'General'
      if (!categoryMap.has(cat)) categoryMap.set(cat, [])
      categoryMap.get(cat)!.push({
        id: b.id,
        name: b.name,
        value: String(b.value),
        unit: b.unit,
        status: mapStatus(b.status),
        explanation: b.explanation,
      })
    }
    return {
      id: visit.id,
      label: `Upload ${i + 1} — ${visit.created_at.slice(0, 10)}`,
      categories: Array.from(categoryMap.entries()).map(([category, biomarkers]) => ({
        category,
        description: CATEGORY_DESCRIPTIONS[category] ?? 'Lab markers from your report.',
        biomarkers,
      })),
    }
  })
}

// Delete all visits (and their biomarkers) for the current user
export async function clearAllVisits(): Promise<void> {
  const { data: visits, error } = await supabase.from('visits').select('id')
  if (error) throw error
  if (!visits?.length) return

  const ids = visits.map(v => v.id)
  const { error: bmErr } = await supabase.from('biomarkers').delete().in('visit_id', ids)
  if (bmErr) throw bmErr

  const { error: vErr } = await supabase.from('visits').delete().in('id', ids)
  if (vErr) throw vErr
}
