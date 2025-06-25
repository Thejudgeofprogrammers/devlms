import '../styles/ChatListPage.css';
import { aiChats, userChats } from './mock';

export default function ChatListPage() {
  return (
    <div className="chat-list-page">
      <div className="chat-column">
        <h2>Чаты с людьми</h2>
        {userChats.map(chat => (
          <div key={chat.id} className="chat-card">
            <h3>{chat.name}</h3>
            <p>{chat.lastMessage}</p>
          </div>
        ))}
      </div>

      <div className="chat-column">
        <h2>Чаты с ИИ</h2>
        {aiChats.map(chat => (
          <div key={chat.id} className="chat-card">
            <h3>{chat.name}</h3>
            <p>{chat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
