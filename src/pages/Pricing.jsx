import React from "react";
import { Header, Footer } from '../components';
import '../styles/Pricing.css';
import { NavLink } from "react-router-dom";
import { tick } from "../assets"; 

function Pricing() {
  return (
    <div className="Pricing">
      <Header />
      <div className="pricing-container">
        <div className="pricing-header">
          <h1>Plans & Pricing</h1>
          <p>Enjoy the basics for free, unlock more with premium with no hidden fees</p>
        </div>
        <div className="pricing-cards">
          {/* Freemium Plan */}
          <div className="pricing-card-free">
            <h2>Freemium Plan</h2>
            <h3>£0.00</h3>
            <p>Free Forever</p>
            <NavLink to="/signup" className="pricing-button">Sign Up Free</NavLink>
            <hr />
            <div className="pricing-card-free-features">
              <h4>FEATURES</h4>
              <p>Everything In Our Freemium Plan</p>
              <ul>
                <li><img src={tick} alt="Tick" /> Real-Time Market Data</li>
                <li><img src={tick} alt="Tick" /> Cash Flow Tracking</li>
                <li><img src={tick} alt="Tick" /> Profit & Loss Tracking</li>
                <li><img src={tick} alt="Tick" /> Transaction Recording</li>
                <li><img src={tick} alt="Tick" /> Join Our Discord Free</li>
              </ul>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="pricing-card-pro">
            <h2>Premium Plan</h2>
            <h3>£3.99</h3>
            <p>per month billed annually</p>
            <NavLink to="/signup" className="premium-button">Get Started</NavLink>
            <hr />
            <div className="pricing-card-pro-features">
              <h4>FEATURES</h4>
              <p>Everything In Freemium Plus and More</p>
              <ul>
                <li><img src={tick} alt="Tick" /> Market & Corporations News</li>
                <li><img src={tick} alt="Tick" /> Unlimited Trades Registry</li>
                <li><img src={tick} alt="Tick" /> More Info About Companies</li>
                <li><img src={tick} alt="Tick" /> Access Latest Tools & Technologies</li>
                <li><img src={tick} alt="Tick" /> In-Depth Weekly Report</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Pricing;