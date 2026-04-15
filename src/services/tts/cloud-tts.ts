const audioCache = new Map<string, string>()

interface SynthesizeOptions {
  voice?: string
  rate?: number
}

function cacheKey(text: string, opts?: SynthesizeOptions): string {
  return `${text}|${opts?.voice ?? ''}|${opts?.rate ?? ''}`
}

export async function synthesizeSpeech(
  text: string,
  options?: SynthesizeOptions
): Promise<string> {
  const key = cacheKey(text, options)
  const cached = audioCache.get(key)
  if (cached) return cached

  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      voice: options?.voice,
      rate: options?.rate,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `TTS request failed (${response.status})`)
  }

  const data: { audioContent: string } = await response.json()
  const binaryString = atob(data.audioContent)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  const blob = new Blob([bytes], { type: 'audio/mpeg' })
  const blobUrl = URL.createObjectURL(blob)

  audioCache.set(key, blobUrl)
  return blobUrl
}

export function clearAudioCache() {
  for (const url of audioCache.values()) {
    URL.revokeObjectURL(url)
  }
  audioCache.clear()
}
