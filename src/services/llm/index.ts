import { LLMRequest, LLMResponse } from './types';
import { ResponseValidator, registry } from './registry';

export const callLLM = (
  request: LLMRequest,
  validate?: ResponseValidator
): Promise<LLMResponse> => {
  return registry.callWithFallback(request, validate);
};

export { PromptTemplate } from './prompt-template';
export * from './types';
export * from './registry';
