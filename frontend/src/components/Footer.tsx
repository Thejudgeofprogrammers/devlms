import { Link } from "react-router-dom";
import "../styles/GetStartedPage.css";
import "../styles/Footer.css"

export function Footer() {
  return (
    <footer className="footer" style={{ marginTop: "auto", padding: "1rem 0" }}>
      <Link to="/about" className="link-url">О ЛГУ</Link>
      <Link to="/links" className="link-url">Официальные ресурсы</Link>
    </footer>
  );
}