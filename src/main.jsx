/**
 * main.jsx — Application Entry Point
 * 
 * Mounts the React application to the DOM.
 * StrictMode is enabled for development-time warnings.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
