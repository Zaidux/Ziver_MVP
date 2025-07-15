// src/App.jsx

import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import all the pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MiningPage from './pages/MiningPage';
import TasksPage from './pages/TasksPage';
import MicroJobsPage from './pages/MicroJobsPage';
import ProfilePage from './pages/ProfilePage';
import Enable2FAPage from './pages/Enable2FAPage';
// import CreateMicroJobPage from './pages/CreateMicroJobPage'; // You will create this next

// Import the layout and protection components
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainAppLayout from './components/layout/MainAppLayout';

function App() {
  return (
    <Routes>
      {/* === Public Routes === */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* === Protected Application Routes === */}
      <Route 
        path="/app" 
        element={
          <ProtectedRoute>
            <MainAppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MiningPage />} /> 
        <Route path="mining" element={<MiningPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="jobs" element={<MicroJobsPage />} />
        {/* <Route path="jobs/new" element={<CreateMicroJobPage />} /> */} {/* For when you create the page */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/enable-2fa" element={<Enable2FAPage />} /> {/* Corrected Path */}
      </Route>

    </Routes>
  );
}

export default App;
