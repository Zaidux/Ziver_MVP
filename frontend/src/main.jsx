// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx'; // <-- Use your custom provider
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';

const manifestUrl = 'https://ziver-mvp-frontend.onrender.com/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider> {/* This now controls light/dark mode */}
            <CssBaseline /> {/* Resets browser styles */}
            <App />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TonConnectUIProvider>
  </React.StrictMode>
);
