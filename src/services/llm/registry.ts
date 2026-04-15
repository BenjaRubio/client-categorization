import { LLMProvider, LLMRequest, LLMResponse } from './types';
import { OpenAIProvider } from './providers/openai.provider';
import { GroqProvider } from './providers/groq.provider';
import { AnthropicProvider } from './providers/anthropic.provider';

export class LLMRegistry {
  private providers: LLMProvider[] = [];

  register(provider: LLMProvider) {
    this.providers.push(provider);
  }

  async callWithFallback(request: LLMRequest): Promise<LLMResponse> {
    const errors: Error[] = [];

    for (const provider of this.providers) {
      if (!provider.isAvailable()) continue;

      try {
        console.log(`Calling LLM provider: ${provider.name}`);
        return await provider.call(request);
      } catch (error) {
        console.error(`Error from provider ${provider.name}:`, error);
        errors.push(error as Error);
      }
    }

    throw new Error(`All LLM providers failed. Errors: ${errors.map(e => e.message).join(', ')}`);
  }
}

export const registry = new LLMRegistry();

// Auto-register initial providers
registry.register(new OpenAIProvider());
registry.register(new AnthropicProvider());
registry.register(new GroqProvider());
