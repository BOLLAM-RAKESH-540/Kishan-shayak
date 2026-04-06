import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Namaste! I am Kisan Sahayak AI. Ask me about crops, weather, or schemes.", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg = { 
        id: Date.now() + 1, 
        text: "I am a demo AI. In the real app, I will answer your question about: " + input, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    // 🟢 FULL WIDTH PAGE CONTAINER
    <div className="p-8 bg-white/85 backdrop-blur-sm min-h-screen flex flex-col">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bot className="text-pink-600" size={32} /> Ask AI Help
        </h1>
        <p className="text-gray-500">Your intelligent farming assistant.</p>
      </div>

      {/* 🟢 FULL WIDTH CHAT WINDOW */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col w-full h-[70vh]"> 
        
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 bg-pink-50/50 rounded-t-2xl flex items-center gap-3">
          <div className="bg-pink-100 p-2 rounded-full">
            <Sparkles size={20} className="text-pink-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Kisan Sahayak Bot</h3>
            <p className="text-xs text-green-600 flex items-center gap-1">● Online</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>

              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 rounded-b-2xl flex gap-3">
          <input 
            type="text" 
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50"
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-xl transition shadow-sm">
            <Send size={24} />
          </button>
        </form>

      </div>
    </div>
  );
};

export default Chat;