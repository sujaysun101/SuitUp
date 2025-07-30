// API utility for job-related actions
import axios from 'axios';

export const sendJobData = async (jobData: any) => {
  // POST job data to backend
  return axios.post('/api/job', jobData);
};

export const fetchJobAnalysis = async (jobId: string) => {
  // GET job analysis from backend
  return axios.get(`/api/job/${jobId}/analysis`);
};
