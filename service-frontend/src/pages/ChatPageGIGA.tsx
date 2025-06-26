import { useState } from 'react';
import '../styles/ChatPageGIGA.css';

export default function ChatPageGIGA() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: 'user', text: input }]);

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: `🤖 ИИ ответ: ${input.split('').reverse().join('')}` }]);
    }, 500);

    setInput('');
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <h1>🤖 Чат с ИИ-помощником</h1>
      </header>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Введите сообщение..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Отправить</button>
      </div>
    </div>
  );
}
