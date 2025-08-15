import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/CreateCoursePage.css';

export default function EditCoursePage() {
    const { course_id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [planCourse, setPlanCourse] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);

    useEffect(() => {
        async function fetchCourse() {
            const res = await fetch(`http://localhost:4000/api/course/${course_id}`);
            if (res.ok) {
                const data = await res.json();
                setName(data.name);
                setPlanCourse(data.plan_course);
            }
        }
        fetchCourse();
    }, [course_id]);

    const handlePhotoUpload = async () => {
        if (!photo) return;
        const formData = new FormData();
        formData.append("photo", photo);

        const res = await fetch(`http://localhost:4000/api/photo/${course_id}/course`, {
            method: "POST",
            body: formData
        });

        if (res.ok) {
            alert("Фото курса обновлено");
        } else {
            alert("Не удалось загрузить фото курса");
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:4000/api/course/${course_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, plan_course: planCourse }),
        });

        if (response.ok) {
            navigate(`/courses/${course_id}`);
        } else {
            alert('Не удалось обновить курс');
        }
    };

    return (
        <div className="create-course-page">
            <h1>Редактировать курс</h1>
            <form onSubmit={handleSubmit} className="create-course-form">
                <label>
                    <span>Фото курса:</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                    />
                </label>
                {photo && (
                    <button type="button" onClick={handlePhotoUpload}>
                        Загрузить фото
                    </button>
                )}
                <label>
                    <span>Название курса:</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>

                <label>
                    <span>План курса:</span>
                    <textarea
                        value={planCourse}
                        onChange={(e) => setPlanCourse(e.target.value)}
                        required
                    />
                </label>

                <button type="submit">Сохранить изменения</button>
            </form>
        </div>
    );
}
