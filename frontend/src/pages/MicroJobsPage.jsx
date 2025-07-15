// src/pages/MicroJobsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMicrojobs } from '../api/services';
import {
  Container, Typography, List, ListItem, ListItemText, Button,
  CircularProgress, Alert, Paper, Box
} from '@mui/material';

function MicroJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const activeJobs = await getMicrojobs();
      setJobs(activeJobs);
    } catch (err) {
      setError('Failed to fetch micro-jobs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  if (loading && jobs.length === 0) {
    return <Container sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Container>;
  }

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography component="h1" variant="h4" color="primary" gutterBottom>
          Micro-Job Marketplace
        </Typography>
        <Typography>Complete jobs for TON rewards, secured by our on-chain escrow.</Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/app/jobs/new')} // Updated to navigate
        >
          Post a New Job
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={3}>
        <List>
          {jobs.length > 0 ? jobs.map((job) => (
            <ListItem key={job.id} secondaryAction={<Button variant="outlined">View Details</Button>}>
              <ListItemText
                primary={`${job.title} (+${job.ton_payment_amount} TON)`}
                secondary={job.description}
              />
            </ListItem>
          )) : (
            <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
              No active jobs found.
            </Typography>
          )}
        </List>
      </Paper>
    </Container>
  );
}

export default MicroJobsPage;
