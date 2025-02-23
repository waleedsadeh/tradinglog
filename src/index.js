import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';

// Function to force a hard refresh when a new version is available to remove cache file in the web browser
const checkForUpdates = () => {
  if ('servicesWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registrations) => {
      registrations.forEach((registration) => {
        registration.update();
      });
    });
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
      window.location.reload(true);
  }
};

window.addEventListener('load', () => {
  setTimeout(checkForUpdates,2000); // wait 2 seconds before checking
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);


reportWebVitals();
