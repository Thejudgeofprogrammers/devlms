import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from './components/Navigation';
import GetStartedPage from "./pages/GetStartedPage";
import LinksPage from "./pages/LinksPage";
import AboutPage from "./pages/AboutPage";
import { Footer } from "./components/Footer";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navigation />
        <main className="content-wrapper">
          <Routes>
            <Route path="/" element={<GetStartedPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/links" element={<LinksPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
