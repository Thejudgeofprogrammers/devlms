import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from './components/Navigation';
import { Footer } from "./components/Footer";
import './App.css';
import UserCoursesPage from "./pages/UserCource";
import TeachersPage from "./pages/teachers/TeacherPages";
import TeacherDetailPage from "./pages/teachers/TeacherDetailPage";
import CourseDetailPage from "./pages/courses/CourseDetailPage";
import ChatPageGIGA from "./pages/chats/ChatPageGIGA";
import ProfilePage from "./pages/ProfilePage";
import ChatListPage from "./pages/chats/ChatListPage";
import FriendsPage from "./pages/FriendsPage";
import { useEffect } from "react";
import CreateCoursePage from "./pages/courses/CourceCreatePage";
import TaskListPage from "./pages/tasks/TaskListPage";
import TaskFormPage from "./pages/tasks/TaskFormPage";
import TaskDetailPage from "./pages/tasks/TaskDetailPage";
import UserListPage from "./pages/UserListPage";
import UserProfilePage from "./pages/UserProfilePage";
import EditUserProfilePage from "./pages/EditUserProfilePage";
import CreateTeacherPage from "./pages/teachers/CreateTeacherPage";

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
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/teachers/:id" element={<TeacherDetailPage />} />
            <Route path="/chat_llm" element={<ChatPageGIGA />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chats" element={<ChatListPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/chats/:id" element={<ChatPageGIGA />} />
            <Route path="/create/course" element={<CreateCoursePage />} />
            <Route path="/courses/:course_id" element={<CourseDetailPage />} />
            <Route path="/courses/:course_id/tasks" element={<TaskListPage />} />
            <Route path="/courses/:course_id/tasks/new" element={<TaskFormPage />} />
            <Route path="/courses/:course_id/tasks/:task_id" element={<TaskDetailPage />} />
            <Route path="/courses/:course_id/tasks/:task_id/edit" element={<TaskFormPage />} />
            <Route path="/users" element={<UserListPage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />
            <Route path="/users/:id/edit" element={<EditUserProfilePage />} />
            <Route path="/teachers/create" element={<CreateTeacherPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
