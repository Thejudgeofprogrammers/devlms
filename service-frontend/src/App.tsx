import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from './components/Navigation';
import { Footer } from "./components/Footer";
import './App.css';
import UserCoursesPage from "./pages/UserCource";
import TeachersPage from "./pages/TeacherPages";
import TeacherDetailPage from "./pages/TeacherDetailPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ChatPageGIGA from "./pages/ChatPageGIGA";
import ProfilePage from "./pages/ProfilePage";
import ChatListPage from "./pages/ChatListPage";
import FriendsPage from "./pages/FriendsPage";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
  
    if (token) {
      localStorage.setItem("Authorization", `Bearer ${token}`);

      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      fetch(`http://localhost:4000/api/redis/session`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Ошибка запроса: ${res.status} - ${text}`);
          }
          return res.json();
        })
        .then((data) => {
          const userId = data.userId || data;
          if (userId) {
            localStorage.setItem("userId", userId);
            console.log("Получен userId:", userId);
          }
        })
        .catch((err) => {
          console.error("Ошибка получения userId:", err);
        });
    }
  }, []);

  return (
    <Router>
      <div className="app-wrapper">
        <Navigation />
        <main className="content-wrapper">
          <Routes>
            <Route path="/" element={<UserCoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/teachers/:id" element={<TeacherDetailPage />} />
            <Route path="/chat_llm" element={<ChatPageGIGA />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chats" element={<ChatListPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/chats/:id" element={<ChatPageGIGA />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
