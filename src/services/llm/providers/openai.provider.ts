import OpenAI from 'openai';
import { LLMProvider, LLMRequest, LLMResponse } from '../types';

const MODEL = 'gpt-4o-mini';
const API_KEY = process.env.OPENAI_API_KEY;

export class OpenAIProvider implements LLMProvider {
  name = 'OpenAI';
  private client: OpenAI | null = null;

  isAvailable(): boolean {
    return !!API_KEY;
  }

  private getClient(): OpenAI {
    if (!this.client) {
      this.client = new OpenAI({ apiKey: API_KEY });
    }
    return this.client;
  }

  async call(request: LLMRequest): Promise<LLMResponse> {
    const completion = await this.getClient().chat.completions.create({
      model: MODEL,
      messages: request.messages,
      temperature: request.temperature ?? 0.3,
      max_tokens: request.maxTokens,
    });

    const choice = completion.choices[0];
    if (!choice?.message?.content) {
      throw new Error('OpenAI returned an empty response');
    }

    return {
      text: choice.message.content,
      provider: this.name,
      model: completion.model,
      usage: completion.usage
        ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
            totalTokens: completion.usage.total_tokens,
          }
        : undefined,
    };
  }
}
