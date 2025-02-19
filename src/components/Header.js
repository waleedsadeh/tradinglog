import '../styles/Header.css';
import logo from '../logo.png';

function Header() {
    return (
        <div className='Header'>
            <img src={logo} className='Header-logo' alt='logo'/>
            <div className='link1'>

            </div>
            <div className='link2'>

            </div>
        </div>
    );
}

export default Header;