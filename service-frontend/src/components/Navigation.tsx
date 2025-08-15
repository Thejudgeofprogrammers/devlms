import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import '../styles/Navigation.css';
import { NavigationRight } from "./NavigationRight";

export function Navigation() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetch(`http://localhost:4000/api/users/${userId}/role`)
                .then(res => res.text())
                .then(data => setRole(data))
                .catch(err => console.error("Ошибка при получении роли", err));
        }
    }, []);

    return (
        <nav className="nav">
            <div className="nav-left">
                <NavLink to="/" className="nav-link-logo">
                    <img src={logo} alt="ЛГУ лого" className="logo-img" />
                </NavLink>
                <NavLink to="/" className="nav-link">Мои курсы</NavLink>
                <NavLink to="/teachers" className="nav-link">О преподавателях</NavLink>

                {role === "Admin" && (
                    <NavLink to="/users" className="nav-link">Пользователи</NavLink>
                )}
            </div>
            <NavigationRight />
        </nav>
    );
}