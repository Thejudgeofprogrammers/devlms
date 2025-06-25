import { NavLink } from "react-router-dom"
import logo from "../assets/logo.png"; 
import '../styles/Navigation.css';

export function Navigation() {
    return (
        <nav className="nav">
        <div className="nav-left">
            <NavLink to="/" className="nav-link-logo">
            <img src={logo} alt="ЛГУ лого" className="logo-img" />
            </NavLink>
            <NavLink to="/" className="nav-link">GetStarted</NavLink>
            <NavLink to="/about" className="nav-link">История ЛГУ</NavLink>
            <NavLink to="/links" className="nav-link">FAQ</NavLink>
        </div>
        <div className="nav-right">
            <NavLink to="/register" className="nav-link">Регистрация</NavLink>
            <NavLink to="/login" className="nav-link">Авторизация</NavLink>
        </div>
        </nav>
    )
}