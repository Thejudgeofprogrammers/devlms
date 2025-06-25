import { useNavigate } from "react-router-dom";
import pgn from '../assets/lgu.png';
import "../styles/Layout.css";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <main className="main-content">
      <div className="container-b">
        <h1 className="title">История ЛГУ</h1>

        <p className="subtitle">
          ЛГУ (Ленинградский государственный университет) — один из старейших и самых престижных вузов России. Основан в 1819 году, университет прошёл через множество этапов развития, включая расширение факультетов, научных школ и международное сотрудничество.
        </p>
        <p className="subtitle">
          Сегодня ЛГУ является ведущим образовательным и научным центром, где готовят специалистов высокого уровня в различных областях знаний.
        </p>

        <img
          src={pgn}
          alt="ЛГУ фото"
          className="about-image"
        />

        <div className="button-group">
          <button className="primary-button" onClick={() => navigate("/")}>
            Главная
          </button>
          <button className="secondary-button" onClick={() => navigate("/links")}>
            Официальные ресурсы
          </button>
        </div>
      </div>
    </main>
  );
}
