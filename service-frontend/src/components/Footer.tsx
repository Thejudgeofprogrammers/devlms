import { Link } from "react-router-dom";
import "../styles/Footer.css"

export function Footer() {
  return (
    <footer className="footer">
      <Link to="/about" className="link-url">О ЛГУ</Link>
      <Link to="/links" className="link-url">Официальные ресурсы</Link>
    </footer>
  );
}