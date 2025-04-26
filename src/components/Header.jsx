import '../styles/Header.css';
import '../styles/Signup.css'; // Import signup styles
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { menu, logo } from '../assets';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        
        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
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
                    {currentUser ? (
                        // Authenticated user menu
                        <>
                            <li><NavLink to="/dashboard" onClick={toggleMenu}>Dashboard</NavLink></li>
                            <li><NavLink to="/profile" onClick={toggleMenu}>Profile</NavLink></li>
                            <li className='log-out-button'>
                                <NavLink to="#" onClick={(e) => { 
                                    e.preventDefault(); 
                                    handleLogout(); 
                                    toggleMenu(); 
                                }}>
                                    Log out
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        // Non-authenticated user menu
                        <>
                            <li><NavLink to="/pricing" onClick={toggleMenu}>Pricing</NavLink></li>
                            <li><NavLink to="/contact" onClick={toggleMenu}>Contact Us</NavLink></li>
                            <li><NavLink to="/login" onClick={toggleMenu}>Log in</NavLink></li>
                            <li className='Sign-up-button'><NavLink to="/signup" onClick={toggleMenu}>Sign up</NavLink></li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Header;