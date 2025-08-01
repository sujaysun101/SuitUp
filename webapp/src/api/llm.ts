// API utility for LLM (OpenAI) actions
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const analyzeJob = async (jobData: {
  title: string;
  company: string;
  description: string;
  url: string;
}) => {
  return axios.post(`${API_BASE_URL}/api/analyze-job`, jobData);
};

export const chatWithLLM = async (message: string, context: any) => {
  return axios.post(`${API_BASE_URL}/api/chat-llm`, { 
    message, 
    context,
    user_id: context.userId || 'anonymous'
  });
};
