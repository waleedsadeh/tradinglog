import '../styles/Header.css';
import logo from '../logo.png';
import { NavLink } from 'react-router-dom';

function Header() {
    return (
        <div className='Header'>
            <NavLink to="/">
                <img src={logo} className='Header-logo' alt='logo'/>
            </NavLink>
            <div className='Header-links'>
                <ul>
                    <li><NavLink to="/pricing">Pricing</NavLink></li>
                    <li><NavLink to="/contact">Contact Us</NavLink></li>
                    <li><NavLink to="/login">Log in</NavLink></li>
                    <li className='Sign-up-button'><NavLink to="/signup">Sign up</NavLink></li>
                </ul>
            </div>
        </div>
    );
}

export default Header;