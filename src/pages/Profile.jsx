import React, { useState, useEffect } from "react";
import { Header, Footer } from '../components';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { edit, google, github } from '../assets';
import { onAuthStateChanged, deleteUser, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    createdAt: null,
    provider: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Edit states
  const [isEditingFirstName, setIsEditingFirstName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [isEditingPhoneNumber, setIsEditingPhoneNumber] = useState(false);
  
  // Delete account confirmation state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  // Temporary values for editing
  const [tempFirstName, setTempFirstName] = useState("");
  const [tempLastName, setTempLastName] = useState("");
  const [tempPhoneNumber, setTempPhoneNumber] = useState("");

  // Handle phone number input change with validation
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Always update the tempPhoneNumber state - we'll validate before saving
    setTempPhoneNumber(value);
  };

  useEffect(() => {
    setLoading(true);
    
    // Use onAuthStateChanged to properly wait for Firebase auth to initialize
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setError("Please log in to view your profile.");
        setLoading(false);
      }
    });
    
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);
  
  const fetchUserData = async (currentUser) => {
    setError("");
    
    try {
      // Determine the provider
      let provider = "";
      if (currentUser.providerData && currentUser.providerData.length > 0) {
        const providerId = currentUser.providerData[0].providerId;
        if (providerId === 'google.com') {
          provider = "google";
        } else if (providerId === 'github.com') {
          provider = "github";
        }
      }
      
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || currentUser.email || "",
          phoneNumber: data.phoneNumber || "",
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          provider: data.provider || provider
        });
        
        // Initialize temp values
        setTempFirstName(data.firstName || "");
        setTempLastName(data.lastName || "");
        setTempPhoneNumber(data.phoneNumber || "");
      } else {
        setError("User profile not found.");
      }
    } catch (err) {
      setError("Error loading profile: " + err.message);
      console.error("Error fetching user data:", err);
    }
    
    setLoading(false);
  };

  const handleUpdateField = async (field, value) => {
    setError("");
    setSuccess("");
    
    // Validate first name and last name fields can't be null or empty
    if ((field === 'firstName' || field === 'lastName') && (!value || value.trim() === "")) {
      setError(`${field === 'firstName' ? 'First name' : 'Last name'} cannot be empty.`);
      return;
    }
    
    // For phone number, format and validate
    if (field === 'phoneNumber') {
      // Remove any non-numeric characters
      const cleanedValue = value.replace(/\D/g, '');
      
      // Use the cleaned value instead of the original
      value = cleanedValue;
      
      // Show error if original had non-numeric chars, but still allow update
      if (cleanedValue !== value) {
        setError('Non-numeric characters have been removed from phone number.');
      }
    }
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("You must be logged in to update your profile.");
        return;
      }
      
      const userDocRef = doc(db, "users", currentUser.uid);
      
      // Update the field in Firestore
      await updateDoc(userDocRef, {
        [field]: value
      });
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        [field]: value
      }));
      
      setSuccess(`${field} updated successfully!`);
      
      // Reset edit states
      if (field === 'firstName') setIsEditingFirstName(false);
      if (field === 'lastName') setIsEditingLastName(false);
      if (field === 'phoneNumber') setIsEditingPhoneNumber(false);
      
      // Clear success message after 1 second
      setTimeout(() => {
        setSuccess("");
      }, 1000);
      
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update: " + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    setError("");
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return;
      }
      const userId = currentUser.uid;
      const userDocRef = doc(db, "users", userId);   

      await deleteDoc(userDocRef);

      await deleteUser(currentUser);
       
      await signOut(auth);
      
      navigate("/");
      
    } catch (err) {
      console.error("Delete account error:", err);
      setError("Failed to delete account: " + err.message);
      
      if (err.code === 'auth/requires-recent-login') {
        setError("For security reasons, please log out and log in again before deleting your account.");
      }
      
      setShowDeleteConfirmation(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProviderIcon = () => {
    switch(userData.provider) {
      case "google":
        return <img src={google} alt="Google" className="provider-icon" />;
      case "github":
        return <img src={github} alt="GitHub" className="provider-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="Profile">
      <Header />
      <div className="profile-container">
        <h1>Hey {userData.firstName}</h1>
        
        {loading ? (
          <p>Loading your profile data...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="profile-info">
            <div className="profile-field">
              <div className="profile-field-label">First Name:</div>
              <div className="profile-field-value">
                {isEditingFirstName ? (
                  <div className="profile-field-edit">
                    <input 
                      type="text" 
                      value={tempFirstName}
                      onChange={(e) => setTempFirstName(e.target.value)}
                      placeholder="First Name"
                    />
                    <div className="edit-buttons">
                      <button 
                        onClick={() => handleUpdateField("firstName", tempFirstName)}
                        className="save-button"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditingFirstName(false);
                          setTempFirstName(userData.firstName);
                          setError(""); // Clear any error messages
                        }}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="profile-field-display">
                    <span>{userData.firstName}</span>
                    <img 
                      src={edit} 
                      alt="Edit" 
                      className="edit-icon" 
                      onClick={() => setIsEditingFirstName(true)}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="profile-field">
              <div className="profile-field-label">Last Name:</div>
              <div className="profile-field-value">
                {isEditingLastName ? (
                  <div className="profile-field-edit">
                    <input 
                      type="text" 
                      value={tempLastName}
                      onChange={(e) => setTempLastName(e.target.value)}
                      placeholder="Last Name"
                    />
                    <div className="edit-buttons">
                      <button 
                        onClick={() => handleUpdateField("lastName", tempLastName)}
                        className="save-button"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditingLastName(false);
                          setTempLastName(userData.lastName);
                          setError(""); // Clear any error messages
                        }}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="profile-field-display">
                    <span>{userData.lastName}</span>
                    <img 
                      src={edit} 
                      alt="Edit" 
                      className="edit-icon" 
                      onClick={() => setIsEditingLastName(true)}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="profile-field">
              <div className="profile-field-label">Phone Number:</div>
              <div className="profile-field-value">
                {isEditingPhoneNumber ? (
                  <div className="profile-field-edit">
                    <input 
                      type="tel" 
                      value={tempPhoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder="Phone Number"
                    />
                    <div className="edit-buttons">
                      <button 
                        onClick={() => handleUpdateField("phoneNumber", tempPhoneNumber)}
                        className="save-button"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditingPhoneNumber(false);
                          setTempPhoneNumber(userData.phoneNumber);
                          setError(""); // Clear any error messages
                        }}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="profile-field-display">
                    <span>{userData.phoneNumber}</span>
                    <img 
                      src={edit} 
                      alt="Edit" 
                      className="edit-icon" 
                      onClick={() => setIsEditingPhoneNumber(true)}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="profile-field">
              <div className="profile-field-label">Email:</div>
              <div className="profile-field-value">
                <div className="profile-field-display">
                  <div className="email-with-provider">
                    {getProviderIcon()}
                    <span>{userData.email}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="profile-field">
              <div className="profile-field-label">Account Created:</div>
              <div className="profile-field-value">
                <div className="profile-field-display">
                  <span>{formatDate(userData.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {success && <p className="success-message">{success}</p>}
        
        {/* Delete Account Section */}
        <div className="delete-account-section">
          {!showDeleteConfirmation ? (
            <button 
              className="delete-account-button"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              Delete Account
            </button>
          ) : (
            <div className="delete-confirmation">
              <p>Are you sure you want to delete your account? This action cannot be undone.</p>
              <div className="delete-confirmation-buttons">
                <button 
                  className="delete-confirm-button"
                  onClick={handleDeleteAccount}
                >
                  Yes, Delete My Account
                </button>
                <button 
                  className="delete-cancel-button"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;