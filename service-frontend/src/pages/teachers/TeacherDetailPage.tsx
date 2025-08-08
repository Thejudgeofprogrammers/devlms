import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../../styles/TeacherDetailPage.css';

type Teacher = {
    teacher_id: number;
    job_title: string;
    department: string;
    education: string;
};

export default function TeacherDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/teachers/${id}`);
                if (!res.ok) throw new Error('Ошибка при получении данных');
                const data = await res.json();
                setTeacher(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacher();
    }, [id]);

    const handleDelete = async () => {
        const confirmed = window.confirm('Вы уверены, что хотите удалить этого преподавателя?');
        if (!confirmed) return;

        try {
            const res = await fetch(`http://localhost:4000/api/teachers/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                navigate('/teachers');
            } else {
                alert('Ошибка при удалении');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = () => {
        navigate(`/teachers/${id}/edit`);
    };

    if (loading) return <p>Загрузка...</p>;
    if (!teacher) return <p>Преподаватель не найден</p>;

    return (
        <div className="teacher-detail">
            <Link to="/teachers" className="back-link">← Назад к списку</Link>

            <h1>{teacher.job_title}</h1>

            <div className="teacher-info">
                <div className="info-row">
                    <span className="label">Кафедра:</span>
                    <span className="value">{teacher.department}</span>
                </div>
                <div className="info-row">
                    <span className="label">Образование:</span>
                    <span className="value">{teacher.education}</span>
                </div>
            </div>

            <div className="actions">
                <button className="edit-button" onClick={handleEdit}>✏️ Изменить</button>
                <span className="padd"></span>
                <button className="delete-button" onClick={handleDelete}>🗑️ Удалить</button>
            </div>
        </div>
    );
}