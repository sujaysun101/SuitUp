// API utility for Google OAuth and Docs
import axios from 'axios';

export const connectGoogle = async () => {
  // Redirect to backend Google OAuth endpoint
  window.location.href = '/api/google/auth';
};

export const fetchGoogleDocs = async () => {
  return axios.get('/api/google/docs');
};

export const fetchResumeDoc = async (docId: string) => {
  return axios.get(`/api/google/docs/${docId}`);
};
