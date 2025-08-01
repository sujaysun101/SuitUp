
import React, { useState, useRef, useEffect } from "react";
import { chatWithLLM } from "../api/llm";


interface Message {
  sender: "user" | "ai";
  text: string;
}

const LLMChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Hi! I’m your AI assistant. Paste a job description or ask for resume suggestions!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user" as const, text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await chatWithLLM(userMsg.text, {});
      const aiText = res.data?.response || res.data?.text || "[No response]";
      setMessages(msgs => [...msgs, { sender: "ai", text: aiText }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { sender: "ai", text: "[Error: Could not get response from LLM]" }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <aside className="w-96 min-h-full bg-white/10 backdrop-blur-lg rounded-xl m-4 p-6 flex flex-col border border-white/20 shadow-lg">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2 pr-2 llmchatpanel-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg px-4 py-2 max-w-[85%] ${
              msg.sender === "user"
                ? "bg-blue-600 text-white self-end ml-auto"
                : "bg-white/20 text-white self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex gap-2 mt-auto">
        <input
          className="flex-1 rounded-lg px-3 py-2 bg-black/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message or paste a job description..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
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
