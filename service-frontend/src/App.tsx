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

export default function App() {
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
