import { GoogleGenAI } from '@google/genai'
import type { AIProvider, DicteeParams, ComprehensionParams, OralScenarioParams, OralConversationParams, OralEvaluationParams } from './types'
import type { DicteeContent } from '@/types/dictee'
import type { ComprehensionQuestion } from '@/types/comprehension'
import type { OralScenario, OralEvaluation } from '@/types/oral'
import { buildDicteePrompt, buildComprehensionPrompt } from './prompts'
import { parseDicteeResponse, parseComprehensionResponse } from './response-parser'
import { buildOralScenarioPrompt, buildOralConversationPrompt, buildOralEvaluationPrompt } from './oral-prompts'
import { parseOralScenarioResponse, parseOralEvaluationResponse } from './oral-response-parser'

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

  private async callGemini(prompt: string): Promise<string> {
    const response = await this.client.models.generateContent({
      model: this.model,
      contents: prompt,
    })
    return response.text ?? ''
  }

  async generateOralScenario(params: OralScenarioParams): Promise<OralScenario> {
    const prompt = buildOralScenarioPrompt(params.section, params.topic, params.difficulty)
    const text = await this.callGemini(prompt)
    return parseOralScenarioResponse(text, params.section, params.topic, params.difficulty)
  }

  async getOralResponse(params: OralConversationParams): Promise<string> {
    const prompt = buildOralConversationPrompt(params.scenario, params.turns, params.userLastMessage)
    return this.callGemini(prompt)
  }

  async evaluateOral(params: OralEvaluationParams): Promise<OralEvaluation> {
    const prompt = buildOralEvaluationPrompt(params.section, params.scenario, params.turns)
    const text = await this.callGemini(prompt)
    return parseOralEvaluationResponse(text)
  }
}
