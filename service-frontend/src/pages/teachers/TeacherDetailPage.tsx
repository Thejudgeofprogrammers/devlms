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
    const [role, setRole] = useState<string | null>(null);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const token = localStorage.getItem("Authorization") || "";

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

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetch(`http://localhost:4000/api/users/${userId}/role`)
                .then(res => res.text())
                .then(data => setRole(data))
                .catch(err => console.error("Ошибка при получении роли", err));
        }
    }, []);

    useEffect(() => {
        if (id) {
            setPhotoUrl(`http://localhost:4000/api/photo/${id}/teacher?${Date.now()}`);
        }
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

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const formData = new FormData();
        formData.append("photo", e.target.files[0]);

        try {
            const res = await fetch(`http://localhost:4000/api/photo/${id}/teacher`, {
                method: "POST",
                headers: {
                    Authorization: token
                },
                body: formData
            });
            if (res.ok) {
                setPhotoUrl(`http://localhost:4000/api/photo/${id}/teacher?${Date.now()}`);
            } else {
                alert("Ошибка загрузки фото");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (!teacher) return <p>Преподаватель не найден</p>;

    return (
        <div className="teacher-detail">
            <Link to="/teachers" className="back-link">← Назад к списку</Link>

            <div className="teacher-card-photo">
                {photoUrl ? (
                    <img src={photoUrl} alt="Фото преподавателя" />
                ) : (
                    <div className="no-photo">Фото отсутствует</div>
                )}
                {role === "Admin" && (
                    <div className="upload-block">
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                    </div>
                )}
            </div>

            <div className="teacher-card-info">
                <h1>{teacher.job_title}</h1>

                <div className="info-row">
                    <span className="label">Кафедра:</span>
                    <span className="value">{teacher.department}</span>
                </div>
                <div className="info-row">
                    <span className="label">Образование:</span>
                    <span className="value">{teacher.education}</span>
                </div>

                {role === "Admin" && (
                    <div className="actions">
                        <button className="edit-button" onClick={handleEdit}>✏️ Изменить</button>
                        <button className="delete-button" onClick={handleDelete}>🗑️ Удалить</button>
                    </div>
                )}
            </div>
        </div>
    );

}
