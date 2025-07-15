// src/pages/CreateMicroJobPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMicrojob } from '../api/services';
import {
  Container, Typography, Paper, Box, TextField, Button,
  CircularProgress, Alert
} from '@mui/material';

function CreateMicroJobPage() {
  const [newJobData, setNewJobData] = useState({
    title: '',
    description: '',
    verification_criteria: '',
    ton_payment_amount: 0.1,
    ziver_fee_percentage: 0.05, // <-- LINE ADDED
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJobData({ ...newJobData, [name]: value });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createMicrojob(newJobData);
      alert("Job created successfully! It will appear in the marketplace once you fund it from your profile.");
      navigate('/app/jobs'); // Navigate back to the jobs list on success
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography component="h1" variant="h4" color="primary" gutterBottom>
          Post a New Micro-Job
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
          <Box component="form" onSubmit={handleCreateJob}>
            <TextField
              name="title" label="Job Title" value={newJobData.title}
              onChange={handleInputChange} margin="normal" required fullWidth
            />
            <TextField
              name="description" label="Job Description" value={newJobData.description}
              onChange={handleInputChange} margin="normal" required fullWidth multiline rows={4}
            />
            <TextField
              name="verification_criteria" label="Verification Criteria"
              value={newJobData.verification_criteria} onChange={handleInputChange}
              margin="normal" required fullWidth multiline rows={2}
              helperText="How will you know the user completed the job correctly?"
            />
            <TextField
              name="ton_payment_amount" label="Payment Amount (TON)"
              value={newJobData.ton_payment_amount} onChange={handleInputChange}
              margin="normal" required fullWidth type="number"
            />
            {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" disabled={loading} fullWidth>
                {loading ? <CircularProgress size={24} /> : 'Create Job'}
              </Button>
              <Button onClick={() => navigate('/app/jobs')} variant="outlined" fullWidth>
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default CreateMicroJobPage;
