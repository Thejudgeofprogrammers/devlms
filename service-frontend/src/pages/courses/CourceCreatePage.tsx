import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CreateCoursePage.css';

export default function CreateCoursePage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [planCourse, setPlanCourse] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const response = await fetch('http://localhost:4000/api/course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, plan_course: planCourse }),
        });

        if (response.ok) {
            navigate('/');
        }
    };

    return (
        <div className="create-course-page">
            <h1>Создание курса</h1>
            <form onSubmit={handleSubmit} className="create-course-form">
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

                <button type="submit">Создать курс</button>
            </form>
        </div>
    );
}