import '../styles/ProfilePage.css';

export default function ProfilePage() {
  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>👤 Профиль пользователя</h1>
      </header>

      <div className="profile-grid">
        <section className="profile-card">
          <h2>🧾 Общая информация</h2>
          <p><strong>ФИО:</strong> Кошкин Артем Андреевич</p>
          <p><strong>Дата рождения:</strong> 07.07.2004</p>
          <p><strong>Гражданство:</strong> Россия</p>
          <p><strong>Факультет:</strong> Факультет математики и информатики</p>
          <p><strong>Специальность:</strong> 09.03.03 Прикладная информатика</p>
          <p><strong>Профиль:</strong> Прикладная информатика в экономике</p>
          <p><strong>Уровень подготовки:</strong> Бакалавриат</p>
          <p><strong>Форма обучения:</strong> Очная</p>
          <p><strong>Учебная группа:</strong> 22-124-1</p>
          <p><strong>Языки:</strong> Русский</p>
        </section>

        <section className="profile-card">
          <h2>📫 Контакты</h2>
          <p><strong>Email:</strong> St000044776@lgumail.ru</p>
          <p><strong>Страна:</strong> Россия</p>
          <p><strong>Город:</strong> Санкт-Петербург</p>
          <p><strong>Часовой пояс:</strong> Europe/Moscow</p>
        </section>

        <section className="profile-card">
          <h2>📚 Курсы</h2>
          <ul className="profile-list">
            <li>Численные методы</li>
            <li>Основы управления ИТ-проектами</li>
            <li>Операционные системы</li>
            <li>Физика</li>
            <li>Информационное обеспечение управления</li>
            <li>Вычислительные системы, сети и телекоммуникации</li>
            <li>Базы данных</li>
            <li>Прикладные методы исследовательской деятельности</li>
            <li>Основы искусственного интеллекта</li>
            <li>Архитектура компьютера</li>
          </ul>
        </section>

        <section className="profile-card">
          <h2>📅 Доступ</h2>
          <p><strong>Первый вход:</strong> 12 декабря 2023, 13:24</p>
          <p><strong>Последний вход:</strong> 26 июня 2025, 01:33</p>
        </section>
      </div>
    </div>
  );
}
