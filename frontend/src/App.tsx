import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from './components/Navigation';
import GetStartedPage from "./pages/GetStartedPage";
import LinksPage from "./pages/LinksPage";
import AboutPage from "./pages/AboutPage";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navigation />
        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route path='/' element={<GetStartedPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/links" element={<LinksPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}