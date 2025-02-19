import '../styles/Header.css';
import logo from '../logo.png';

function Header() {
    return (
        <div className='Header'>
            <img src={logo} className='Header-logo' alt='logo'/>
            <div className='Header-links'>
                <ul>
                    <li>Pricing</li>
                    <li>Contact us</li>
                    <li>Log in</li>
                    <li>Sign up</li>
                </ul>
            </div>
        </div>
        
    );
}

export default Header;