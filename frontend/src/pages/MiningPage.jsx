// src/pages/MiningPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyProfile, startMiningCycle, claimMinedZp, upgradeMiner } from '../api/services';

// Import MUI Components & Icons
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/ShutterSpeed';
import CapacityIcon from '@mui/icons-material/Storage';
import HoursIcon from '@mui/icons-material/HourglassBottom';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'; // Streak Icon

// This data should match the `upgrade_costs` dictionary in your backend's mining service
const upgradeConfig = {
    mining_speed: {
        title: "Speed",
        icon: <SpeedIcon />,
        levels: {
            1: { cost_zp: 150, value: 15 }, 2: { cost_zp: 450, value: 20 },
            3: { cost_zp: 700, value: 30 }, 4: { cost_zp: 1000, value: 50 },
            5: { cost_zp: 2500, value: 100 },
        }
    },
    mining_capacity: {
        title: "Capacity",
        icon: <CapacityIcon />,
        levels: {
            1: { cost_zp: 200, value: 75 }, 2: { cost_zp: 350, value: 100 },
            3: { cost_zp: 650, value: 200 }, 4: { cost_zp: 850, value: 350 },
            5: { cost_zp: 1350, value: 550 },
        }
    },
    mining_hours: {
        title: "Hours",
        icon: <HoursIcon />,
        levels: {
            1: { cost_zp: 250, value: 3 }, 2: { cost_zp: 500, value: 4 },
            3: { cost_zp: 700, value: 5 }, 4: { cost_zp: 1000, value: 6 },
            5: { cost_zp: 1650, value: 7 },
        }
    },
};

function MiningPage() {
    const { token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [activeTab, setActiveTab] = useState('mining_speed');

    const fetchProfile = useCallback(async () => {
        try {
            const data = await getMyProfile();
            setProfile(data);
            if (data.mining_started_at) {
                const startTime = new Date(data.mining_started_at).getTime();
                const endTime = startTime + data.current_mining_cycle_hours * 3600 * 1000;
                const now = new Date().getTime();
                const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
                setTimeRemaining(remaining);
            } else {
                setTimeRemaining(0);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Countdown timer effect
    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeRemaining]);

    const handleApiCall = async (apiFunc, params) => {
        setLoading(true);
        setError('');
        try {
            await apiFunc(params);
            await fetchProfile(); // Refetch data to update UI
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    if (!profile) {
        return <Container sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Container>;
    }

    return (
        <Container component="main" maxWidth="sm">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
                <Chip
                    icon={<LocalFireDepartmentIcon />}
                    label={`${profile.daily_streak_count} Day Streak`}
                    color="warning"
                    variant="outlined"
                />
            </Box>

            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', width: '100%', mb: 3 }}>
                <Typography variant="h6" color="text.secondary">Your ZP Balance</Typography>
                <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold' }}>
                    {profile.zp_balance.toLocaleString()}
                </Typography>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', width: '100%', mb: 3 }}>
                {timeRemaining > 0 ? (
                    <>
                        <Typography variant="h5" gutterBottom>Mining In Progress</Typography>
                        <Typography variant="h3" sx={{ my: 2 }}>{formatTime(timeRemaining)}</Typography>
                        <Button fullWidth variant="contained" disabled>Mining...</Button>
                    </>
                ) : profile.mining_started_at ? (
                    <Button fullWidth variant="contained" color="primary" onClick={() => handleApiCall(claimMinedZp)} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Claim ZP'}
                    </Button>
                ) : (
                    <Button fullWidth variant="contained" color="primary" onClick={() => handleApiCall(startMiningCycle)} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Start Mining'}
                    </Button>
                )}
            </Paper>

            <Paper elevation={3} sx={{ width: '100%', mb: 3 }}>
                <Typography variant="h5" sx={{ p: 2, textAlign: 'center' }}>Upgrade Miner</Typography>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
                        <Tab icon={upgradeConfig.mining_speed.icon} label={upgradeConfig.mining_speed.title} value="mining_speed" />
                        <Tab icon={upgradeConfig.mining_capacity.icon} label={upgradeConfig.mining_capacity.title} value="mining_capacity" />
                        <Tab icon={upgradeConfig.mining_hours.icon} label={upgradeConfig.mining_hours.title} value="mining_hours" />
                    </Tabs>
                </Box>
                <List>
                    {Object.entries(upgradeConfig[activeTab].levels).map(([level, data]) => (
                        <ListItem key={level}
                            secondaryAction={
                                <Button variant="outlined" onClick={() => handleApiCall(upgradeMiner, { upgrade_type: activeTab, level: parseInt(level) })} disabled={loading || profile.zp_balance < data.cost_zp}>
                                    Upgrade
                                </Button>
                            }
                        >
                            <ListItemText primary={`Level ${level} - ${data.value}`} secondary={`Cost: ${data.cost_zp} ZP`} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
            {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        </Container>
    );
}

export default MiningPage;
