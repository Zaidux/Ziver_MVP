// src/pages/ProfilePage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx'; // Import the useTheme hook
import { useNavigate } from 'react-router-dom';
import { getMyProfile, linkWallet } from '../api/services';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import {
  Box, Button, Container, Typography, CircularProgress, Alert, Paper,
  List, ListItem, ListItemText, Divider, Switch
} from '@mui/material';

function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme(); // Get theme state and toggle function
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userFriendlyAddress = useTonAddress();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfileData(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch profile data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    // Only try to link if a wallet is connected AND it's not already the one on file
    if (userFriendlyAddress && profileData && userFriendlyAddress !== profileData.ton_wallet_address) {
      // Also, don't try to link if a wallet is already linked to the profile, to avoid repeated alerts
      if (profileData.ton_wallet_address) {
        return; 
      }

      const linkUserWallet = async () => {
        try {
          await linkWallet(userFriendlyAddress);
          alert('Wallet linked successfully!');
          fetchProfile(); // Refetch profile to show the linked address
        } catch (err) {
          // Now, this alert will only show up on a genuine attempt to link a duplicate wallet
          alert(err.response?.data?.detail || 'Failed to link wallet.');
        }
      };
      linkUserWallet();
    }
  }, [userFriendlyAddress, profileData, fetchProfile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderProfile = () => {
    if (loading) return <CircularProgress color="primary" sx={{ mt: 4 }} />;
    if (error) return <Alert severity="error" sx={{ mt: 4, width: '100%' }}>{error}</Alert>;
    if (profileData) {
      return (
        <Paper elevation={3} sx={{ mt: 2, p: 3, width: '100%' }}>
          <List>
            <ListItem><ListItemText primary="Full Name" secondary={profileData.full_name || 'Not set'} /></ListItem>
            <Divider />
            <ListItem><ListItemText primary="Email" secondary={profileData.email} /></ListItem>
            <Divider />
            <ListItem><ListItemText primary="Connected Wallet" secondary={profileData.ton_wallet_address || 'Not linked'} secondaryTypographyProps={{ style: { wordBreak: 'break-all' } }} /></ListItem>
            <Divider />
            <ListItem><ListItemText primary="ZP Balance" secondary={profileData.zp_balance.toLocaleString()} /></ListItem>
            <Divider />
            <ListItem
              secondaryAction={
                !profileData.is_2fa_enabled && (
                  <Button variant="outlined" onClick={() => navigate('/app/profile/enable-2fa')}>
                    Enable
                  </Button>
                )
              }
            >
              <ListItemText primary="Two-Factor Authentication" secondary={profileData.is_2fa_enabled ? 'Enabled' : 'Disabled'} />
            </ListItem>
            <Divider />
            {/* New Theme Switcher ListItem */}
            <ListItem
              secondaryAction={
                <Switch
                  edge="end"
                  onChange={toggleTheme}
                  checked={mode === 'dark'}
                />
              }
            >
              <ListItemText primary="Dark Mode" />
            </ListItem>
          </List>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" color="primary" gutterBottom>My Profile</Typography>
        <Box sx={{ my: 2 }}><TonConnectButton /></Box>
        {renderProfile()}
        <Button onClick={handleLogout} fullWidth variant="contained" sx={{ mt: 4, mb: 2, py: 1.5, fontWeight: 'bold', backgroundColor: '#E60000', '&:hover': { backgroundColor: '#c40000' } }}>Logout</Button>
      </Box>
    </Container>
  );
}

export default ProfilePage;
