import { LLMProvider, LLMRequest, LLMResponse } from './types';
import { OpenAIProvider } from './providers/openai.provider';
import { GroqProvider } from './providers/groq.provider';
import { GeminiProvider } from './providers/gemini.provider';

export type ResponseValidator = (response: LLMResponse) => void;

export class LLMRegistry {
  private providers: LLMProvider[] = [];

  register(provider: LLMProvider) {
    this.providers.push(provider);
  }

  /**
   * Tries each registered provider in order. A provider is skipped if:
   * - `isAvailable()` returns false
   * - `call()` throws (network error, rate limit, etc.)
   * - `validate()` throws (response came back but content is unusable)
   */
  async callWithFallback(
    request: LLMRequest,
    validate?: ResponseValidator
  ): Promise<LLMResponse> {
    const errors: string[] = [];

    for (const provider of this.providers) {
      if (!provider.isAvailable()) continue;

      try {
        console.log(`  Calling LLM provider: ${provider.name}`);
        const response = await provider.call(request);

        if (validate) validate(response);

        return response;
      } catch (error) {
        const msg =
          error instanceof Error ? error.message : String(error);
        console.error(`  ⚠ ${provider.name} failed: ${msg}`);
        errors.push(`${provider.name}: ${msg}`);
      }
    }

    throw new Error(
      `All LLM providers failed.\n${errors.map((e) => `  - ${e}`).join('\n')}`
    );
  }
}

export const registry = new LLMRegistry();

registry.register(new OpenAIProvider());
registry.register(new GeminiProvider());
registry.register(new GroqProvider());
