import { LLMRequest, LLMResponse } from './types';
import { registry } from './registry';

// Public API
export const callLLM = (request: LLMRequest): Promise<LLMResponse> => {
  return registry.callWithFallback(request);
};

export * from './types';
export * from './registry';
