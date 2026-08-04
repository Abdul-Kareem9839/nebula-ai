import { getProvider, getEmbeddingProvider } from "./index.js";

class AIService {
  async chat(options) {
    const provider = getProvider();
    return provider.chat(options);
  }

  async streamChat(options) {
    const provider = getProvider();

    if (!provider.streamChat) {
      throw new Error("Streaming is not supported by the active provider.");
    }

    return provider.streamChat(options);
  }

  async embed(text) {
    const provider = getEmbeddingProvider();
    return provider.embed(text);
  }

  async healthCheck() {
    const provider = getProvider();
    return provider.healthCheck();
  }

  async evaluateAnswer(data) {
    const provider = getProvider();

    return provider.evaluateAnswer(data);
  }

  async summarizeInterview(interview) {
    const provider = getProvider();

    return provider.summarizeInterview(interview);
  }

  async analyzeResume(data) {
    const provider = getProvider();

    if (typeof provider.analyzeResume === "function") {
      return provider.analyzeResume(data);
    }

    return {
      skills: [],
      projects: [],
      experience: [],
      education: [],
      certifications: [],
      strengths: [],
      weaknesses: [],
    };
  }
}

export const aiService = new AIService();
