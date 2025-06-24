import { useNavigate } from "react-router-dom";
import "../styles/GetStartedPage.css";

export default function GetStartedPage() {
  const navigate = useNavigate();

  return (
    <main className="get-started">
      <div className="container">
        <h1 className="title">Добро пожаловать в LMS ЛГУ</h1>
        <p className="subtitle">
          Интерактивная образовательная платформа для студентов и преподавателей. Учитесь, выполняйте задания и отслеживайте прогресс в одном месте.
        </p>

        <div className="button-group">
          <button className="primary-button" onClick={() => navigate("/register")}>
            Начать обучение
          </button>
          <button className="secondary-button" onClick={() => navigate("/login")}>
            Войти
          </button>
        </div>

        <div className="features">
          <div className="feature-box">
            <h3>📚 Курсы и модули</h3>
            <p>Доступ к учебным материалам, заданиям и прогрессу.</p>
          </div>
          <div className="feature-box">
            <h3>🎓 Рейтинги и оценки</h3>
            <p>Следите за успеваемостью и получайте обратную связь.</p>
          </div>
          <div className="feature-box">
            <h3>🤝 Связь с преподавателями</h3>
            <p>Комментируйте, общайтесь и развивайтесь вместе.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
