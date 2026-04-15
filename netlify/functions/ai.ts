import type { Context } from '@netlify/functions'

function getAllowedOrigin(request: Request): string | null {
  const origin = request.headers.get('Origin')
  if (!origin) return null
  const siteUrl = Netlify.env.get('URL') || ''
  const allowed = [siteUrl, 'http://localhost', 'http://127.0.0.1']
  if (allowed.some((a) => origin.startsWith(a))) return origin
  return null
}

function corsHeaders(request: Request): Record<string, string> {
  const origin = getAllowedOrigin(request)
  if (!origin) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

export default async (request: Request, _context: Context) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request) })
  }

  if (!getAllowedOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  let body: { provider?: string; model?: string; prompt?: string; maxTokens?: number }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { provider = 'gemini', model, prompt, maxTokens = 2000 } = body

  if (!prompt || typeof prompt !== 'string') {
    return Response.json({ error: 'Missing or invalid "prompt" field' }, { status: 400, headers: corsHeaders(request) })
  }

  let result: Response

  // Try requested provider first, fall back to the other
  if (provider === 'claude') {
    result = await handleClaude(prompt, model || 'claude-sonnet-4-20250514', maxTokens)
    if (!result.ok) {
      const fallback = await handleGemini(prompt, 'gemini-2.0-flash', maxTokens)
      if (fallback.ok) result = fallback
    }
  } else {
    result = await handleGemini(prompt, model || 'gemini-2.0-flash', maxTokens)
    if (!result.ok) {
      const fallback = await handleClaude(prompt, 'claude-sonnet-4-20250514', maxTokens)
      if (fallback.ok) result = fallback
    }
  }

  // Add CORS headers to the response
  const responseBody = await result.json()
  return Response.json(responseBody, {
    status: result.status,
    headers: corsHeaders(request),
  })
}

async function handleClaude(prompt: string, model: string, maxTokens: number): Promise<Response> {
  const apiKey = Netlify.env.get('CLAUDE_API_KEY')
  if (!apiKey) {
    return Response.json({ error: 'Claude API key not configured' }, { status: 500 })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Claude API error:', response.status, err)
      return Response.json(
        { error: `Claude: ${response.status} - ${err.slice(0, 200)}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const text = data.content
      ?.filter((block: { type: string }) => block.type === 'text')
      ?.map((block: { text: string }) => block.text)
      ?.join('') ?? ''

    return Response.json({ text })
  } catch (err) {
    console.error('Claude fetch error:', err)
    return Response.json({ error: `Claude connection failed: ${err}` }, { status: 502 })
  }
}

async function handleGemini(prompt: string, model: string, maxTokens: number): Promise<Response> {
  const apiKey = Netlify.env.get('GEMINI_API_KEY')
  if (!apiKey) {
    return Response.json({ error: 'Gemini API key not configured' }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: maxTokens },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('Gemini API error:', response.status, err)
      return Response.json(
        { error: `Gemini: ${response.status} - ${err.slice(0, 200)}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    return Response.json({ text })
  } catch (err) {
    console.error('Gemini fetch error:', err)
    return Response.json({ error: `Gemini connection failed: ${err}` }, { status: 502 })
  }
}
