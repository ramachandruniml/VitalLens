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

// All visits with their biomarkers for the dashboard history view
export type VisitGroup = {
  id: string
  label: string
  biomarkers: BiomarkerResult[]
}

export async function fetchAllVisitsGrouped(): Promise<VisitGroup[]> {
  const visits = await fetchAllVisits()
  return visits.map((visit, i) => ({
    id: visit.id,
    label: `Upload ${i + 1} — ${visit.created_at.slice(0, 10)}`,
    biomarkers: visit.biomarkers.map(b => ({
      id: b.id,
      name: b.name,
      value: String(b.value),
      unit: b.unit,
      status: mapStatus(b.status),
      explanation: b.explanation,
    })),
  }))
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
