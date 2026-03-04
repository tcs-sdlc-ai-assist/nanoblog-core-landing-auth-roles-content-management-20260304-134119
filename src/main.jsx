/**
 * main.jsx
 * React application bootstrap and router setup.
 *
 * Entry point for the NanoBlog SPA. Renders the App component
 * wrapped in BrowserRouter into the #root DOM element.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);