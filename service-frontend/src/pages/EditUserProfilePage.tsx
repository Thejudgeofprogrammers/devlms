import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../styles/ProfilePage.css';

type UserInfo = {
    name: string;
    fam: string;
    surname: string;
    citizenship: string;
    faculty: string;
    speciality: string;
    profile: string;
    level_of_training: string;
    form_learning: string;
    study_group: string;
    language: string;
};

type Contacts = {
    country: string;
    city: string;
    time_zone: string;
};

export default function EditUserProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [info, setInfo] = useState<UserInfo | null>(null);
    const [contacts, setContacts] = useState<Contacts | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("Authorization") || "";
    const API = "http://localhost:4000/api/users";

    useEffect(() => {
        if (!id || !token) {
            setError("Нет доступа или ID");
            return;
        }

        const headers = {
            Authorization: token,
            "Content-Type": "application/json",
        };

        async function fetchJson(url: string) {
            const res = await fetch(url, { headers });
            if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`);
            return res.json();
        }

        Promise.all([
            fetchJson(`${API}/${id}/detal`),
            fetchJson(`${API}/${id}/contacts`)
        ])
            .then(([infoData, contactsData]) => {
                setInfo(infoData);
                setContacts(contactsData);
                setLoading(false);
            })
            .catch(() => {
                setError("Не удалось загрузить данные пользователя");
                setLoading(false);
            });
    }, [id]);

    const handleInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!info) return;
        setInfo({ ...info, [e.target.name]: e.target.value });
    };

    const handleContactsChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!contacts) return;
        setContacts({ ...contacts, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!info || !contacts) return;

        try {
            const res = await fetch(`${API}/${id}/profile`, {
                method: "PUT",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userInfo: info, contacts }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Ошибка: ${res.status} - ${text}`);
            }

            alert("Профиль обновлён");
            navigate(`/users/${id}`);
        } catch (err: any) {
            alert(err.message || "Ошибка при обновлении");
        }
    };

    if (loading) return <div className="profile-page">Загрузка...</div>;
    if (error) return <div className="profile-page error">{error}</div>;
    if (!info || !contacts) return null;

    return (
        <form className="profile-page profile-grid" onSubmit={handleSubmit}>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <h1>✏️ Редактирование профиля пользователя</h1>
            </div><br></br>

            <section className="profile-card">
                <h2>🧾 Общая информация</h2>
                {Object.entries(info)
                    .filter(([key]) => key !== "user_info_id")
                    .map(([key, value]) => (
                        <div key={key} style={{ marginBottom: 8 }}>
                            <label>
                                <strong>{key}:</strong>{" "}
                                <input
                                    name={key}
                                    value={value}
                                    onChange={handleInfoChange}
                                    style={{ width: "100%" }}
                                    required
                                />
                            </label>
                        </div>
                    ))}
            </section>

            <section className="profile-card">
                <h2>📫 Контакты</h2>
                {Object.entries(contacts)
                    .filter(([key]) => key !== "contact_id")
                    .map(([key, value]) => (
                        <div key={key} style={{ marginBottom: 8 }}>
                            <label>
                                <strong>{key}:</strong>{" "}
                                <input
                                    name={key}
                                    value={value}
                                    onChange={handleContactsChange}
                                    style={{ width: "100%" }}
                                    required
                                />
                            </label>
                        </div>
                    ))}
            </section>

            <button type="submit" style={{ marginTop: 20 }}>
                Сохранить
            </button>
            <button type="button" onClick={() => navigate(`/users/${id}`)} style={{ marginLeft: 10, marginTop: 20 }}>
                Отмена
            </button>
        </form>
    );
}