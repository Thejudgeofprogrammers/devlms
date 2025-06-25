import { Link } from 'react-router-dom';
import '../styles/TeachersPage.css';
import { teachers } from './mock';

export default function TeachersPage() {
  return (
    <div className="teachers-page">
      <header className="teachers-header">
        <h1>👨‍🏫 Преподаватели кафедр</h1>
      </header>

      <section className="teachers-section">
        <h2>📋 Список преподавателей</h2>
        <div className="teacher-list">
          {teachers.map((teacher) => (
            <Link
              to={`/teachers/${teacher.id}`}
              className="teacher-card"
              key={teacher.id}
            >
              <div
                className="teacher-photo"
                style={{ backgroundImage: `url(${teacher.photo})` }}
              />
              <div className="teacher-info">
                <h3>{teacher.name}</h3>
                <p className="teacher-dept">{teacher.department}</p>
                <p className="teacher-role">{teacher.role}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
