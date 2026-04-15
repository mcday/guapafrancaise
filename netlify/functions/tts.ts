import type { Context } from '@netlify/functions'

const MAX_TEXT_LENGTH = 5000

export default async (request: Request, _context: Context) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const apiKey = Netlify.env.get('GOOGLE_TTS_API_KEY')
  if (!apiKey) {
    return Response.json({ error: 'TTS service not configured' }, { status: 500 })
  }

  let body: { text?: string; voice?: string; rate?: number }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { text, voice, rate } = body

  if (!text || typeof text !== 'string') {
    return Response.json({ error: 'Missing or invalid "text" field' }, { status: 400 })
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return Response.json(
      { error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters` },
      { status: 400 }
    )
  }

  const requestBody = {
    input: { text },
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

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('Google TTS error:', err)
      return Response.json(
        { error: 'TTS synthesis failed' },
        { status: response.status }
      )
    }

    const data = await response.json()

    return Response.json(
      { audioContent: data.audioContent },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400',
        },
      }
    )
  } catch (err) {
    console.error('TTS fetch error:', err)
    return Response.json({ error: 'Failed to reach TTS service' }, { status: 502 })
  }
}
