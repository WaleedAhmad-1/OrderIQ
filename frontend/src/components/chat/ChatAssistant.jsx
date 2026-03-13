import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "../../services/chat.service";

/**
 * Floating AI Chat Assistant Widget
 * Renders a chat bubble in the bottom-right corner that expands into a chat window.
 */
export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm the OrderIQ Assistant. Ask me about restaurants, menus, or food recommendations!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Build conversation history for context (exclude the welcome message)
  function getConversationHistory() {
    return messages
      .slice(1) // skip initial greeting
      .slice(-6) // keep last 6 messages
      .map(({ role, content }) => ({ role, content }));
  }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(trimmed, getConversationHistory());
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Sorry, something went wrong. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMsg },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-orange-500 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <div>
                <h3 className="font-semibold text-sm">OrderIQ Assistant</h3>
                <p className="text-xs text-orange-100">
                  Ask me anything about food!
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-orange-600 rounded-full p-1 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={14} className="text-orange-600" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-orange-500 text-white rounded-br-md"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="chat-markdown">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold text-gray-900">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="text-gray-500 text-xs">
                              {children}
                            </em>
                          ),
                          ul: ({ children }) => (
                            <ul className="mb-2 space-y-1.5">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-2 space-y-1.5">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="flex items-start gap-1.5">
                              <span className="text-orange-500 mt-0.5">•</span>
                              <span>{children}</span>
                            </li>
                          ),
                          h3: ({ children }) => (
                            <h3 className="font-bold text-sm text-gray-900 mt-2 mb-1">
                              {children}
                            </h3>
                          ),
                          hr: () => <hr className="my-2 border-gray-200" />,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-orange-400 pl-2 my-1.5 text-gray-600 text-xs italic">
                              {children}
                            </blockquote>
                          ),
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 underline hover:text-orange-700"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-1">
                    <User size={14} className="text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-orange-600" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm">
                  <Loader2 size={16} className="animate-spin text-orange-500" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about restaurants, menus..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-all hover:scale-105 flex items-center justify-center"
        aria-label="Open chat assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </>
  );
}
