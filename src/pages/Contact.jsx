import React, {useState} from "react";
import { Header, Footer } from '../components';
import '../styles/Contact.css';
import { discord } from '../assets';

function Contact() {
  // Function to handle form submission
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ firstName, lastName, email, phone, message });
    // Reset form
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <div onSubmit={handleSubmit} className="Contact">
      <Header/>
      <div className="contact-container">
        <form className="contact-form-container">
          <h1>Contact Our Team</h1>
          <p>Our friendly team would love to hear from you</p>
          <div className="contact-input-row-container">
            <div className="contact-input-container">
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
            <div className="contact-input-container">
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
          <div className="contact-input-row-container">
            <div className="contact-input-container">
              <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
            </div>
            <div className="contact-input-container">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="phone"
                value={lastName}
                onChange={(e) => phone(e.target.value)}
                required
              /> 
            </div>
          </div>
          <div className="contact-input-row-container">
            <div className="contact-input-container">
              <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="6"
                  maxLength={1000}
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
            </div>
          </div>
          <button type="submit" className="contact-form-button">Send message</button>
          <span className="terms-text">By Clicking on Send message button you accept our Terms Of Use</span>
        </form>

        <div className="contact-discord-container">
          <h2>Chat with us in Discord</h2>
          <div className="discord-logo-container">
            <img src={discord} alt="Discord Logo" className="discord-logo" />
          </div>
            <a 
              href="https://discord.gg/rmJ7KV3t" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="join-discord-button-text">
                Join now
            </a>
          <p className="discord-terms-text">By Clicking on Join now button you will be directed to our Discord Server *</p>
        </div>

      </div>
      <Footer/>
    </div>
  );
}

export default Contact;
