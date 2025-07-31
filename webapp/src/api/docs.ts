import axios from 'axios';

export const suggestEdits = async (docId: string, suggestions: any[]) => {
  return axios.post('/api/docs/suggest', { doc_id: docId, suggestions });
};

export const suggestionAction = async (docId: string, suggestionIds: string[], action: 'accept' | 'undo') => {
  return axios.post('/api/docs/suggestion-action', { doc_id: docId, suggestion_ids: suggestionIds, action });
};
