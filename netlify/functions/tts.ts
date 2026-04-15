import type { Context } from '@netlify/functions'

const MAX_TEXT_LENGTH = 5000

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

function textToSSML(text: string, wordPauseMs?: number): string {
  if (!wordPauseMs || wordPauseMs <= 0) return text
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const words = escaped.split(/\s+/)
  const joined = words.join(` <break time="${wordPauseMs}ms"/> `)
  return `<speak>${joined}</speak>`
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

  const apiKey = Netlify.env.get('GOOGLE_TTS_API_KEY')
  if (!apiKey) {
    return Response.json({ error: 'TTS service not configured' }, { status: 500 })
  }

  let body: { text?: string; voice?: string; rate?: number; wordPauseMs?: number }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { text, voice, rate, wordPauseMs } = body

  if (!text || typeof text !== 'string') {
    return Response.json({ error: 'Missing or invalid "text" field' }, { status: 400 })
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return Response.json(
      { error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters` },
      { status: 400 }
    )
  }

  const useSSML = wordPauseMs && wordPauseMs > 0
  const inputContent = useSSML ? textToSSML(text, wordPauseMs) : text

  const requestBody = {
    input: useSSML ? { ssml: inputContent } : { text: inputContent },
    voice: {
      languageCode: 'fr-CA',
      name: voice || 'fr-CA-Wavenet-A',
    },
    audioConfig: {
      audioEncoding: 'MP3' as const,
      speakingRate: rate ?? 1.0,
      pitch: 0,
    },
  }

  // Try with x-goog-api-key header first, fall back to query parameter
  const attempts = [
    {
      url: 'https://texttospeech.googleapis.com/v1/text:synthesize',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
    },
    {
      url: `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ]

  for (const attempt of attempts) {
    try {
      const response = await fetch(attempt.url, {
        method: 'POST',
        headers: attempt.headers,
        body: JSON.stringify(requestBody),
      })

      if (response.ok) {
        const data = await response.json()
        return Response.json(
          { audioContent: data.audioContent },
          {
            headers: {
              ...corsHeaders(request),
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=86400',
            },
          }
        )
      }

      const err = await response.text()
      console.error(`TTS attempt failed (${response.status}):`, err)
    } catch (err) {
      console.error('TTS fetch error:', err)
    }
  }

  return Response.json({ error: 'TTS synthesis failed with all methods' }, { status: 502 })
}
