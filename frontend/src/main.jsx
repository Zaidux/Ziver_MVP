import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.js'; // <-- IMPORT IT
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* <-- WRAP YOUR APP */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
