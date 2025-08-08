import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../styles/TaskListPage.css'

interface Task {
  task_id: number;
  title: string;
  deadline?: string;
}

export default function TaskListPage() {
  const { course_id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`http://localhost:4000/api/course/${course_id}/tasks`);
      const data = await res.json();
      setTasks(data);
    }
    load();
  }, [course_id]);

  return (
    <div className="tasks-page">
      <Link to={`/courses/${course_id}`} className="back-link">← Назад к курсу</Link>
      <h1>Задачи курса #{course_id}</h1>
      <Link to={`/courses/${course_id}/tasks/new`} className="create-btn">+ Добавить задачу</Link>

      <ul className="tasks-list">
        {tasks.map((t) => (
          <li key={t.task_id}>
            <Link to={`/courses/${course_id}/tasks/${t.task_id}`}>{t.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
