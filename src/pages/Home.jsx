import React from "react";
import { NavLink } from "react-router-dom";
import { Header,Footer } from '../components';
import "../styles/Home.css";
import {efficient, security, newspaper} from '../assets'

function Home() {
  return (
    <div className="Home">
      <Header />
      
      <div className="field1">
        <div className="field1-left">
          <h1>
            Tired of spreadsheets? <br/>
            Your financial journey <br/>
            starts here
          </h1>
          <p>
            Take control of your investments with TradingLog. Our powerful 
            platform provides real-time tracking, in-depth analysis, and 
            personalized insights to help you make informed decisions.
          </p>
          <div className="button-container">
            <NavLink to="/signup" className="button1">Start Tracking</NavLink>
            <NavLink to="/" className="button2">How Does It Work?</NavLink>
          </div>
        </div>
      </div>

      <div className="field2">
        <h2>Why TradingLog?</h2>
        <div className="features">
          <div className="feature-card">
            <img src={security} alt="Security Icon" />
            <h3>Security and Reliability</h3>
            <p>Your information deserves the best protection. TradingLog keeps your financial information safe and secure.</p>
          </div>
          <div className="feature-card">
            <img src={newspaper} alt="News Icon" />
            <h3>Real-Time News</h3>
            <p>Get instant access to breaking market news. Stay informed and make informed decisions based on the latest changes.</p>
          </div>
          <div className="feature-card">
            <img src={efficient} alt="Simplicity Icon" />
            <h3>Simplicity and Efficiency</h3>
            <p>Who needs spreadsheets? TradingLog makes tracking your investments a breeze. Offering a clean interface and quick access to your financial data.</p>
          </div>
        </div>
      </div>

      <div className="field3">
        <div className="stats-container">
          <div className="stat-card" style={{ background: "linear-gradient(135deg, #80ff00, #f7f7f7)" }}>
            <h3>5000+ Users</h3>
            <p>and counting...</p>
          </div>
          <div className="stat-card" style={{ background: "linear-gradient(210deg, #9B29EE, #f7f7f7)" }}>
            <h3>Free Community</h3>
            <p>Join our Discord</p>
          </div>
          <div className="stat-card" style={{ background: "linear-gradient(45deg, #DC143C, #f7f7f7)" }}>
            <h3>Get Started With Your Freemium Plan</h3>
            <p>Unlock Premium Features</p>
          </div>
          <div className="stat-card" style={{ background: "linear-gradient(320deg, #00bfff, #f7f7f7)" }}>
            <h3>4.8/5 On TrustPilot</h3>
            <p>Leave a review</p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
    
  );
}

export default Home;
