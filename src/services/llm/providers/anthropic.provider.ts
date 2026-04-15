import { LLMProvider, LLMRequest, LLMResponse } from '../types';

export class AnthropicProvider implements LLMProvider {
  name = 'Anthropic';

  isAvailable(): boolean {
    return !!process.env.ANTHROPIC_API_KEY;
  }

  async call(request: LLMRequest): Promise<LLMResponse> {
    if (!this.isAvailable()) {
      throw new Error('Anthropic API key not found');
    }

    console.log('Anthropic: Processing request...', request.prompt);

    return {
      text: `[Anthropic Stub] Response to: ${request.prompt}`,
      provider: this.name,
      model: 'claude-3-5-sonnet',
      usage: {
        promptTokens: 12,
        completionTokens: 25,
        totalTokens: 37
      }
    };
  }
}
