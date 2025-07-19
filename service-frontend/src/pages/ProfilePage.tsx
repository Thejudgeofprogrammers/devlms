import { ChangeEvent, FormEvent, useEffect, useState } from "react";
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

export default function ProfilePage() {
  console.log("ProfilePage рендерится");
  const [user, setUser] = useState<User | null>(null);
  const [info, setInfo] = useState<UserInfo | null>(null);
  const [contacts, setContacts] = useState<Contacts | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [token, setToken] = useState(localStorage.getItem("Authorization") || "");


  const API = "http://localhost:4000/api/users";

  useEffect(() => {
    console.log("useEffect сработал");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("Authorization");
    console.log(userId, token)
    if (!userId || !token) {
      setError("Пользователь не авторизован");
      return;
    }

    const headers = {
      Authorization: token,
      "Content-Type": "application/json",
    };

    async function fetchJson(url: string) {
      console.log("Запрос на URL:", url);
      console.log("Headers:", headers);
      const res = await fetch(url, {
        headers,
        credentials: 'include',
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Ошибка запроса: ${res.status} - ${errorText}`);
      }
      return res.json();
    }
    
    Promise.all([
      fetchJson(`${API}/${userId}`),
      fetchJson(`${API}/${userId}/detal`),
      fetchJson(`${API}/${userId}/contacts`),
      fetchJson(`${API}/${userId}/courses`),
    ])
      .then(([userData, infoData, contactsData, coursesData]) => {
        setUser(userData);
        setInfo(infoData);
        setContacts(contactsData);
        setCourses(coursesData);
      })
      .catch(() => {
        setError("Ошибка загрузки профиля");
      });
  }, []);

const handleUserIdChange = (e: ChangeEvent<HTMLInputElement>) => {
  const val = e.target.value;
  setUserId(val);
  localStorage.setItem("userId", val);
};
const handleTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
  const val = e.target.value;
  setToken(val);
  localStorage.setItem("Authorization", val);
};

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

  const headers = {
    Authorization: token,
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(`${API}/${userId}/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        userInfo: info,
        contacts: contacts,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Ошибка обновления: ${res.status} - ${text}`);
    }

    alert("Профиль успешно обновлен");
    setEditMode(false);
  } catch (err: any) {
    alert(err.message || "Ошибка обновления профиля");
  }
};

if (error) return <div className="profile-page error">{error}</div>;
if (!user || !info || !contacts) return <div className="profile-page">Загрузка...</div>;



return (
  <div className="profile-page">
    <header className="profile-header">
      <h1>👤 Профиль пользователя</h1>
      <div style={{ marginBottom: 12 }}>
        <label>
          UserId:{" "}
          <input value={userId} onChange={handleUserIdChange} style={{width: 150}} />
        </label>
        <label style={{ marginLeft: 16 }}>
          Token:{" "}
          <input
            value={token}
            onChange={handleTokenChange}
            style={{width: 300}}
            placeholder="Токен (без 'Bearer ')"
          />
        </label>
      </div>
    </header>

    {!editMode ? (
      <>
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
        <button onClick={() => setEditMode(true)} style={{ marginTop: 20 }}>
          Редактировать профиль
        </button>
      </>
    ) : (
      <form className="profile-grid" onSubmit={handleSubmit}>
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
        <button type="button" onClick={() => setEditMode(false)} style={{ marginLeft: 10, marginTop: 20 }}>
          Отмена
        </button>
      </form>
    )}
  </div>
);
}