import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PROMPT = `Extract every biomarker from this lab report. Return ONLY a raw JSON array — no markdown, no explanation.

Each object: name (string), value (number), unit (string), reference_low (number|null), reference_high (number|null), status ("normal"|"high"|"low"), explanation (one plain-English sentence a patient can understand).`

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const { extracted } = await req.json()

  const content =
    extracted.type === 'text'
      ? [{ type: 'text', text: `${PROMPT}\n\nLab report:\n${extracted.text.slice(0, 6000)}` }]
      : [
          { type: 'text', text: PROMPT },
          ...extracted.images.map((b64: string) => ({
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: b64 },
          })),
        ]

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 4096, messages: [{ role: 'user', content }] }),
  })

  const data = await res.json()
  return new Response(JSON.stringify(data), {
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
})
