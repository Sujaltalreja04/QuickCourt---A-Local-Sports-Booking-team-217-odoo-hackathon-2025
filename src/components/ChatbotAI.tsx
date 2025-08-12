import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { Logo } from './Logo';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatbotAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Show greeting message after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-hide greeting after some time
  useEffect(() => {
    if (showGreeting) {
      const timer = setTimeout(() => {
        setShowGreeting(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [showGreeting]);

  // Add initial assistant message when chat is opened for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Hi there! I\'m QuickCourt AI. How can I help you today?'
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send request to local LLaMA model
      const response = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemma2:2b',
          prompt: `You are QuickCourt AI, a helpful assistant for the QuickCourt sports facility booking platform. You help users find and book sports facilities, manage their bookings, and answer questions about the platform. Keep responses concise and friendly. Current conversation: ${JSON.stringify(messages)}\n\nUser: ${input.trim()}\nQuickCourt AI:`,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI model');
      }

      const data = await response.json();
      
      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'Sorry, I couldn\'t process your request. Please try again.'
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error communicating with LLaMA model:', error);
      
      // Add fallback response if there's an error
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I\'m having trouble connecting to my brain right now. Please try again later.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Greeting message */}
      <AnimatePresence>
        {showGreeting && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="fixed bottom-24 right-6 bg-gray-900 text-white p-4 rounded-lg shadow-lg border border-blue-500 max-w-xs z-50"
          >
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 rounded-full p-2 flex-shrink-0">
                <MessageSquare size={16} />
              </div>
              <div>
                <p className="font-medium text-sm">QuickCourt AI</p>
                <p className="text-xs text-gray-300 mt-1">Hi there! Need help finding or booking a sports facility? I'm here to assist you!</p>
              </div>
              <button 
                onClick={() => setShowGreeting(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full p-3 shadow-lg hover:shadow-blue-500/20 z-50 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat with QuickCourt AI"
      >
        <motion.div
          animate={{
            rotate: isOpen ? 360 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </motion.div>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-700 z-50"
          >
            {/* Chat header */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-white rounded-full p-1">
                  <Logo size="xs" />
                </div>
                <h3 className="font-bold text-white">QuickCourt AI</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-gray-800 text-gray-100 rounded-tl-none'}`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-gray-100 rounded-lg rounded-tl-none max-w-[80%] p-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 size={16} className="animate-spin" />
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <div className="p-3 border-t border-gray-800 bg-gray-900">
              <div className="flex items-end space-x-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask QuickCourt AI..."
                  className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[40px] max-h-[120px] text-sm"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};