import React from "react";
import "../styles/Footer.css";
import { NavLink } from "react-router-dom";
import { tiktok, twitter, instagram, discord, logo } from "../assets";

function Footer() {
    return (
        <div className="Footer">
            <div className="Footer-left">
                <NavLink to="/">
                    <img src={logo} alt="Logo" className="Footer-logo" />
                </NavLink>
                <div className="Footer-links">
                    <NavLink to="/cookies">Cookies</NavLink>
                    <NavLink to="/terms-of-service">Terms of Service</NavLink>
                    <NavLink to="/privacy-policy">Privacy Policy</NavLink>
                </div>
            </div>
            <div className="Footer-center">
                <div className="Footer-icons">
                    <img src={tiktok} alt="TikTok" />
                    <img src={twitter} alt="Twitter" />
                    <img src={instagram} alt="Instagram" />
                    <a href="https://discord.gg/rmJ7KV3t" target="_blank" rel="noopener noreferrer">
                        <img src={discord} alt="Discord" />
                    </a>
                </div>
            </div>
            <div className="Footer-right">
                <div className="Footer-copyright">
                    © 2024 - 2025 TradingLog Ltd, All Rights Reserved
                </div>
            </div>
        </div>
    );
}

export default Footer;