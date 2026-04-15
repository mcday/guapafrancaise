import Anthropic from '@anthropic-ai/sdk'
import type { AIProvider, DicteeParams, ComprehensionParams } from './types'
import type { DicteeContent } from '@/types/dictee'
import type { ComprehensionQuestion } from '@/types/comprehension'
import { buildDicteePrompt, buildComprehensionPrompt } from './prompts'
import { parseDicteeResponse, parseComprehensionResponse } from './response-parser'

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
}
