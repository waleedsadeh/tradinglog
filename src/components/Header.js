import '../styles/Header.css';
import logo from '../logo.png';
// import {NavLink} from 'react-router-dom';
function Header() {
    return (
        <div className='Header'>
            {/* Logo links to Home */}
                <img src={logo} className='Header-logo' alt='logo'/>
            {/* Navigation Links */}
            <div className='Header-links'>
                <ul>
                    <li>Pricing</li>
                    <li>Contact Us</li>
                    <li>Log in</li>
                    <li className='Sign-up-button'>Sign up</li>
                </ul>
            </div>
        </div>
    );
}

export default Header;