import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from './components/Navigation';
import { Footer } from "./components/Footer";
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navigation />
        <main className="content-wrapper">
          <Routes>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
