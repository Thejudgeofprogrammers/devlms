import { useNavigate } from "react-router-dom";
import "../styles/GetStartedPage.css";

export default function LinksPage() {
  const navigate = useNavigate();

  return (
    <main className="get-started">
      <div className="container">
        <h1 className="title">Официальные ресурсы ЛГУ</h1>

        <ul style={{ listStyle: "none", paddingLeft: 0, color: "#444", textAlign: "left", marginBottom: "3rem" }}>
          <li style={{ marginBottom: "0.75rem" }}>
            <a href="https://www.spbu.ru" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>
              Официальный сайт ЛГУ
            </a>
          </li>
          <li style={{ marginBottom: "0.75rem" }}>
            <a href="https://library.spbu.ru" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>
              Библиотека ЛГУ
            </a>
          </li>
          <li style={{ marginBottom: "0.75rem" }}>
            <a href="https://abit.spbu.ru" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>
              Приёмная комиссия
            </a>
          </li>
          <li style={{ marginBottom: "0.75rem" }}>
            <a href="https://rasp.spbu.ru" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>
              Расписание занятий
            </a>
          </li>
        </ul>

        <div className="button-group">
          <button className="primary-button" onClick={() => navigate("/")}>
            Главная
          </button>
          <button className="secondary-button" onClick={() => navigate("/about")}>
            О ЛГУ
          </button>
        </div>
      </div>
    </main>
  );
}