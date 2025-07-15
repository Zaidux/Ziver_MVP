// src/pages/ProfilePage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, linkWallet } from '../api/services';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import {
  Box, Button, Container, Typography, CircularProgress, Alert, Paper,
  List, ListItem, ListItemText, Divider,
} from '@mui/material';

function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate(); // Hook called at the top level
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
    if (userFriendlyAddress && profileData && !profileData.ton_wallet_address) {
      const linkUserWallet = async () => {
        try {
          await linkWallet(userFriendlyAddress);
          alert('Wallet linked successfully!');
          fetchProfile();
        } catch (err) {
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
