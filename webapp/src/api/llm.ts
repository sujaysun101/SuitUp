// API utility for LLM (OpenAI) actions
import axios from 'axios';

export const analyzeResume = async (jobId: string, docId: string) => {
  return axios.post('/api/llm/analyze', { jobId, docId });
};

export const chatWithLLM = async (message: string, context: any) => {
  return axios.post('/api/llm/chat', { message, context });
};
