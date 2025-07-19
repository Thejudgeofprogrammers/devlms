import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import profileIcon from "../../public/reshot-icon-profile-avatar-QKH4XD2YFV.svg"; 
import settingsIcon from "../../public/reshot-icon-settings-RQMZTY9CK2.svg";
import chatIcon from "../../public/reshot-icon-chat-CXDEM9ZGYL.svg"; 
import '../styles/Navigation.css';

export function NavigationRight() {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const chatsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        settingsRef.current && !settingsRef.current.contains(e.target as Node)
      ) setSettingsOpen(false);

      if (
        profileRef.current && !profileRef.current.contains(e.target as Node)
      ) setProfileOpen(false);

      if (
        chatsRef.current && !chatsRef.current.contains(e.target as Node)
      ) setChatOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("Authorization");
  
    try {
      await fetch("http://localhost:4000/api/users/logout", {
        method: "POST",
        headers: {
          Authorization: token || "",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (e) {
      console.error("Ошибка при logout", e);
    } finally {
      localStorage.clear();
      window.location.href = "http://localhost:5173/";
    }
  };

  return (
    <div className="nav-right">
      <div className="nav-dropdown" ref={chatsRef}>
        <img
          src={chatIcon}
          alt="Чаты"
          className="logo-img logo-svg nav-icon"
          onClick={() => setChatOpen(prev => !prev)}
        />
        {isChatOpen && (
          <div className="dropdown-menu">
            <NavLink to="/chats" className="drop-link">Чаты</NavLink>
            <NavLink to="/chat_llm" className="drop-link">Чат с ИИ</NavLink>
          </div>
        )}
      </div>
      <div className="nav-dropdown" ref={settingsRef}>
        <img
          src={settingsIcon}
          alt="Настройки"
          className="logo-img logo-svg nav-icon"
          onClick={() => setSettingsOpen(prev => !prev)}
        />
        {isSettingsOpen && (
          <div className="dropdown-menu">
            <NavLink to="/settings/general" className="drop-link">Общие</NavLink>
            <NavLink to="/settings/theme" className="drop-link">Тема</NavLink>
            <NavLink to="/settings/notifications" className="drop-link">Уведомления</NavLink>
          </div>
        )}
      </div>

      <div className="nav-dropdown" ref={profileRef}>
        <img
          src={profileIcon}
          alt="Профиль"
          className="logo-img logo-svg nav-icon"
          onClick={() => setProfileOpen(prev => !prev)}
        />
        {isProfileOpen && (
          <div className="dropdown-menu">
            <NavLink to="/profile" className="drop-link">Мой профиль</NavLink>
            <NavLink to="/friends" className="drop-link">Друзья</NavLink>
            <button
  type="button"
  className="drop-link logout-button"
  onClick={handleLogout}
  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
>
  Выйти
</button>
          </div>
        )}
      </div>
    </div>
  );
}
