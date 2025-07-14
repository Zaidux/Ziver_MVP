import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, linkWallet, generate2FA, enable2FA } from '../api/services';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';

// Import MUI components
import {
  Box, Button, Container, Typography, CircularProgress, Alert, Paper,
  List, ListItem, ListItemText, Divider, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText,
} from '@mui/material';

function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 2FA State
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFAInfo, setTwoFAInfo] = useState(null);
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAError, setTwoFAError] = useState('');

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

  // --- 2FA Handlers ---
  const handleEnable2FAClick = async () => {
    setTwoFAError('');
    try {
      const data = await generate2FA();
      setTwoFAInfo(data);
      setShow2FASetup(true);
    } catch (err) {
      setTwoFAError(err.response?.data?.detail || 'Failed to start 2FA setup.');
    }
  };

  const handleVerifyAndEnable2FA = async () => {
    if (!twoFACode || !twoFAInfo?.secret_key) return;
    setTwoFAError('');
    try {
      await enable2FA(twoFAInfo.secret_key, twoFACode);
      alert('2FA enabled successfully!');
      setShow2FASetup(false);
      setTwoFAInfo(null);
      setTwoFACode('');
      fetchProfile(); // Refetch profile to update 2FA status
    } catch (err) {
      setTwoFAError(err.response?.data?.detail || 'Failed to enable 2FA.');
    }
  };

  const handleClose2FADialog = () => {
    setShow2FASetup(false);
    setTwoFAInfo(null);
    setTwoFAError('');
    setTwoFACode('');
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
            <ListItem>
              <ListItemText primary="Two-Factor Authentication" secondary={profileData.is_2fa_enabled ? 'Enabled' : 'Disabled'} />
              {!profileData.is_2fa_enabled && (
                <Button variant="outlined" onClick={handleEnable2FAClick}>Enable</Button>
              )}
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

      {/* 2FA Setup Dialog */}
      <Dialog open={show2FASetup} onClose={handleClose2FADialog}>
        <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
        <DialogContent>
          <DialogContentText>
            1. Scan the QR code with your authenticator app (e.g., Google Authenticator).
          </DialogContentText>
          {twoFAInfo?.qr_code_uri && <img src={twoFAInfo.qr_code_uri} alt="2FA QR Code" style={{ margin: '16px auto', display: 'block' }} />}
          <DialogContentText sx={{ mt: 2 }}>
            2. Enter the 6-digit code from your app to verify and activate 2FA.
          </DialogContentText>
          <TextField
            autoFocus margin="dense" id="2fa-code" label="Verification Code" type="text"
            fullWidth variant="standard" value={twoFACode}
            onChange={(e) => setTwoFACode(e.target.value)}
            inputProps={{ maxLength: 6 }}
          />
          {twoFAError && <Alert severity="error" sx={{ mt: 2 }}>{twoFAError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2FADialog}>Cancel</Button>
          <Button onClick={handleVerifyAndEnable2FA} variant="contained">Verify & Activate</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProfilePage;
