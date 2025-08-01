import React, { useState, useRef, useEffect } from "react";
import { chatWithLLM } from "../api/llm";
import { useUser } from "@clerk/clerk-react";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp?: number;
}

interface LLMChatPanelProps {
  jobAnalysis?: {
    jobData: {
      title: string;
      company: string;
      description: string;
      url: string;
    };
    analysis: any;
  } | null;
}

const LLMChatPanel: React.FC<LLMChatPanelProps> = ({ jobAnalysis }) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "👋 Hi! I'm your AI resume assistant. I can help you:\n\n• Tailor your resume for specific jobs\n• Suggest improvements based on job requirements\n• Optimize keywords and skills\n• Review and enhance content\n\nAnalyze a job with the extension, then come back here for personalized advice!",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add job analysis context when it becomes available
  useEffect(() => {
    if (jobAnalysis && jobAnalysis.jobData) {
      const contextMessage: Message = {
        sender: "ai",
        text: `🎯 **Job Analysis Complete!**\n\n**Position:** ${jobAnalysis.jobData.title}\n**Company:** ${jobAnalysis.jobData.company}\n\nI've analyzed this job posting and can now provide tailored resume suggestions. Here are some ways I can help:\n\n• **Keyword optimization** - I'll suggest relevant keywords from the job description\n• **Skills alignment** - Match your experience to required skills\n• **Content suggestions** - Specific examples and achievements to highlight\n• **Format recommendations** - Best practices for this type of role\n\nWhat would you like to focus on first?`,
        timestamp: Date.now()
      };
      
      setMessages(prev => {
        // Don't add duplicate job analysis messages
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.text.includes("Job Analysis Complete")) {
          return prev;
        }
        return [...prev, contextMessage];
      });
    }
  }, [jobAnalysis]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { 
      sender: "user", 
      text: input,
      timestamp: Date.now()
    };
    
    setMessages(msgs => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    
    try {
      // Prepare context for the AI
      const context = {
        userId: user?.id || 'anonymous',
        jobAnalysis: jobAnalysis || null,
        conversationHistory: messages.slice(-5) // Last 5 messages for context
      };
      
      const res = await chatWithLLM(userMsg.text, context);
      const aiText = res.data?.response || res.data?.text || res.data?.message || "[No response received]";
      
      const aiMsg: Message = {
        sender: "ai",
        text: aiText,
        timestamp: Date.now()
      };
      
      setMessages(msgs => [...msgs, aiMsg]);
    } catch (e: any) {
      console.error("LLM Chat error:", e);
      const errorMsg: Message = {
        sender: "ai",
        text: "⚠️ Sorry, I'm having trouble connecting right now. Please make sure the backend server is running and try again.",
        timestamp: Date.now()
      };
      setMessages(msgs => [...msgs, errorMsg]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text: string) => {
    // Basic markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <aside className="w-96 min-h-full bg-white/10 backdrop-blur-lg rounded-xl m-4 p-6 flex flex-col border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">🤖 AI Resume Assistant</h3>
        {jobAnalysis && (
          <div className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded">
            Job Analyzed
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg px-4 py-3 max-w-[90%] ${
              msg.sender === "user"
                ? "bg-blue-600 text-white self-end ml-auto"
                : "bg-white/20 text-white self-start"
            }`}
          >
            <div 
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: formatMessage(msg.text) 
              }}
            />
            {msg.timestamp && (
              <div className="text-xs opacity-60 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="bg-white/10 text-white/60 rounded-lg px-4 py-3 max-w-[90%]">
            <div className="flex items-center space-x-2">
              <div className="animate-pulse">🤔</div>
              <span className="text-sm">AI is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>
      
      <div className="flex gap-2 mt-auto">
        <input
          className="flex-1 rounded-lg px-3 py-2 bg-black/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder={jobAnalysis ? "Ask about optimizing your resume..." : "Analyze a job first, then ask for resume help..."}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </aside>
  );
};

export default LLMChatPanel;
