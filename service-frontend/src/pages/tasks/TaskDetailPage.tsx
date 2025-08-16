import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../../styles/TaskDetalPage.css';

interface Task {
    task_id: number;
    title: string;
    description?: string;
    deadline?: string;
}

interface FileItem {
    file_id: number;
    original_name: string;
    mime_type: string;
    size: bigint;
    created_at: string;
}

export default function TaskDetailPage() {
    const { course_id, task_id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [files, setFiles] = useState<FileItem[]>([]);

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
        async function loadFiles() {
            try {
                const res = await fetch(`http://localhost:4000/api/course/${task_id}/files`);
                const data = await res.json();
                setFiles(data);
            } catch (err) {
                console.error("Ошибка загрузки файлов", err);
            }
        }
        if (task_id) loadFiles();
    }, [task_id]);

    async function handleDelete() {
        const ok = window.confirm('Удалить задачу?');
        if (!ok) return;
        const res = await fetch(`http://localhost:4000/api/course/${course_id}/tasks/${task_id}`, {
            method: 'DELETE'
        });
        if (res.ok) navigate(`/courses/${course_id}/tasks`);
    }

    async function handleAddFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;

        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        const res = await fetch(`http://localhost:4000/api/course/${task_id}/files`, {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            const newFile = await res.json();
            setFiles(prev => [...prev, newFile]);
        }
    }

    // === Удаление файла ===
    async function handleDeleteFile(file_id: number) {
        const ok = window.confirm('Удалить файл?');
        if (!ok) return;

        const res = await fetch(`http://localhost:4000/api/course/${task_id}/files/${file_id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            setFiles(prev => prev.filter(f => f.file_id !== file_id));
        }
    }

    // === Скачать файл ===
    function handleDownloadFile(file_id: number) {
        window.open(`http://localhost:4000/api/course/${task_id}/files/${file_id}`, "_blank");
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
            <div className="card">
                <h1>{task.title}</h1>
                <p className="description">{task.description}</p>
                <p className="deadline">📅 {task.deadline ? formatDeadlineWithCountdown(task.deadline) : ''}</p>

                {(role === "Admin" || role === "Teacher") && (
                    <div className="actions">
                        <Link to={`/courses/${course_id}/tasks/${task_id}/edit`} className="btn edit">✏️ Редактировать</Link>
                        <button className="btn delete" onClick={handleDelete}>🗑 Удалить задачу</button>
                    </div>
                )}
            </div>

            <div className="card">
                <h3>📂 Файлы</h3>
                <div className="files-list">
                    {files.map(f => (
                        <div className="file-item" key={f.file_id}>
                            <div className="file-info" onClick={() => handleDownloadFile(f.file_id)}>
                                <span className="file-icon">📄</span>
                                <div>
                                    <div className="file-name">{f.original_name}</div>
                                    <div className="file-meta">{new Date(f.created_at).toLocaleDateString("ru-RU")}</div>
                                </div>
                            </div>
                            {(role === "Admin" || role === "Teacher") && (
                                <div className="file-actions">
                                    <button onClick={() => handleDeleteFile(f.file_id)}>❌</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {(role === "Admin" || role === "Teacher") && (
                    <div className="file-upload">
                        <input type="file" id="fileInput" onChange={handleAddFile} hidden />
                        <label htmlFor="fileInput" className="upload-btn">⬆️ Загрузить файл</label>
                    </div>
                )}
            </div>

            <Link to={`/courses/${course_id}/tasks`} className="back-link">← Назад</Link>
        </div>
    );

}
