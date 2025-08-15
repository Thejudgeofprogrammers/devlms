import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/TeachersPage.css';

type Teacher = {
  teacher_id: number;
  job_title: string;
  department: string;
  education: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/teachers')
      .then((res) => res.json())
      .then((data) => setTeachers(data))
      .catch((err) => console.error('Ошибка при получении учителей', err));

    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:4000/api/users/${userId}/role`)
        .then(res => res.text())
        .then(data => setRole(data))
        .catch(err => console.error("Ошибка при получении роли", err));
    }
  }, []);

  return (
    <div className="teachers-page">
      <header className="teachers-header">
        <h1>👨‍🏫 Преподаватели кафедр</h1>
        {role === 'Admin' && (
          <Link to="/teachers/create" className="create-button">
            ➕ Добавить преподавателя
          </Link>
        )}
      </header>

      <section className="teachers-section">
        <h2>📋 Список преподавателей</h2>
        <div className="teacher-list">
          {teachers.map((teacher) => {
            const photoUrl = `http://localhost:4000/api/photo/${teacher.teacher_id}/teacher`;
            return (
              <Link
                to={`/teachers/${teacher.teacher_id}`}
                className="teacher-card"
                key={teacher.teacher_id}
              >
                <img
                  src={photoUrl}
                  alt={`Фото преподавателя ${teacher.job_title}`}
                  className="teacher-photo"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/temp.jpg';
                  }}
                />
                <div className="teacher-info">
                  <h3>{teacher.job_title}</h3>
                  <p className="teacher-dept">{teacher.department}</p>
                  <p className="teacher-role">{teacher.education}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}