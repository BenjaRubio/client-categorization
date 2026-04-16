import { LLMRequest, LLMResponse } from './types';
import { registry } from './registry';

export const callLLM = (request: LLMRequest): Promise<LLMResponse> => {
  return registry.callWithFallback(request);
};

export { PromptTemplate } from './prompt-template';
export * from './types';
export * from './registry';
