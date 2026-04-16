import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]); // chat history
  const [input, setInput] = useState(''); // what user is tyoping
  const [loading, setLoading] = useState(false); //for loading message

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://hidoctor-oww8.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.reply };
      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="app">
      <div className="header">
        <h1>HiDoctor ChatBot</h1>
        <p>Describe your problems and get a general guidance</p>
      </div>

      <div className="chat-box">
        {messages.length === 0 && (
          <p className="placeholder">Start by describing how you feel......</p>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <span className="bubble">{msg.content}</span>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <span className="bubble">Thinking...</span>
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. I am a 32 year old male and I have a headache and fever and I feel..."
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;