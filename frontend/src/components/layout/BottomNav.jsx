// src/components/layout/BottomNav.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles'; // Import MUI's useTheme hook
import Box from '@mui/material/Box';
import MiningIcon from '@mui/icons-material/Whatshot';
import TasksIcon from '@mui/icons-material/CheckCircle';
import JobsIcon from '@mui/icons-material/Work';
import ProfileIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People'; // <-- Import new icon

function BottomNav() {
  const theme = useTheme(); // Access the current theme

  // Styles are now created inside the component to use the theme object
  const navStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '60px',
    background: theme.palette.background.paper, // Use theme color
    borderTop: `1px solid ${theme.palette.divider}`, // Use theme color
  };

  const linkStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    color: theme.palette.text.secondary, // Use theme color
    fontSize: '12px'
  };

  const activeLinkStyle = {
    color: theme.palette.primary.main, // Use theme color
  };

  return (
    <Box component="nav" sx={navStyle}>
      <NavLink 
        to="/app/mining" 
        style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeLinkStyle : {}) })}
      >
        <MiningIcon />
        <span>Mine</span>
      </NavLink>
      <NavLink 
        to="/app/tasks" 
        style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeLinkStyle : {}) })}
      >
        <TasksIcon />
        <span>Tasks</span>
      </NavLink>
      <NavLink 
        to="/app/jobs" 
        style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeLinkStyle : {}) })}
      >
        <JobsIcon />
        <span>Jobs</span>
      </NavLink>
      <NavLink 
        to="/app/profile" 
        style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeLinkStyle : {}) })}

      <NavLink 
        to="/app/referrals" // <-- ADD NEW NAVLINK
        style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeLinkStyle : {}) })}
      >
        <PeopleIcon />
        <span>Refer</span>
      </NavLink>

      <NavLink 
        to="/app/profile" 
        style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeLinkStyle : {}) })}
      >
        <ProfileIcon />
        <span>Profile</span>
      </NavLink>
    </Box>
  );
}

export default BottomNav;
