import '../styles/FriendsPage.css';
import { friends } from './mock';
import { useNavigate } from 'react-router-dom';

export default function FriendsPage() {
  const navigate = useNavigate();

  const handleMessageClick = (id: number) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="friends-page">
      <header className="friends-header">
        <h1>👥 Мои друзья</h1>
      </header>

      <div className="friends-list">
        {friends.map(friend => (
          <div className="friend-card" key={friend.id}>
            <div className={`status-dot ${friend.status}`} />
            <div className="friend-info">
              <h3>{friend.name}</h3>
              <p>Группа: {friend.group}</p>
              <p className="status-label">Статус: {friend.status}</p>
              <button className="message-button" onClick={() => handleMessageClick(friend.id)}>
                💬 Написать сообщение
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}