import Anthropic from '@anthropic-ai/sdk'
import type { AIProvider, DicteeParams, ComprehensionParams, OralScenarioParams, OralConversationParams, OralEvaluationParams } from './types'
import type { DicteeContent } from '@/types/dictee'
import type { ComprehensionQuestion } from '@/types/comprehension'
import type { OralScenario, OralEvaluation } from '@/types/oral'
import { buildDicteePrompt, buildComprehensionPrompt } from './prompts'
import { parseDicteeResponse, parseComprehensionResponse } from './response-parser'
import { buildOralScenarioPrompt, buildOralConversationPrompt, buildOralEvaluationPrompt } from './oral-prompts'
import { parseOralScenarioResponse, parseOralEvaluationResponse } from './oral-response-parser'

export class ClaudeProvider implements AIProvider {
  private client: Anthropic

  private model: string

  constructor(apiKey: string, model: string = 'claude-sonnet-4-20250514') {
    this.model = model
    this.client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true,
    })
  }

  async generateDictee(params: DicteeParams): Promise<DicteeContent> {
    const prompt = buildDicteePrompt({
      topic: params.topic,
      difficulty: params.difficulty,
      sentenceCount: params.sentenceCount ?? 5,
    })

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')

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

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')

    return parseComprehensionResponse(text, params)
  }

  private async callClaude(prompt: string, maxTokens: number): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    })
    return response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')
  }

  async generateOralScenario(params: OralScenarioParams): Promise<OralScenario> {
    const prompt = buildOralScenarioPrompt(params.section, params.topic, params.difficulty)
    const text = await this.callClaude(prompt, 2000)
    return parseOralScenarioResponse(text, params.section, params.topic, params.difficulty)
  }

  async getOralResponse(params: OralConversationParams): Promise<string> {
    const prompt = buildOralConversationPrompt(params.scenario, params.turns, params.userLastMessage)
    return this.callClaude(prompt, 500)
  }

  async evaluateOral(params: OralEvaluationParams): Promise<OralEvaluation> {
    const prompt = buildOralEvaluationPrompt(params.section, params.scenario, params.turns)
    const text = await this.callClaude(prompt, 3500)
    return parseOralEvaluationResponse(text)
  }
}
