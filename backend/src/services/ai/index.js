import { env } from '../../config/env.js';
import { geminiProvider } from './providers/gemini.provider.js';
import { groqProvider } from './providers/groq.provider.js';
import { openrouterProvider } from './providers/openrouter.provider.js';

const registry = {
  gemini: geminiProvider,
  groq: groqProvider,
  openrouter: openrouterProvider,
};

/**
 * Returns the active chat provider (per AI_PROVIDER env var).
 * Business logic should call getProvider().chat(...) and never import
 * a specific provider directly — that's what keeps providers swappable.
 */
export function getProvider(name = env.aiProvider) {
  const provider = registry[name];
  if (!provider) throw new Error(`Unknown AI provider: ${name}`);
  return provider;
}

// Groq and OpenRouter's free models don't expose embeddings — always
// route embed() through Gemini regardless of the active chat provider.
export function getEmbeddingProvider() {
  return geminiProvider;
}
