import React, { useState, useRef, useEffect } from 'react';
import { generateResponse } from './chatbotApi';
import { downloadFile } from '../../utils/fileUtils';

const reactions = ['👍', '👎', '❤️', '🎯', '💡', '❓'];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1,
      text: "Hi! I'm your learning assistant. How can I help you today?", 
      sender: 'bot',
      timestamp: new Date().toISOString(),
      reactions: {}
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingStage, setTypingStage] = useState(0);
  const messagesEndRef = useRef(null);
  const typingInterval = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      typingInterval.current = setInterval(() => {
        setTypingStage(prev => (prev + 1) % 4);
      }, 300);
    } else {
      clearInterval(typingInterval.current);
      setTypingStage(0);
    }
    return () => clearInterval(typingInterval.current);
  }, [isTyping]);

  const handleReaction = (messageId, reaction) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const newReactions = { ...msg.reactions };
        newReactions[reaction] = (newReactions[reaction] || 0) + 1;
        return { ...msg, reactions: newReactions };
      }
      return msg;
    }));
  };

  const handleFileDownload = (resource) => {
    downloadFile(resource.url, resource.name);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = { 
      id: Date.now(),
      text: inputText, 
      sender: 'user',
      timestamp: new Date().toISOString(),
      reactions: {}
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Show typing indicator
    setIsTyping(true);

    try {
      // Get bot response from API
      const response = await generateResponse(inputText);
      setMessages(prev => [...prev, { 
        id: Date.now(),
        text: response.text, 
        sender: 'bot',
        timestamp: new Date().toISOString(),
        resources: response.resources,
        reactions: {}
      }]);
    } catch (error) {
      console.error('Error in chatbot:', error);
      setMessages(prev => [...prev, { 
        id: Date.now(),
        text: "I'm having trouble connecting right now. Please try again later.", 
        sender: 'bot',
        timestamp: new Date().toISOString(),
        error: true,
        reactions: {}
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! How can I assist you with your learning journey?";
    } else if (input.includes('course') || input.includes('learn')) {
      return "We have various courses available. You can check them out in the courses section. What subject interests you?";
    } else if (input.includes('mentor') || input.includes('teacher')) {
      return "Our platform connects you with expert mentors. You can find them in the skills section.";
    } else if (input.includes('skill')) {
      return "You can browse and search for different skills in our skills section. Would you like me to show you how?";
    } else if (input.includes('help')) {
      return "I'm here to help! You can ask me about courses, mentors, skills, or how to use the platform.";
    } else {
      return "I'm not sure about that. Could you rephrase your question? You can ask me about courses, mentors, or skills.";
    }
  };

  return (
    <div className="chatbot-container">
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '×' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-content overflow-hidden rounded-2xl shadow-xl bg-white w-96 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 bg-primary text-white flex justify-between items-center">
            <h2 className="font-medium">Learning Assistant</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary/90 p-1 rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Window */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="group">
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : message.error
                        ? 'bg-red-100 text-red-800 rounded-bl-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {message.text}
                    {message.resources && message.resources.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.resources.map((resource, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleFileDownload(resource)}
                            className="flex items-center space-x-2 text-sm hover:opacity-80 transition-opacity"
                          >
                            <span className="text-lg">
                              {resource.type === 'pdf' ? '📄' : resource.type === 'video' ? '🎥' : '📦'}
                            </span>
                            <span className="underline">{resource.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center mt-1 space-x-1">
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(message.timestamp)}
                    </span>
                    {message.sender === 'bot' && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        {reactions.map(reaction => (
                          <button
                            key={reaction}
                            onClick={() => handleReaction(message.id, reaction)}
                            className="text-xs hover:scale-125 transition-transform"
                          >
                            {reaction}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {Object.keys(message.reactions).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(message.reactions).map(([reaction, count]) => (
                        <span key={reaction} className="text-xs bg-gray-100 rounded-full px-2 py-1">
                          {reaction} {count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 p-3 max-w-[80%] bg-gray-100 rounded-2xl rounded-bl-none w-24">
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 bg-gray-400 rounded-full transition-transform duration-300 ease-in-out ${typingStage > i ? 'scale-125 bg-primary' : ''}`}
                    />
                  ))}                  
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
