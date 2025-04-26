import React, { useState } from "react";
import { Footer, Header } from '../components';
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { 
  signInWithEmail, 
  signUpWithGoogle,
  signUpWithGitHub
} from "../firebase/firebase";
import "../styles/Login.css";
import { google, github } from "../assets"; // Import Google and GitHub icons

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const user = await signInWithEmail(email, password);
      setSuccess(`User logged in successfully: ${user.email}`);
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");

    try {
      const user = await signUpWithGoogle();
      setSuccess(`User logged in successfully with Google: ${user.email}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGitHubLogin = async () => {
    setError("");
    setSuccess("");

    try {
      const user = await signUpWithGitHub();
      setSuccess(`User logged in successfully with GitHub: ${user.email}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="Login">
      <Header />
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back!</h1>
          <p>Please enter your details</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <div className="input-container">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="input-container">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="forgot-password">
                {/*i will need to make the forget a password to have a page for password reset*/}
                <NavLink to="/signup">Forgot Password?</NavLink>
              </div>
            </div>
          </div>
          
          <button type="submit" className="login-button">Log In</button>
        </form>
        
        <div className="social-login">
          <button onClick={handleGoogleLogin} className="social-login-button google-button">
            <img src={google} alt="Google" className="social-icon" />
            Log in with Google
          </button>
          <button onClick={handleGitHubLogin} className="social-login-button github-button">
            <img src={github} alt="GitHub" className="social-icon" />
            Log in with GitHub
          </button>
        </div>
        
        <div className="signup-redirect">
          <p>Don't have an account? <NavLink to="/signup">Sign Up</NavLink></p>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
      <Footer />
    </div>
  );
}

export default Login;
