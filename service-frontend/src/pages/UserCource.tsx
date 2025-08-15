import { Link, useNavigate } from 'react-router-dom';
import '../styles/UserCoursesPage.css';
import { useEffect, useState } from 'react';

interface User {
    fam: string;
    name: string;
    surname: string;
}

export default function UserCoursesPage() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState<string | null>(null);
    const [courses, setCourses] = useState<any[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const id = Number(userId);
        async function fetchUser() {
            const response = await fetch(`http://localhost:4000/api/users/${id}/detal`);
            const data = await response.json();
            setUser(data);
        }

        async function fetchRole() {
            const response = await fetch(`http://localhost:4000/api/users/${id}/role`);
            const data = await response.text();
            setRole(data);
        }

        async function fetchCourses() {
            const userId = localStorage.getItem('userId');
            try {
                const response = await fetch(`http://localhost:4000/api/course?userId=${userId}`);
                if (!response.ok) {
                    console.error('Ошибка при получении курсов:', response.status);
                    setCourses([]);
                    return;
                }
                const data = await response.json();
                setCourses(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error('Ошибка сети при получении курсов:', e);
                setCourses([]);
            }
        }

        if (id) {
            fetchUser();
            fetchRole();
        }
        fetchCourses();
    }, []);

    const fullName = user ? `${(user as User).fam} ${(user as User).name} ${(user as User).surname}` : 'Пользователь';

    return (
        <div className="user-courses-page">
            <header className="user-header">
                <h1>С возвращением, {fullName}! 👋</h1>
                {role === 'Admin' && (
                    <button className="create-btn" onClick={() => navigate('/create/course')}>
                        Создать курс
                    </button>
                )}
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
                            <div className="course-image">
                                <img
                                    src={`http://localhost:4000/api/photo/${course.course_id}/course`}
                                    alt={course.name}
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = '/assets/temp.jpg';
                                    }}
                                />
                            </div>
                            <div className="course-info">
                                <h3>{course.name}</h3>
                                <p className="course-category">{course.category ?? 'Категория'}</p>
                                <div className="course-progress">
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${course.progress ?? 0}%` }} />
                                    </div>
                                    <span>{course.progress ?? 0}% выполнено</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}