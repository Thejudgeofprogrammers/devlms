import { Link } from 'react-router-dom';
import '../styles/UserCoursesPage.css';
import { courses } from './mock';

export default function UserCoursesPage() {
    return (
      <div className="user-courses-page">
        <header className="user-header">
          <h1>С возвращением, Артем Андреевич! 👋</h1>
        </header>
  
        <section className="course-summary">
          <h2>📚 Сводка по курсам</h2>
          <div className="course-list">
            {courses.map((course) => (
              <Link
                to={`/courses/${course.course_id}`}
                className="course-card"
                key={course.course_id}
              >
                <div className="course-image" style={{ backgroundImage: `url(${course.courseImg})` }} />
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p className="course-category">{course.category}</p>
                  <div className="course-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span>{course.progress}% выполнено</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }