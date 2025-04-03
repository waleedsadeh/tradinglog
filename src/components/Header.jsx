import '../styles/Header.css';
import logo from '../logo.png';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import {menu} from '../assets';
function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className='Header'>
            <NavLink to="/">
                <img src={logo} className='Header-logo' alt='logo'/>
            </NavLink>
            <button className='menu-button' onClick={toggleMenu}>
                <img src={menu} alt="menu" className='menu-icon' />
            </button>
            <div className={`menu ${isMenuOpen ? 'active' : ''}`}>
                <ul>
                    <li><NavLink to="/pricing" onClick={toggleMenu}>Pricing</NavLink></li>
                    <li><NavLink to="/contact" onClick={toggleMenu}>Contact Us</NavLink></li>
                    <li><NavLink to="/login" onClick={toggleMenu}>Log in</NavLink></li>
                    <li className='Sign-up-button'><NavLink to="/signup" onClick={toggleMenu}>Sign up </NavLink></li>
                </ul>
            </div>
        </div>
    );
}

export default Header;