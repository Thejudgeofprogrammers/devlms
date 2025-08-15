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
import { useEffect, useState } from "react";
import CreateCoursePage from "./pages/courses/CourceCreatePage";
import TaskListPage from "./pages/tasks/TaskListPage";
import TaskFormPage from "./pages/tasks/TaskFormPage";
import TaskDetailPage from "./pages/tasks/TaskDetailPage";
import UserListPage from "./pages/UserListPage";
import UserProfilePage from "./pages/UserProfilePage";
import EditUserProfilePage from "./pages/EditUserProfilePage";
import CreateTeacherPage from "./pages/teachers/CreateTeacherPage";
import EditTeacherPage from "./pages/teachers/EditTeacherPage";
import { AdminRoute } from "./hooks/AdminRoute";
import EditCoursePage from "./pages/courses/EditCoursePage";
import CourseParticipantsPage from "./pages/courses/CourseParticipantsPage";

export default function App() {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("Authorization", `Bearer ${token}`);

      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      fetch("http://localhost:4000/api/redis/session", {
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
          const id = data.userId || data;
          if (id) {
            localStorage.setItem("userId", id);
            setUserId(id);
          }
        })
        .catch((err) => {
          console.error("Ошибка получения userId:", err);
        });
    } else {
      const savedId = localStorage.getItem("userId");
      if (savedId) setUserId(Number(savedId));
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
            <Route path="/courses/:course_id" element={<CourseDetailPage />} />
            <Route path="/courses/:course_id/tasks" element={<TaskListPage />} />
            <Route path="/courses/:course_id/tasks/:task_id" element={<TaskDetailPage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />
            <Route path="/courses/:course_id/participants" element={<CourseParticipantsPage />} />

            <Route
              path="/courses/:course_id/edit"
              element={
                <AdminRoute userId={Number(userId)}>
                  <EditCoursePage />
                </AdminRoute>
              }
            />

            <Route
              path="/users"
              element={
                <AdminRoute userId={Number(userId)}>
                  <UserListPage />
                </AdminRoute>
              }
            />

            <Route
              path="/create/course"
              element={
                <AdminRoute userId={Number(userId)}>
                  <CreateCoursePage />
                </AdminRoute>
              }
            />

            <Route
              path="/courses/:course_id/tasks/new"
              element={
                <AdminRoute userId={Number(userId)}>
                  <TaskFormPage />
                </AdminRoute>
              }
            />

            <Route
              path="/courses/:course_id/tasks/:task_id/edit"
              element={
                <AdminRoute userId={Number(userId)}>
                  <TaskFormPage />
                </AdminRoute>
              }
            />

            <Route
              path="/users/:id/edit"
              element={
                <AdminRoute userId={Number(userId)}>
                  <EditUserProfilePage />
                </AdminRoute>
              }
            />

            <Route
              path="/teachers/create"
              element={
                <AdminRoute userId={Number(userId)}>
                  <CreateTeacherPage />
                </AdminRoute>
              }
            />

            <Route
              path="/teachers/:id/edit"
              element={
                <AdminRoute userId={Number(userId)}>
                  <EditTeacherPage />
                </AdminRoute>
              }
            />
            <Route path="/unauthorized" element={<h1>🚫 Нет доступа</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
