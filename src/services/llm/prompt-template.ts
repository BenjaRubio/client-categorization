import fs from 'fs';
import path from 'path';
import { LLMRequest } from './types';

const PROMPTS_DIR = path.join(process.cwd(), 'src/services/llm/prompts');

export class PromptTemplate {
  private systemContent: string;
  private userTemplate: string;
  private defaults: Pick<LLMRequest, 'temperature' | 'maxTokens'>;

  private constructor(
    system: string,
    user: string,
    defaults: Pick<LLMRequest, 'temperature' | 'maxTokens'>
  ) {
    this.systemContent = system;
    this.userTemplate = user;
    this.defaults = defaults;
  }

  /**
   * Loads a prompt template `.md` file by name from the prompts directory.
   * Files use frontmatter for LLM defaults and `# System` / `# User` sections.
   */
  static load(templateName: string): PromptTemplate {
    const filePath = path.join(PROMPTS_DIR, `${templateName}.md`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { defaults, system, user } = PromptTemplate.parse(raw);
    return new PromptTemplate(system, user, defaults);
  }

  /**
   * Replaces `{{placeholder}}` tokens with the provided variables
   * and returns a ready-to-use `LLMRequest`.
   */
  render(variables: Record<string, string>): LLMRequest {
    let userContent = this.userTemplate;

    for (const [key, value] of Object.entries(variables)) {
      userContent = userContent.replaceAll(`{{${key}}}`, value);
    }

    const unreplaced = userContent.match(/\{\{(\w+)\}\}/g);
    if (unreplaced) {
      throw new Error(`Missing template variables: ${unreplaced.join(', ')}`);
    }

    return {
      messages: [
        { role: 'system', content: this.systemContent.trim() },
        { role: 'user', content: userContent.trim() },
      ],
      ...this.defaults,
    };
  }

  private static parse(raw: string): {
    defaults: Pick<LLMRequest, 'temperature' | 'maxTokens'>;
    system: string;
    user: string;
  } {
    let content = raw;
    let defaults: Pick<LLMRequest, 'temperature' | 'maxTokens'> = {};

    const frontmatterMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    if (frontmatterMatch) {
      defaults = PromptTemplate.parseFrontmatter(frontmatterMatch[1]);
      content = raw.slice(frontmatterMatch[0].length);
    }

    const systemMatch = content.match(
      /^#\s+System\s*\n([\s\S]*?)(?=\n#\s+User\s*\n|$)/im
    );
    const userMatch = content.match(/^#\s+User\s*\n([\s\S]*?)$/im);

    if (!systemMatch || !userMatch) {
      throw new Error(
        'Prompt template must contain both "# System" and "# User" sections'
      );
    }

    return {
      defaults,
      system: systemMatch[1].trim(),
      user: userMatch[1].trim(),
    };
  }

  private static parseFrontmatter(
    raw: string
  ): Pick<LLMRequest, 'temperature' | 'maxTokens'> {
    const defaults: Pick<LLMRequest, 'temperature' | 'maxTokens'> = {};

    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const colonIdx = trimmed.indexOf(':');
      if (colonIdx === -1) continue;

      const key = trimmed.slice(0, colonIdx).trim();
      const value = trimmed.slice(colonIdx + 1).trim();

      if (key === 'temperature') defaults.temperature = parseFloat(value);
      if (key === 'max_tokens') defaults.maxTokens = parseInt(value, 10);
    }

    return defaults;
  }
}
