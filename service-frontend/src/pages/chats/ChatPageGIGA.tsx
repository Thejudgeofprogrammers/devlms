import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import '../../styles/ChatPageGIGA.css';

const socket = io('http://localhost:4001', { transports: ['websocket'], path: '/socket.io' });

export default function ChatPageGIGA() {
  const userId = localStorage.getItem('userId')
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('get_chats', ({ chats }) => setChats(chats));

    socket.on('get_chat', ({ chat }) => console.log('Чат по ID', chat));

    socket.on('get_messages', ({ messages }) => {
      const formatted = messages.map((m: any) => ({
        sender: m.owner === 'user' ? 'user' : 'bot',
        text: m.text
      }));
      setMessages(formatted);
    });

    socket.on('send_message', (message) => {
      setMessages((prev) => [
        ...prev,
        { sender: message.owner === 'user' ? 'user' : 'bot', text: message.text }
      ]);
    });

    socket.on('create_chat', ({ createChat }) => {
      setChats((prev) => [...prev, createChat]);
    });

    socket.on('update_name', ({ updateName }) => {
      setChats((prev) => prev.map(c => c.id === updateName.id ? updateName : c));
    });

    socket.on('delete_chat', ({ deleteChat }) => {
      setChats((prev) => prev.filter(c => c.id !== deleteChat.id));
      if (selectedChat === deleteChat.id) {
        setSelectedChat(null);
        setMessages([]);
      }
    });

    socket.emit('get_chats', { userId: Number(userId) });

    return () => {
      socket.off();
    };
  }, []);

  const selectChat = (chatId: string) => {
    setSelectedChat(chatId);
    socket.emit('join_chat', { chatId });
    socket.emit('get_messages', { chatId });
  };

  const handleSend = () => {
    if (!input.trim() || !selectedChat) return;
    socket.emit('send_message', { chatId: selectedChat, text: input, userId: Number(userId) });
    setInput('');
  };

  const createChat = () => {
    socket.emit('create_chat', { userId: Number(userId) });
  };

  const renameChat = (chatId: string) => {
    const newName = prompt('Введите новое имя чата');
    if (newName) {
      socket.emit('update_name', { chatId, name: newName });
    }
  };

  const deleteChat = (chatId: string) => {
    if (window.confirm('Удалить этот чат?')) {
      socket.emit('delete_chat', { chatId, userId: Number(userId) });

      setChats(prev => {
        const updated = prev.filter(c => c.id !== chatId);

        if (selectedChat === chatId) {
          if (updated.length > 0) {
            const nextChat = updated[0];
            setSelectedChat(nextChat.id);
            socket.emit('join_chat', { chatId: nextChat.id });
            socket.emit('get_messages', { chatId: nextChat.id });
          } else {
            setSelectedChat(null);
            setMessages([]);
          }
        }

        return updated;
      });
    }
  };

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        <h2>Мои чаты</h2>
        <button onClick={createChat}>+ Новый чат</button>
        <ul>
          {chats.map(chat => (
            <li
              key={chat.id}
              className={selectedChat === chat.id ? 'active' : ''}
              onClick={() => selectChat(chat.id)}
            >
              {chat.name
                ? chat.name.length > 8
                  ? chat.name.slice(0, 7) + '...'
                  : chat.name
                : 'Без имени'}
              <div>
                <button onClick={(e) => { e.stopPropagation(); renameChat(chat.id); }}>✏</button>
                <button onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}>🗑</button>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          <h1>{selectedChat ? chats.find(c => c.id === selectedChat)?.name || 'Чат' : 'Выберите чат'}</h1>
        </header>

        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <span>{msg.text}</span>
            </div>
          ))}
        </div>

        {selectedChat && (
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
        )}
      </main>
    </div>
  );
}
