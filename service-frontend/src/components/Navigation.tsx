import { NavLink } from "react-router-dom"
import logo from "../assets/logo.png";
import '../styles/Navigation.css';
import { NavigationRight } from "./NavigationRight";

export function Navigation() {
    return (
        <nav className="nav">
        <div className="nav-left">
            <NavLink to="/" className="nav-link-logo">
                <img src={logo} alt="ЛГУ лого" className="logo-img" />
            </NavLink>
            <NavLink to="/" className="nav-link">Мои курсы</NavLink>
            <NavLink to="/teachers" className="nav-link">О преподавателях</NavLink>
        </div>
            <NavigationRight />
        </nav>
    )
}