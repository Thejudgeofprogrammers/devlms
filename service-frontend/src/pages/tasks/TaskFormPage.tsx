import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/TaskFormPageStyles.css';

export default function TaskFormPage() {
    const { course_id, task_id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(task_id);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');

    useEffect(() => {
        if (isEdit) {
            fetch(`http://localhost:4000/api/course/${course_id}/tasks/${task_id}`)
                .then(res => res.json())
                .then(t => {
                    setTitle(t.title);
                    setDescription(t.description || '');
                    setDeadline(t.deadline?.substring(0, 10) || '');
                });
        }
    }, [isEdit, course_id, task_id]);

    async function handleSubmit(e: any) {
        e.preventDefault();
        const body = { title, description, deadline };
        const url = isEdit
            ? `http://localhost:4000/api/course/${course_id}/tasks/${task_id}`
            : `http://localhost:4000/api/course/${course_id}/tasks`;
        const method = isEdit ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method, headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (res.ok) navigate(`/courses/${course_id}/tasks`);
    }

    return (
        <div className="task-form-page">
            <h1>{isEdit ? 'Редактировать' : 'Создать'} задачу</h1>
            <form onSubmit={handleSubmit} className="task-form">
                <label className="task-label">
                    Название:
                    <input
                        required
                        className="task-input"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </label>
                <label className="task-label">
                    Описание:
                    <textarea
                        className="task-textarea"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </label>
                <label className="task-label">
                    Дедлайн:
                    <input
                        type="date"
                        className="task-input"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                    />
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="task-button">
                        {isEdit ? 'Сохранить' : 'Создать'}
                    </button>
                    <button type="button" className="task-button" onClick={() => navigate(`/courses/${course_id}/tasks`)}>
                        Назад
                    </button>
                </div>
            </form>
        </div>
    );

}
