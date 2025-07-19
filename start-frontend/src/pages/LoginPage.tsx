import { useState } from "react";
import "../styles/Auth.css";

export default function LoginPage() {
  const [payload, setPayload] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload, password }),
        credentials: "include",
      });
      

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Неверные данные");
        return;
      }

      const data = await response.json();

      localStorage.setItem("Authorization", `Bearer ${data.jwtToken}`);
      localStorage.setItem("userId", data.userId.toString());

      // Редирект
      window.location.href = `http://localhost:5174/?token=${data.jwtToken}&userId=${data.userId}`;
    } catch (err) {
      setError("Сервер недоступен");
    }
  };

  return (
    <div className="auth-container">
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Электронная почта / Логин / Телефон"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="error">{error}</div>}
        <button type="submit">Войти</button>
      </form>
      <p className="auth-link" onClick={() => (window.location.href = "/register")}>
        Нет аккаунта? Зарегистрироваться →
      </p>
    </div>
  );
}
