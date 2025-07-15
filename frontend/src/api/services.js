import axiosInstance from './axiosInstance';

// --- Authentication Services ---

export const loginUser = async (loginData) => {
  try {
    const response = await axiosInstance.post('/api/v1/token', loginData);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/api/v1/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error;
  }
};

// --- User & Profile Services ---

export const getMyProfile = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/users/me');
    return response.data;
  } catch (error) {
    console.error('Failed to get profile:', error.response?.data || error.message);
    throw error;
  }
};

export const linkWallet = async (walletAddress) => {
    try {
        const response = await axiosInstance.post('/api/v1/users/me/link-wallet', { wallet_address: walletAddress });
        return response.data;
    } catch (error) {
        console.error('Failed to link wallet:', error.response?.data || error.message);
        throw error;
    }
};

export const generate2FA = async () => {
  const response = await axiosInstance.post('/api/v1/users/me/2fa/generate');
  return response.data;
};

export const enable2FA = async (secret_key, two_fa_code) => {
  const response = await axiosInstance.post('/api/v1/users/me/2fa/enable', {
    secret_key,
    two_fa_code,
  });
  return response.data;
};

// --- Mining Services ---

export const startMiningCycle = async () => {
  try {
    const response = await axiosInstance.post('/api/v1/mining/start');
    return response.data;
  } catch (error) {
    console.error('Failed to start mining:', error.response?.data || error.message);
    throw error;
  }
};

export const claimMinedZp = async () => {
  try {
    const response = await axiosInstance.post('/api/v1/mining/claim');
    return response.data;
  } catch (error) {
    console.error('Failed to claim ZP:', error.response?.data || error.message);
    throw error;
  }
};

export const upgradeMiner = async (upgradeData) => {
  try {
    const response = await axiosInstance.post('/api/v1/mining/upgrade', upgradeData);
    return response.data;
  } catch (error) {
    console.error('Failed to upgrade miner:', error.response?.data || error.message);
    throw error;
  }
};

// --- Task Services ---

export const getAvailableTasks = async () => {
    try {
        const response = await axiosInstance.get('/api/v1/tasks');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch tasks:', error.response?.data || error.message);
        throw error;
    }
};

export const completeTask = async (taskId) => {
    try {
        const response = await axiosInstance.post(`/api/v1/tasks/${taskId}/complete`);
        return response.data;
    } catch (error) {
        console.error('Failed to complete task:', error.response?.data || error.message);
        throw error;
    }
};

export const createSponsoredTask = async (taskData) => {
    try {
        const response = await axiosInstance.post('/api/v1/tasks/sponsor', taskData);
        return response.data;
    } catch (error) {
        console.error('Failed to create sponsored task:', error.response?.data || error.message);
        throw error;
    }
};

// --- Micro-Job Marketplace Services ---

export const getMicrojobs = async () => {
    try {
        const response = await axiosInstance.get('/api/v1/microjobs');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch micro-jobs:', error.response?.data || error.message);
        throw error;
    }
};

export const createMicrojob = async (jobData) => {
    try {
        const response = await axiosInstance.post('/api/v1/microjobs', jobData);
        return response.data;
    } catch (error) {
        console.error('Failed to create micro-job:', error.response?.data || error.message);
        throw error;
    }
};

export const activateJob = async (jobId) => {
    try {
        const response = await axiosInstance.post(`/api/v1/microjobs/${jobId}/activate`);
        return response.data;
    } catch (error) {
        console.error('Failed to activate job:', error.response?.data || error.message);
        throw error;
    }
};

// --- Referral Services ---

export const getMyReferrals = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/referrals');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch referrals:', error.response?.data || error.message);
    throw error;
  }
};

export const pingReferral = async (referredUserId) => {
  try {
    const response = await axiosInstance.post(`/api/v1/referrals/${referredUserId}/ping`);
    return response.data;
  } catch (error) {
    console.error('Failed to ping referral:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteReferral = async (referralId) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/referrals/${referralId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete referral:', error.response?.data || error.message);
    throw error;
  }
};
