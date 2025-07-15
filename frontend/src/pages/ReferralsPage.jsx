// src/pages/ReferralsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyReferrals, pingReferral, deleteReferral } from '../api/services';
import {
  Container, Typography, Box, Paper, List, ListItem, ListItemText,
  Button, CircularProgress, Alert, IconButton, Divider, Chip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

function ReferralsPage() {
  const { user } = useAuth(); // Assuming your AuthContext provides the user object with an ID
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const referralLink = `https://ziver-mvp-frontend.onrender.com/register?ref=${user?.id}`;

  const fetchReferrals = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyReferrals();
      setReferrals(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch referrals.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };
  
  const handlePing = async (referredUserId) => {
      alert(`Ping sent to user ID: ${referredUserId}. (This is a placeholder action)`);
      // In a real app with notifications, you would call:
      // await pingReferral(referredUserId);
  };

  const handleDelete = async (referralId) => {
    if (window.confirm('Are you sure you want to delete this referral? A ZP fee will be deducted.')) {
        try {
            const response = await deleteReferral(referralId);
            alert(response.message);
            fetchReferrals(); // Refresh the list
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to delete referral.');
        }
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography component="h1" variant="h4" color="primary" gutterBottom align="center">
          Invite Friends
        </Typography>
        <Typography align="center" sx={{ mb: 3 }}>
          Earn ZP for every friend you invite to Ziver!
        </Typography>

        <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Your Unique Referral Link</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
                <Typography sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {referralLink}
                </Typography>
                <Button startIcon={<ContentCopyIcon />} onClick={handleCopyLink}>
                    Copy
                </Button>
            </Box>
        </Paper>
        
        <Typography variant="h5" gutterBottom>Your Referred Users ({referrals.length})</Typography>
        <Paper elevation={3}>
            {loading ? (
                <Box sx={{p: 4, textAlign: 'center'}}><CircularProgress /></Box>
            ) : error ? (
                <Alert severity="error" sx={{m:2}}>{error}</Alert>
            ) : (
                <List>
                    {referrals.length > 0 ? referrals.map((ref, index) => (
                        <React.Fragment key={ref.id}>
                            <ListItem
                                secondaryAction={
                                    <Box>
                                        <IconButton edge="end" aria-label="ping" onClick={() => handlePing(ref.referred_id)}>
                                            <NotificationsActiveIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(ref.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                <ListItemText 
                                    primary={ref.referred_user_full_name || 'N/A'} 
                                    secondary={ref.referred_user_email} 
                                />
                                <Chip label={ref.status} color="success" size="small" />
                            </ListItem>
                            {index < referrals.length - 1 && <Divider />}
                        </React.Fragment>
                    )) : (
                        <Typography sx={{p: 3, textAlign: 'center', color: 'text.secondary'}}>
                            You haven't referred any users yet.
                        </Typography>
                    )}
                </List>
            )}
        </Paper>
      </Box>
    </Container>
  );
}

export default ReferralsPage;
