// src/pages/Enable2FAPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generate2FA, enable2FA } from '../api/services';
import {
  Container, Box, Typography, Button, TextField, Alert,
  CircularProgress, Paper
} from '@mui/material';

function Enable2FAPage() {
  const [loading, setLoading] = useState(true);
  const [twoFAInfo, setTwoFAInfo] = useState(null);
  const [twoFACode, setTwoFACode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const setup2FA = async () => {
      try {
        const data = await generate2FA();
        setTwoFAInfo(data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to start 2FA setup.');
      } finally {
        setLoading(false);
      }
    };
    setup2FA();
  }, []);

  const handleVerifyAndEnable = async () => {
    if (!twoFACode || !twoFAInfo?.secret_key) return;
    setError('');
    try {
      await enable2FA(twoFAInfo.secret_key, twoFACode);
      alert('2FA enabled successfully!');
      navigate('/app/profile'); // Navigate back to profile on success
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to enable 2FA.');
    }
  };

  if (loading) {
    return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" color="primary" gutterBottom>
          Enable 2FA
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mt: 2, width: '100%', textAlign: 'center' }}>
          <Typography>1. Scan this QR code with your authenticator app.</Typography>
          {error && !twoFAInfo && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {twoFAInfo?.qr_code_uri && (
            <img src={twoFAInfo.qr_code_uri} alt="2FA QR Code" style={{ margin: '16px 0' }} />
          )}
          <Typography sx={{ mt: 2 }}>
            2. Enter the 6-digit code from your app below.
          </Typography>
          <TextField
            margin="normal" label="Verification Code" type="text"
            fullWidth value={twoFACode}
            onChange={(e) => setTwoFACode(e.target.value)}
            inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem' } }}
          />
          {error && twoFAInfo && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button onClick={() => navigate('/app/profile')} fullWidth variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleVerifyAndEnable} fullWidth variant="contained">
              Verify & Activate
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Enable2FAPage;
