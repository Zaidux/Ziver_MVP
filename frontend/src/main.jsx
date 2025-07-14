import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// --- MUI Imports ---
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from './themes.js';
import CssBaseline from '@mui/material/CssBaseline';

// --- TON Connect Import ---
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import './index.css';

// This is the public URL where your tonconnect-manifest.json file will live.
// You must host this file publicly for wallets to connect.
// For now, this is a placeholder.
const manifestUrl = 'https://your-app-url.com/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* TON Connect provider must wrap everything */}
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
);
