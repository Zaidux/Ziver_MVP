import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import all the pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MiningPage from './pages/MiningPage';
import TasksPage from './pages/TasksPage';         // <-- IMPORT
import MicroJobsPage from './pages/MicroJobsPage'; // <-- IMPORT
import ProfilePage from './pages/ProfilePage';     // <-- IMPORT
import Enable2FAPage from './pages/Enable2FAPage';  // <--  NEW IMPORT

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
        <Route path="tasks" element={<TasksPage />} />         {/* <-- ADD ROUTE */}
        <Route path="jobs" element={<MicroJobsPage />} />       {/* <-- ADD ROUTE */}
        <Route path="profile" element={<ProfilePage />} />       {/* <-- ADD ROUTE */}
         <Route path="/profile/enable-2fa" element={<ProtectedRoute><Enable2FAPage /></ProtectedRoute>} />
      </Route>
      
    </Routes>
  );
}

export default App;
