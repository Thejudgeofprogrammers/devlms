import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../../styles/CourseDetailPage.css';

interface Course {
    course_id: number;
    name: string;
    plan_course: string;
}

export default function CourseDetailPage() {
    const { course_id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCourse() {
            try {
                const response = await fetch(`http://localhost:4000/api/course/${course_id}`);
                const data = await response.json();
                setCourse(data);
            } catch (err) {
                console.error('Ошибка загрузки курса', err);
            } finally {
                setLoading(false);
            }
        }

        fetchCourse();
    }, [course_id]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetch(`http://localhost:4000/api/users/${userId}/role`)
                .then(res => res.text())
                .then(data => setRole(data))
                .catch(err => console.error("Ошибка при получении роли", err));
        }
    }, []);

    async function handleDelete() {
        const confirmDelete = window.confirm('Вы точно хотите удалить курс?');
        if (!confirmDelete) return;

        const response = await fetch(`http://localhost:4000/api/course/${course_id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            navigate('/');
        } else {
            alert('Не удалось удалить курс');
        }
    }

    if (loading) return <p>Загрузка...</p>;
    if (!course) return <p>Курс не найден</p>;

    return (
        <div className="course-detail">
            <Link to="/" className="back-link">← Назад к списку</Link>

            <div className="course-detail-header">
                <img
                    src={`http://localhost:4000/api/photo/${course_id}/course?${Date.now()}`}
                    alt="Фото курса"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/temp.jpg';
                    }}
                />
                <div style={{ flex: 1 }}>
                    <h1 className="course-title">{course.name}</h1>
                    <div className="course-actions">
                        {role === "Admin" && (
                            <><button className="delete-btn" onClick={handleDelete}>Удалить курс</button><Link to={`/courses/${course_id}/edit`} className="edit-btn">✏️ Изменить курс</Link></>
                        )}
                        <Link to={`/courses/${course_id}/participants`} className="edit-btn">✏️ Участники</Link>
                    </div>

                </div>
            </div>

            <p className="course-plan">
                <strong>План курса:</strong> {course.plan_course}
            </p>

            <div className="course-tasks-links">
                <h2>Задачи по курсу</h2>
                <Link to={`/courses/${course_id}/tasks`} className="tasks-link">📋 Посмотреть задачи</Link>
                <br />
                {(role === "Admin" || role === "Teacher") && (
                    <Link to={`/courses/${course_id}/tasks/new`} className="tasks-link">➕ Добавить задачу</Link>
                )}
            </div>
        </div>

    );
}
