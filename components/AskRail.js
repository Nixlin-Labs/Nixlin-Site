'use client';

import { useState, useEffect, useRef } from 'react';
import Logo from './Logo';

export default function AskRail({ isOpen, onClose, onFocusContact }) {
  const [messages, setMessages] = useState([
    {
      sender: 'nixlin',
      text: "Ask me anything about how we work — websites, applications, SEO, projects, timelines or getting started.",
      matched: true,
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Auto-focus input when opened
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSend = async (questionToSend) => {
    const query = (questionToSend || inputQuery).trim();
    if (!query || isLoading) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'nixlin',
            text: data.answer,
            matched: data.matched,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'nixlin',
            text: "I don't have a clear answer for that yet. If you'd like, reach out directly and someone from Nixlin can help.",
            matched: false,
          },
        ]);
      }
    } catch (err) {
      console.error('Ask API error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'nixlin',
          text: "We couldn't reach the assistant right now. Please feel free to reach out directly through the contact form.",
          matched: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactAction = () => {
    onClose();
    setTimeout(() => {
      onFocusContact?.();
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ask-rail-title"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-background-deep/75 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Sliding Rail Panel */}
      <div className="relative z-10 w-full md:w-[480px] lg:w-[500px] h-full bg-[#04241D] border-l border-border/40 shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/30 bg-[#021B16]/60">
          <div className="flex items-center gap-2.5">
            <Logo className="w-6 h-6" />
            <h2 id="ask-rail-title" className="font-bold text-sm text-primary tracking-wide">
              Ask Nixlin
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-meta bg-surface text-accent-muted border border-border/30">
              Assistant
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant panel"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface/60 hover:bg-surface border border-border/40 hover:border-accent/40 text-[11px] font-mono-meta text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <span>Close</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-background-deep text-secondary/70">
              ESC
            </span>
          </button>
        </div>

        {/* Conversation Message List */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col gap-1.5 ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Sender Label */}
              <span className="font-mono-meta text-[11px] uppercase tracking-wider text-secondary/60">
                {msg.sender === 'user' ? 'You' : 'Nixlin'}
              </span>

              {/* Message Bubble */}
              <div
                className={`max-w-[90%] rounded-lg p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-accent text-background-deep font-medium'
                    : 'bg-surface/80 border border-border/40 text-primary font-light'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Fallback Contact Action Button if no match */}
                {msg.sender === 'nixlin' && msg.matched === false && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <button
                      type="button"
                      onClick={handleContactAction}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-accent/15 hover:bg-accent/25 border border-accent/40 text-xs font-mono-meta text-accent transition-colors cursor-pointer"
                    >
                      <span>Contact Nixlin</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex flex-col items-start gap-1.5">
              <span className="font-mono-meta text-[11px] uppercase tracking-wider text-secondary/60">
                Nixlin
              </span>
              <div className="bg-surface/80 border border-border/40 rounded-lg p-4 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          {/* Initial Suggested Questions Pills (shown only on start) */}
          {messages.length === 1 && (
            <div className="pt-4 border-t border-border/20 flex flex-col gap-2">
              <span className="font-mono-meta text-[10px] uppercase tracking-wider text-secondary/50">
                Suggested questions:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'What services do you provide?',
                  'How does a project start?',
                  'Do you work with startups?',
                  'Where is Nixlin based?',
                ].map((suggested, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(suggested)}
                    className="text-xs font-mono-meta text-left px-3 py-1.5 rounded-full bg-surface/50 hover:bg-surface border border-border/30 hover:border-accent/40 text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    {suggested}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-border/30 bg-[#021B16]/80 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-secondary/50 text-xs">
              /
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about Nixlin..."
              disabled={isLoading}
              className="w-full pl-8 pr-4 py-3 rounded-md bg-surface/90 border border-border text-sm text-primary placeholder:text-secondary/40 focus:border-accent focus:bg-surface focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            aria-label="Send question"
            className="px-4 py-3 rounded-md bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-background-deep font-semibold text-xs tracking-wider uppercase font-mono transition-colors cursor-pointer flex items-center justify-center"
          >
            <span>Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
}
