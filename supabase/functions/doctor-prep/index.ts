import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const { biomarkers } = await req.json()

  const concerning = biomarkers.filter((b: { status: string }) => b.status !== 'normal')

  if (concerning.length === 0) {
    return new Response(
      JSON.stringify({ questions: ['All your biomarkers are in the normal range. Ask your doctor if there is anything to watch going forward.'] }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }

  const summary = concerning
    .map((b: { name: string; value: number; unit: string; status: string; explanation: string }) =>
      `- ${b.name}: ${b.value} ${b.unit} (${b.status.toUpperCase()}) — ${b.explanation}`
    )
    .join('\n')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `A patient has the following concerning lab results:\n\n${summary}\n\nGenerate 5–7 clear, specific questions the patient should ask their doctor at their next visit. Focus on what these results mean, what could be causing them, and what next steps to take. Return ONLY a JSON array of question strings — no markdown, no explanation.`,
      }],
    }),
  })

  const data = await res.json()
  const raw = (data.content[0].text as string).trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  const questions: string[] = JSON.parse(raw)

  return new Response(JSON.stringify({ questions }), {
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
})
