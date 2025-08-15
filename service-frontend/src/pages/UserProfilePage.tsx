import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../styles/ProfilePage.css';

type User = {
    first_entry: string;
    last_entry: string;
};

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

type Course = {
    name: string;
};

export default function UserProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [info, setInfo] = useState<UserInfo | null>(null);
    const [contacts, setContacts] = useState<Contacts | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState("");

    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>("");

    const token = localStorage.getItem("Authorization") || "";
    const API = "http://localhost:4000/api/users";

    useEffect(() => {
        if (!id || !token) {
            setError("Пользователь не авторизован или не найден");
            return;
        }

        const headers = {
            Authorization: token,
            "Content-Type": "application/json",
        };

        async function fetchJson(url: string) {
            const res = await fetch(url, { headers, credentials: "include" });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Ошибка: ${res.status} - ${text}`);
            }
            return res.json();
        }

        Promise.all([
            fetchJson(`${API}/${id}`),
            fetchJson(`${API}/${id}/detal`),
            fetchJson(`${API}/${id}/contacts`),
            fetchJson(`http://localhost:4000/api/course?userId=${id}`),
        ])
            .then(([userData, infoData, contactsData, coursesData]) => {
                setUser(userData);
                setInfo(infoData);
                setContacts(contactsData);
                setCourses(coursesData);
            })
            .catch(() => {
                setError("Ошибка загрузки данных пользователя");
            });
        fetch(`http://localhost:4000/api/photo/${id}/user`, {
            headers: { Authorization: token }
        })
            .then(res => {
                if (!res.ok) throw new Error("Фото не найдено");
                return res.blob();
            })
            .then(blob => {
                setPhotoPreview(URL.createObjectURL(blob));
            })
            .catch(() => {
                console.log("Фото пользователя отсутствует");
            });
    }, [id, token]);

    if (error) return <div className="profile-page error">{error}</div>;
    if (!user || !info || !contacts) return <div className="profile-page">Загрузка...</div>;

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handlePhotoUpload = async () => {
        if (!photo) return alert("Выберите фото");

        const formData = new FormData();
        formData.append("photo", photo);
        try {
            const res = await fetch(`http://localhost:4000/api/photo/${id}/user`, {
                method: "POST",
                headers: {
                    Authorization: token
                },
                body: formData
            });

            if (!res.ok) {
                throw new Error(`Ошибка загрузки: ${res.status}`);
            }

            alert("Фото успешно загружено");
        } catch (err: any) {
            alert(err.message || "Ошибка загрузки фото");
        }
    };

    return (
        <div className="profile-page">
            <header className="profile-header">
                <h1>👤 Просмотр профиля</h1>
            </header>

            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                <div>
                    {photoPreview ? (
                        <img
                            src={photoPreview}
                            alt="Предпросмотр"
                            style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                                background: "#ddd",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            Нет фото
                        </div>
                    )}
                </div>

                <div>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} />
                    <button type="button" onClick={handlePhotoUpload} style={{ marginLeft: 10 }}>
                        Загрузить
                    </button>
                </div>
            </div>


            <div className="profile-grid">
                <section className="profile-card">
                    <h2>🧾 Общая информация</h2>
                    <p><strong>ФИО:</strong> {`${info.fam} ${info.name} ${info.surname}`}</p>
                    <p><strong>Гражданство:</strong> {info.citizenship}</p>
                    <p><strong>Факультет:</strong> {info.faculty}</p>
                    <p><strong>Специальность:</strong> {info.speciality}</p>
                    <p><strong>Профиль:</strong> {info.profile}</p>
                    <p><strong>Уровень подготовки:</strong> {info.level_of_training}</p>
                    <p><strong>Форма обучения:</strong> {info.form_learning}</p>
                    <p><strong>Учебная группа:</strong> {info.study_group}</p>
                    <p><strong>Языки:</strong> {info.language}</p>
                </section>

                <section className="profile-card">
                    <h2>📫 Контакты</h2>
                    <p><strong>Страна:</strong> {contacts.country}</p>
                    <p><strong>Город:</strong> {contacts.city}</p>
                    <p><strong>Часовой пояс:</strong> {contacts.time_zone}</p>
                </section>

                <section className="profile-card">
                    <h2>📚 Курсы</h2>
                    <ul className="profile-list">
                        {courses.map((course, index) => (
                            <li key={index}>{course.name}</li>
                        ))}
                    </ul>
                </section>

                <section className="profile-card">
                    <h2>📅 Доступ</h2>
                    <p><strong>Первый вход:</strong> {new Date(user.first_entry).toLocaleString()}</p>
                    <p><strong>Последний вход:</strong> {new Date(user.last_entry).toLocaleString()}</p>
                </section>
            </div>
        </div>
    );
}
