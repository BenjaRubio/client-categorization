import { LLMProvider, LLMRequest, LLMResponse } from '../types';

export class OpenAIProvider implements LLMProvider {
  name = 'OpenAI';

  isAvailable(): boolean {
    return !!process.env.OPENAI_API_KEY;
  }

  async call(request: LLMRequest): Promise<LLMResponse> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API key not found');
    }

    // Actual implementation with fetch would go here
    console.log('OpenAI: Processing request...', request.prompt);

    // Simulate API call
    return {
      text: `[OpenAI Stub] Response to: ${request.prompt}`,
      provider: this.name,
      model: 'gpt-4o',
      usage: {
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30
      }
    };
  }
}
