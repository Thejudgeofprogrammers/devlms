import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/CreateTeacherPage.css';

export default function EditTeacherPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        department: '',
        job_title: '',
        education: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/teachers/${id}`);
                if (!res.ok) throw new Error('Ошибка при загрузке');
                const data = await res.json();
                setFormData(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacher();
    }, [id]);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:4000/api/teachers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                navigate(`/teachers/${id}`);
            } else {
                alert('Ошибка при обновлении');
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <p>Загрузка...</p>;

    return (
        <div className="create-teacher-page">
            <h2>Редактировать преподавателя</h2>
            <form onSubmit={handleSubmit}>
                <input name="department" placeholder="Кафедра" value={formData.department} onChange={handleChange} required />
                <input name="job_title" placeholder="Должность" value={formData.job_title} onChange={handleChange} required />
                <input name="education" placeholder="Образование" value={formData.education} onChange={handleChange} required />
                <button type="submit">Сохранить</button>
            </form>
        </div>
    );
}