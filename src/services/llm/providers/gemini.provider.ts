import { GoogleGenAI } from '@google/genai';
import { LLMProvider, LLMRequest, LLMResponse } from '../types';

const MODEL = 'gemini-3.0-flash';
const API_KEY = process.env.GEMINI_API_KEY;

export class GeminiProvider implements LLMProvider {
  name = 'Gemini';
  private client: GoogleGenAI | null = null;

  isAvailable(): boolean {
    return !!API_KEY;
  }

  private getClient(): GoogleGenAI {
    if (!this.client) {
      this.client = new GoogleGenAI({ apiKey: API_KEY! });
    }
    return this.client;
  }

  async call(request: LLMRequest): Promise<LLMResponse> {
    const systemMsg = request.messages.find((m) => m.role === 'system');
    const userMessages = request.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'model', parts: [{ text: m.content }] }));

    const response = await this.getClient().models.generateContent({
      model: MODEL,
      contents: userMessages,
      config: {
        temperature: request.temperature ?? 0.3,
        maxOutputTokens: request.maxTokens,
        ...(systemMsg && { systemInstruction: systemMsg.content }),
      },
    });

    if (!response.text) {
      throw new Error('Gemini returned an empty response');
    }

    return {
      text: response.text,
      provider: this.name,
      model: MODEL,
      usage: response.usageMetadata
        ? {
            promptTokens: response.usageMetadata.promptTokenCount ?? 0,
            completionTokens: response.usageMetadata.candidatesTokenCount ?? 0,
            totalTokens:
              (response.usageMetadata.promptTokenCount ?? 0) +
              (response.usageMetadata.candidatesTokenCount ?? 0),
          }
        : undefined,
    };
  }
}
