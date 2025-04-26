import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { 
  Home, Pricing, 
  Contact, Login, 
  Signup, Cookies, 
  PrivacyPolicy, TermsofService,
  Dashboard, Profile
} from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} /> {/* Redirect to Home for any other routes */}
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsofService />} />
        <Route path="/Dashboard" element={<Dashboard/>} />
        <Route path="/Profile" element={<Profile/>} />
      </Routes>
    </Router>
  );
}

export default App;