import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CreateTeacherPage.css'
export default function CreateTeacherPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        department: '',
        job_title: '',
        education: '',
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:4000/api/teachers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) navigate('/teachers');
            else alert('Ошибка при создании');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="create-teacher-page">
            <h2>Добавить преподавателя</h2>
            <form onSubmit={handleSubmit}>
                <input name="department" placeholder="Кафедра" onChange={handleChange} required />
                <input name="job_title" placeholder="Должность" onChange={handleChange} required />
                <input name="education" placeholder="Образование" onChange={handleChange} required />
                <button type="submit">Создать</button>
            </form>
        </div>
    );
}
