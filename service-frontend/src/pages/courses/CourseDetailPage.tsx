import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../../styles/CourseDetailPage.css'

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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>{course.name}</h1>
                <button className="delete-btn" onClick={handleDelete}>Удалить курс</button>
            </div>

            <p><strong>План курса:</strong> {course.plan_course}</p>

            {/* блок задач */}
            <div className="course-tasks-links">
                <h2>Задачи по курсу</h2>
                <Link to={`/courses/${course_id}/tasks`} className="tasks-link">📋 Посмотреть задачи</Link><br/>
                <Link to={`/courses/${course_id}/tasks/new`} className="tasks-link">➕ Добавить задачу</Link>
            </div>
        </div>
    );
}
