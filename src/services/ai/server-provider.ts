import type { AIProvider, DicteeParams, ComprehensionParams, OralScenarioParams, OralConversationParams, OralEvaluationParams } from './types'
import type { DicteeContent } from '@/types/dictee'
import type { ComprehensionQuestion } from '@/types/comprehension'
import type { OralScenario, OralEvaluation } from '@/types/oral'
import { buildDicteePrompt, buildComprehensionPrompt } from './prompts'
import { parseDicteeResponse, parseComprehensionResponse } from './response-parser'
import { buildOralScenarioPrompt, buildOralConversationPrompt, buildOralEvaluationPrompt } from './oral-prompts'
import { parseOralScenarioResponse, parseOralEvaluationResponse } from './oral-response-parser'

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

  async generateOralScenario(params: OralScenarioParams): Promise<OralScenario> {
    const prompt = buildOralScenarioPrompt(params.section, params.topic, params.difficulty)
    const text = await this.callServer(prompt, 2000)
    return parseOralScenarioResponse(text, params.section, params.topic, params.difficulty)
  }

  async getOralResponse(params: OralConversationParams): Promise<string> {
    const prompt = buildOralConversationPrompt(params.scenario, params.turns, params.userLastMessage)
    return this.callServer(prompt, 500)
  }

  async evaluateOral(params: OralEvaluationParams): Promise<OralEvaluation> {
    const prompt = buildOralEvaluationPrompt(params.section, params.scenario, params.turns)
    const text = await this.callServer(prompt, 3500)
    return parseOralEvaluationResponse(text)
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
