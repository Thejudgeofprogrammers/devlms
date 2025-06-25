import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

export default function LinksPage() {
  const navigate = useNavigate();

  return (
    <main className="main-content">
      <div className="container-a">
        <h1 className="title">Официальные ресурсы ЛГУ</h1>
        <p className="subtitle">
          Здесь собраны ключевые официальные ресурсы университета: сайт, библиотека, приёмная комиссия и расписание занятий.
        </p>

        <div className="resource-grid">
          <div className="resource-card">
            <h3>🌐 Официальный сайт</h3>
            <p>Актуальные новости, события, документы и структура ЛГУ.</p>
            <a
              href="https://www.spbu.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              Перейти на сайт →
            </a>
          </div>

          <div className="resource-card">
            <h3>📖 Электронная библиотека</h3>
            <p>Доступ к книгам, журналам, статьям и научным публикациям.</p>
            <a
              href="https://library.spbu.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              Перейти в библиотеку →
            </a>
          </div>

          <div className="resource-card">
            <h3>📝 Приёмная комиссия</h3>
            <p>Информация о поступлении, датах приёма, документах и баллах.</p>
            <a
              href="https://abit.spbu.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              Подробнее о поступлении →
            </a>
          </div>

          <div className="resource-card">
            <h3>📅 Расписание занятий</h3>
            <p>Расписание лекций, семинаров и экзаменов для всех факультетов.</p>
            <a
              href="https://rasp.spbu.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              Открыть расписание →
            </a>
          </div>
        </div>

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
