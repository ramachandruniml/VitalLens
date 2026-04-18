export type BiomarkerStatus = 'normal' | 'watch' | 'high'

export type BiomarkerResult = {
  id: string
  name: string
  value: string
  unit: string
  status: BiomarkerStatus
  explanation: string
}

export type BiomarkerTrendPoint = {
  date: string
  value: number
  low: number | null
  high: number | null
}

export type BiomarkerTrend = {
  id: string
  name: string
  unit: string
  status: BiomarkerStatus
  data: BiomarkerTrendPoint[]
}
