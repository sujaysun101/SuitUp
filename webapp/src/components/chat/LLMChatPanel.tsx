import React, { useState } from 'react';

import { chatWithLLM } from '../../api/llm';
import { suggestEdits, suggestionAction } from '../../api/docs';

const LLMChatPanel: React.FC<{ jobId?: string; docId?: string }> = ({ jobId, docId }) => {

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [creatingResume, setCreatingResume] = useState(false);
  const [qaStep, setQaStep] = useState(0);
  // Removed unused qaAnswers state

  // For suggestion flow
  const [pendingSuggestionIds, setPendingSuggestionIds] = useState<string[]>([]);
  const [showSuggestionActions, setShowSuggestionActions] = useState(false);

  const qaQuestions = [
    'What is your full name?',
    'What is your email address?',
    'What is your phone number?',
    'What is your current job title?',
    'List your top 3 skills.',
    'Describe your most recent work experience.',
    'Describe your education background.'
  ];


  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    if (creatingResume) {
      // Q&A flow
      const answer = input;
      setMessages([...messages, { from: 'user', text: answer }]);
      // Removed setQaAnswers since qaAnswers is unused
      setInput('');
      if (qaStep < qaQuestions.length - 1) {
        setQaStep(qaStep + 1);
        setMessages(msgs => [...msgs, { from: 'llm', text: qaQuestions[qaStep + 1] }]);
        setLoading(false);
      } else {
        // All questions answered, call backend to create resume
        setMessages(msgs => [...msgs, { from: 'llm', text: 'Creating your resume in Google Docs...' }]);
        // TODO: Call backend API to create Google Doc with qaAnswers
        setTimeout(() => {
          setMessages(msgs => [...msgs, { from: 'llm', text: 'Your resume has been created! Check your Google Docs.' }]);
          setCreatingResume(false);
          setQaStep(0);
          // Removed setQaAnswers since qaAnswers is unused
          setLoading(false);
        }, 2000);
      }
      return;
    }
    setMessages([...messages, { from: 'user', text: input }]);
    // Simulate LLM returning suggestions (in real use, parse res.data for suggestions)
    const res = await chatWithLLM(input, { jobId, docId });
    // Example: LLM returns suggestions in res.data.suggestions
    const suggestions = res.data.suggestions || [];
    if (suggestions.length && docId) {
      setMessages(msgs => [...msgs, { from: 'llm', text: 'I have some suggestions for your resume. Would you like to see them applied as suggestions in your Google Doc?' }]);
      // Call backend to apply suggestions in suggestion mode
      const suggRes = await suggestEdits(docId, suggestions);
      setPendingSuggestionIds(suggRes.data.suggestion_ids || []);
      setShowSuggestionActions(true);
    } else {
      setMessages(msgs => [...msgs, { from: 'llm', text: res.data.response }]);
    }
    setInput('');
    setLoading(false);
  };


  // If no resume, show CTA
  const noResume = !docId;

  return (
    <div className="w-96 bg-gray-950 text-white p-6 flex flex-col min-h-screen border-l border-gray-800">
      <h2 className="text-lg font-bold mb-4">AI Assistant</h2>
      <div className="flex-1 bg-gray-900 rounded-lg p-4 mb-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={msg.from === 'user' ? 'text-right' : 'text-left'}>
            <span className={msg.from === 'user' ? 'text-blue-300' : 'text-green-300'}>{msg.text}</span>
          </div>
        ))}
        {showSuggestionActions && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="mb-2 text-gray-200">Suggestions have been added to your Google Doc. Would you like to accept or undo them?</div>
            <div className="flex gap-2">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={async () => {
                  setLoading(true);
                  await suggestionAction(docId!, pendingSuggestionIds, 'accept');
                  setMessages(msgs => [...msgs, { from: 'llm', text: 'Suggestions accepted and applied to your resume!' }]);
                  setShowSuggestionActions(false);
                  setLoading(false);
                }}
                disabled={loading}
              >
                Accept
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                onClick={async () => {
                  setLoading(true);
                  await suggestionAction(docId!, pendingSuggestionIds, 'undo');
                  setMessages(msgs => [...msgs, { from: 'llm', text: 'Suggestions have been undone.' }]);
                  setShowSuggestionActions(false);
                  setLoading(false);
                }}
                disabled={loading}
              >
                Undo
              </button>
            </div>
          </div>
        )}
        {noResume && !creatingResume && (
          <div className="mt-4 flex flex-col items-center">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              onClick={() => {
                setCreatingResume(true);
                setMessages(msgs => [...msgs, { from: 'llm', text: qaQuestions[0] }]);
              }}
            >
              Create a resume now!
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
          placeholder={creatingResume ? qaQuestions[qaStep] : 'Type your message...'}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={sendMessage}
          disabled={loading}
        >
          {creatingResume ? 'Next' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default LLMChatPanel;
