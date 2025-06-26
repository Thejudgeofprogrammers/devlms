import { useParams, Link } from 'react-router-dom';
import { courses } from './mock';
import '../styles/CourseDetailPage.css';

export default function CourseDetailPage() {
  const { id } = useParams();
  const course = courses.find(c => c.course_id === parseInt(id as string));

  if (!course) {
    return <div className="course-detail">Курс не найден</div>;
  }

  return (
    <div className="course-detail">
      <header className="course-header">
        <h1>{course.title}</h1>
        <p className="course-category">{course.category}</p>
        <img src={course.courseImg} alt={course.title} className="course-image-1" />
      </header>

      <section className="course-nav">
        <ul>
          <li>📘 Курс</li>
          <li>👥 Участники</li>
          <li>📊 Оценки</li>
          <li>🎯 Компетентности</li>
          <li>🗂️ Тематический план</li>
        </ul>
      </section>

      <section className="course-section">
        <h2>📌 Общее</h2>

        <div className="course-block forum">
          <h3>📢 Объявления</h3>
          <p>Форум с объявлениями и новостями по курсу.</p>
        </div>

        <div className="course-block resources">
          <h3>📁 Учебные материалы</h3>
          <ul>
            <li>Инструкции по изучению курса (дневное и заочное)</li>
            <li>Лекции</li>
            <li>Лабораторные работы</li>
            <li>Приложения</li>
          </ul>
        </div>

        <div className="course-block exam">
          <h3>🧠 Экзаменационный тест</h3>
          <p>24 вопроса • 2 попытки • 80 минут</p>
          <p>
            Оценки:
            <br /> &lt;60 — неудовлетворительно
            <br /> 60–72 — удовлетворительно
            <br /> 73–86 — хорошо
            <br /> 87+ — отлично
          </p>
        </div>
      </section>
    <Link to="/" className="back-link">← Назад к курсам</Link>
    </div>
  );
}
