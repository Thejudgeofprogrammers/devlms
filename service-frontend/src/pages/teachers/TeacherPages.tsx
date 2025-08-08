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
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/api/teachers')
            .then((res) => res.json())
            .then((data) => setTeachers(data))
            .catch((err) => console.error('Ошибка при получении учителей', err));
    }, []);

    return (
        <div className="teachers-page">
            <header className="teachers-header">
                <h1>👨‍🏫 Преподаватели кафедр</h1>
                <Link to="/teachers/create" className="create-button">
                    ➕ Добавить преподавателя
                </Link>
            </header>

            <section className="teachers-section">
                <h2>📋 Список преподавателей</h2>
                <div className="teacher-list">
                    {teachers.map((teacher) => (
                        <Link
                            to={`/teachers/${(teacher as Teacher).teacher_id}`}
                            className="teacher-card"
                            key={(teacher as Teacher).teacher_id}
                        >
                            <div className="teacher-info">
                                <h3>{(teacher as Teacher).job_title}</h3>
                                <p className="teacher-dept">{(teacher as Teacher).department}</p>
                                <p className="teacher-role">{(teacher as Teacher).education}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}