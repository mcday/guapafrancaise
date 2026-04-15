import { GoogleGenAI } from '@google/genai'
import type { AIProvider, DicteeParams, ComprehensionParams } from './types'
import type { DicteeContent } from '@/types/dictee'
import type { ComprehensionQuestion } from '@/types/comprehension'
import { buildDicteePrompt, buildComprehensionPrompt } from './prompts'
import { parseDicteeResponse, parseComprehensionResponse } from './response-parser'

export class GeminiProvider implements AIProvider {
  private client: GoogleGenAI

  private model: string

  constructor(apiKey: string, model: string = 'gemini-2.0-flash') {
    this.model = model
    this.client = new GoogleGenAI({ apiKey })
  }

  async generateDictee(params: DicteeParams): Promise<DicteeContent> {
    const prompt = buildDicteePrompt({
      topic: params.topic,
      difficulty: params.difficulty,
      sentenceCount: params.sentenceCount ?? 5,
    })

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: prompt,
    })

    const text = response.text ?? ''
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

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: prompt,
    })

    const text = response.text ?? ''
    return parseComprehensionResponse(text, params)
  }
}
