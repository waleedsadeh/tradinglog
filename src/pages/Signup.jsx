import React, { useState } from "react";
import { Footer, Header } from "../components";
import { signUpWithEmail, signUpWithGoogle, signUpWithGitHub } from "../firebase/firebase";
import "../styles/Signup.css";
import { google, github } from "../assets"; // Import Google and GitHub icons

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const user = await signUpWithEmail(email, password, firstName, lastName, phoneNumber);
      setSuccess(`User signed up successfully: ${user.email}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setSuccess("");

    try {
      const user = await signUpWithGoogle(firstName, lastName);
      setSuccess(`User signed up successfully with Google: ${user.email}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGitHubSignup = async () => {
    setError("");
    setSuccess("");

    try {
      const user = await signUpWithGitHub(firstName, lastName);
      setSuccess(`User signed up successfully with GitHub: ${user.email}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="Signup">
      <Header />
      <div className="signup-container">
        <div className="signup-header">
          <h1>Create your account</h1>
          <p>Free now, forever. Upgrade when ready for more.</p>
        </div>
        <div className="social-signup">
          <div className="social-signup-text">
            <p>Faster Sign up With</p>
          </div>
          <div className="social-signup-buttons">
            <button onClick={handleGitHubSignup} className="social-signup-button">
              <img src={github} alt="GitHub" className="social-icon" />
              Sign Up with GitHub
            </button>
            <button onClick={handleGoogleSignup} className="social-signup-button">
              <img src={google} alt="Google" className="social-icon" />
              Sign Up with Google
            </button>
          </div>
        </div>

        <p className="or-divider">OR</p>
        
        <form onSubmit={handleSignup} className="signup-form">
          <div className="form-group">
            <div className="form-row">
              <div className="input-container">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="input-container">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="input-container">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-container">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="input-container">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="password-input-hint">Password with least 10 characters</span>
              </div>
              <div className="input-container">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span className="password-input-hint">Re-enter your password</span>
              </div>
            </div>  
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
      <Footer />
    </div>
  );
}

export default Signup;
