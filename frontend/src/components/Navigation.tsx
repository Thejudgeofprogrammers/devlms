import { NavLink } from "react-router-dom"
import logo from "../assets/logo.png"; 
import '../styles/Navigation.css';

export function Navigation() {
    return (
        <nav className='nav'>
            <NavLink to='/' className='nav-link-logo'>
                <img src={logo} alt="ЛГУ лого" className="logo-img" />
            </NavLink>
            <NavLink to='/' className='nav-link'>GetStarted</NavLink>
            <NavLink to='/about' className='nav-link'>История ЛГУ</NavLink>
            <NavLink to='/links' className='nav-link'>FAQ</NavLink>
        </nav>
    )
}