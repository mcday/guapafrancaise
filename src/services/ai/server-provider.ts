import type { AIProvider, DicteeParams, ComprehensionParams } from './types'
import type { DicteeContent } from '@/types/dictee'
import type { ComprehensionQuestion } from '@/types/comprehension'
import { buildDicteePrompt, buildComprehensionPrompt } from './prompts'
import { parseDicteeResponse, parseComprehensionResponse } from './response-parser'

export class ServerProvider implements AIProvider {
  private provider: string
  private model: string

  constructor(provider: string, model: string) {
    this.provider = provider
    this.model = model
  }

  async generateDictee(params: DicteeParams): Promise<DicteeContent> {
    const prompt = buildDicteePrompt({
      topic: params.topic,
      difficulty: params.difficulty,
      sentenceCount: params.sentenceCount ?? 5,
    })

    const text = await this.callServer(prompt, 1500)
    return parseDicteeResponse(text, params)
  }

  async generateComprehensionQuestions(
    params: ComprehensionParams
  ): Promise<ComprehensionQuestion[]> {
    const prompt = buildComprehensionPrompt({
      sourceText: params.sourceText,
      questionCount: params.questionCount,
      difficulty: params.difficulty,
      section: params.section,
    })

    const text = await this.callServer(prompt, 2000)
    return parseComprehensionResponse(text, params)
  }

  private async callServer(prompt: string, maxTokens: number): Promise<string> {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: this.provider,
        model: this.model,
        prompt,
        maxTokens,
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(err.error || `AI request failed (${response.status})`)
    }

    const data: { text: string } = await response.json()
    return data.text
  }
}
