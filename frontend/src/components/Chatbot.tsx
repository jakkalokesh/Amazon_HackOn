import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = { sender: 'user', text: input };

    try {
      const res = await axios.post('http://127.0.0.1:5000/chatbot', { input });
      const botMessage = { sender: 'bot', text: res.data.response };
      setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: `Error: ${error}` };
      setMessages((prevMessages) => [...prevMessages, userMessage, errorMessage]);
    }

    setInput('');
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chatbot p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="messages-container p-4 bg-white rounded-md shadow-inner overflow-y-scroll h-96">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === 'user' ? 'text-right' : 'text-left'} mb-2`}>
            <div className={`inline-block p-2 rounded-md ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Type your message"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;

