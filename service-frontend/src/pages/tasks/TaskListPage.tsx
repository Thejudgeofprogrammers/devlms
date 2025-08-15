import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../styles/TaskListPage.css';

interface Task {
    task_id: number;
    title: string;
    deadline?: string;
}

export default function TaskListPage() {
    const { course_id } = useParams();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [role, setRole] = useState<string | null>(null);

    // Загружаем задачи
    useEffect(() => {
        async function loadTasks() {
            try {
                const res = await fetch(`http://localhost:4000/api/course/${course_id}/tasks`);
                const data = await res.json();
                setTasks(data);
            } catch (err) {
                console.error("Ошибка загрузки задач", err);
            }
        }
        loadTasks();
    }, [course_id]);

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

    return (
        <div className="tasks-page">
            <Link to={`/courses/${course_id}`} className="back-link">← Назад к курсу</Link>
            <h1>Задачи курса #{course_id}</h1>

            {(role === "Admin" || role === "Teacher") && (
                <Link to={`/courses/${course_id}/tasks/new`} className="create-btn">
                    + Добавить задачу
                </Link>
            )}

            <ul className="tasks-list">
                {tasks.map((t) => (
                    <li key={t.task_id}>
                        <Link to={`/courses/${course_id}/tasks/${t.task_id}`}>
                            {t.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
