import { useParams, Link } from 'react-router-dom';
import { teachers } from './mock';
import '../styles/TeacherDetailPage.css';

export default function TeacherDetailPage() {
  const { id } = useParams();
  const teacher = teachers.find(t => t.id === parseInt(id as string));

  if (!teacher) return <p>Преподаватель не найден</p>;

  return (
    <div className="teacher-detail">
      <Link to="/teachers" className="back-link">← Назад к списку</Link>
      <h1>{teacher.name}</h1>
      <p><strong>Кафедра:</strong> {teacher.department}</p>
      <p><strong>Должность:</strong> {teacher.role}</p>
      <div className="teacher-image" style={{ backgroundImage: `url(${teacher.photo})` }} />

      {teacher.details && (
        <>
          <h2>📚 Образование</h2>
          {teacher.details.education.map((edu, index) => (
            <p key={index}>
              {edu.field} — {edu.qualification} ({edu.level})
            </p>
          ))}

          <h2>📘 Дисциплины</h2>
          <ul>
            {teacher.details.disciplines.map((disc, i) => (
              <li key={i}>{disc}</li>
            ))}
          </ul>

          <h2>📜 Повышение квалификации</h2>
          <ul>
            {teacher.details.certifications.map((cert, i) => (
              <li key={i}>{cert}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}