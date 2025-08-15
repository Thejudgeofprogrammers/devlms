import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../../styles/CourseParticipantsPage.css";

type Participant = {
    course_id: number;
    user: {
        user_id: number;
        email: string;
    };
};

export default function CourseParticipantsPage() {
    const { course_id } = useParams();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [emailToAdd, setEmailToAdd] = useState("");
    const token = localStorage.getItem("Authorization") || "";

    const fetchParticipants = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/course/${course_id}/participant`);
            if (!res.ok) throw new Error("Ошибка получения участников");
            const data = await res.json();
            console.log(data)
            setParticipants(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, [course_id]);

    const handleAddParticipant = async () => {
        if (!emailToAdd) {
            alert("Введите email");
            return;
        }
        try {
            // 1. Получаем пользователя по email
            const userRes = await fetch(`http://localhost:4000/api/users/${emailToAdd}/email`, {
                headers: { Authorization: token }
            });
            if (!userRes.ok) {
                alert("Пользователь не найден");
                return;
            }
            const user = await userRes.json();
            console.log(user, "user")
            // 2. Добавляем участника по user_id
            const res = await fetch(`http://localhost:4000/api/course/${course_id}/participant/${user.user_id}`, {
                method: "POST",
                headers: { Authorization: token }
            });

            if (res.ok) {
                setEmailToAdd("");
                fetchParticipants();
            } else {
                alert("Ошибка при добавлении");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteParticipant = async (user_id: number) => {
        if (!window.confirm("Удалить участника?")) return;
        try {
            const res = await fetch(`http://localhost:4000/api/course/${course_id}/participant/${user_id}`, {
                method: "DELETE",
                headers: { Authorization: token }
            });
            if (res.ok) {
                fetchParticipants();
            } else {
                alert("Ошибка при удалении");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p>Загрузка...</p>;

    return (
        <div className="course-participants">
            <Link to={`/courses/${course_id}`}>← Назад к курсу</Link>
            <h1>Участники курса</h1>

            <div className="add-participant">
                <input
                    type="email"
                    placeholder="Email пользователя"
                    value={emailToAdd}
                    onChange={(e) => setEmailToAdd(e.target.value)}
                />
                <button onClick={handleAddParticipant}>Добавить участника</button>
            </div>

            <ul className="participants-list">
                {participants.map((p) => (
                    <li key={p.user.user_id} className="participant-item">
                        <Link to={`/users/${p.user.user_id}`} className="participant-link">
                            <img
                                src={`http://localhost:4000/api/photo/${p.user.user_id}/user?${Date.now()}`}
                                alt="Фото пользователя"
                                className="participant-photo"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = '/assets/temp.jpg';
                                }}
                            />
                            <span>
                                <b>{p.user.user_id}</b> {p.user.email}
                            </span>
                        </Link>
                        <button onClick={() => handleDeleteParticipant(p.user.user_id)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
