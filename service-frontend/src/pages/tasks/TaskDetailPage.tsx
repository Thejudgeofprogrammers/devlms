import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../../styles/TaskDetalPage.css';

interface Task {
    task_id: number;
    title: string;
    description?: string;
    deadline?: string;
}

export default function TaskDetailPage() {
    const { course_id, task_id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [role, setRole] = useState<string | null>(null);

    // Загружаем задачу
    useEffect(() => {
        async function loadTask() {
            try {
                const res = await fetch(`http://localhost:4000/api/course/${course_id}/tasks/${task_id}`);
                const data = await res.json();
                setTask(data);
            } catch (err) {
                console.error("Ошибка загрузки задачи", err);
            }
        }
        loadTask();
    }, [course_id, task_id]);

    // Загружаем роль пользователя
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetch(`http://localhost:4000/api/users/${userId}/role`)
                .then(res => res.text())
                .then(data => setRole(data))
                .catch(err => console.error("Ошибка при получении роли", err));
        }
    }, []);

    async function handleDelete() {
        const ok = window.confirm('Удалить задачу?');
        if (!ok) return;
        const res = await fetch(`http://localhost:4000/api/course/${course_id}/tasks/${task_id}`, {
            method: 'DELETE'
        });
        if (res.ok) navigate(`/courses/${course_id}/tasks`);
    }

    if (!task) return <p>Загрузка...</p>;

    function formatDeadlineWithCountdown(deadline: string): string {
        const deadlineDate = new Date(deadline);
        const today = new Date();
        deadlineDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const formattedDate = deadlineDate.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        if (diffDays > 0) {
            return `${formattedDate} (осталось ${diffDays} дн.)`;
        } else if (diffDays === 0) {
            return `${formattedDate} (дедлайн сегодня)`;
        } else {
            return `${formattedDate} (просрочено ${Math.abs(diffDays)} дн.)`;
        }
    }

    return (
        <div className="task-detail-page">
            <h1>{task.title}</h1>
            <p>{task.description}</p>
            <p>
                📅 {task.deadline ? formatDeadlineWithCountdown(task.deadline) : ''}
            </p>

            {(role === "Admin" || role === "Teacher") && (
                <>
                    <Link to={`/courses/${course_id}/tasks/${task_id}/edit`}>✏️ Редактировать</Link> &nbsp;
                    <button onClick={handleDelete}>🗑 Удалить</button>
                </>
            )}

            <br />
            <Link to={`/courses/${course_id}/tasks`}>← Назад</Link>
        </div>
    );
}
