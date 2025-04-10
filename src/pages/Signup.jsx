import React, { useState } from "react";
import { Header } from '../components';
import { signUpWithEmail, signUpWithGoogle, signUpWithGitHub } from "../firebase/firebase";

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
    <div>
      <Header/>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={handleGoogleSignup}>Sign Up with Google</button>
      <button onClick={handleGitHubSignup}>Sign Up with GitHub</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default Signup;
