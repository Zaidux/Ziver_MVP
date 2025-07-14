import axiosInstance from './axiosInstance';

// --- Authentication Services ---

export const loginUser = async (loginData) => {
  try {
    // Note: Your backend /token endpoint now accepts JSON, so we send the object directly.
    const response = await axiosInstance.post('/token', loginData);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error;
  }
};

// --- ADD THESE TO api/services.js ---

export const generate2FA = async () => {
  const response = await axiosInstance.post('/users/me/2fa/generate');
  return response.data;
};

export const enable2FA = async (secret_key, two_fa_code) => {
  const response = await axiosInstance.post('/users/me/2fa/enable', {
    secret_key,
    two_fa_code,
  });
  return response.data;
};

// --- User & Profile Services ---

export const getMyProfile = async () => {
  try {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Failed to get profile:', error.response?.data || error.message);
    throw error;
  }
};

export const linkWallet = async (walletAddress) => {
    try {
        const response = await axiosInstance.post('/users/me/link-wallet', { wallet_address: walletAddress });
        return response.data;
    } catch (error) {
        console.error('Failed to link wallet:', error.response?.data || error.message);
        throw error;
    }
};

// --- Mining Services ---

export const startMiningCycle = async () => {
  try {
    const response = await axiosInstance.post('/mining/start');
    return response.data;
  } catch (error) {
    console.error('Failed to start mining:', error.response?.data || error.message);
    throw error;
  }
};

export const claimMinedZp = async () => {
  try {
    const response = await axiosInstance.post('/mining/claim');
    return response.data;
  } catch (error) {
    console.error('Failed to claim ZP:', error.response?.data || error.message);
    throw error;
  }
};

export const upgradeMiner = async (upgradeData) => {
  try {
    const response = await axiosInstance.post('/mining/upgrade', upgradeData);
    return response.data;
  } catch (error) {
    console.error('Failed to upgrade miner:', error.response?.data || error.message);
    throw error;
  }
};

// --- Task Services ---

export const getAvailableTasks = async () => {
    try {
        const response = await axiosInstance.get('/tasks');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch tasks:', error.response?.data || error.message);
        throw error;
    }
};

export const completeTask = async (taskId) => {
    try {
        const response = await axiosInstance.post(`/tasks/${taskId}/complete`);
        return response.data;
    } catch (error) {
        console.error('Failed to complete task:', error.response?.data || error.message);
        throw error;
    }
};

export const createSponsoredTask = async (taskData) => {
    try {
        const response = await axiosInstance.post('/tasks/sponsor', taskData);
        return response.data;
    } catch (error) {
        console.error('Failed to create sponsored task:', error.response?.data || error.message);
        throw error;
    }
};

// --- Micro-Job Marketplace Services ---

export const getMicrojobs = async () => {
    try {
        const response = await axiosInstance.get('/microjobs');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch micro-jobs:', error.response?.data || error.message);
        throw error;
    }
};

export const createMicrojob = async (jobData) => {
    try {
        const response = await axiosInstance.post('/microjobs', jobData);
        return response.data;
    } catch (error) {
        console.error('Failed to create micro-job:', error.response?.data || error.message);
        throw error;
    }
};

export const activateJob = async (jobId) => {
    try {
        const response = await axiosInstance.post(`/microjobs/${jobId}/activate`);
        return response.data;
    } catch (error) {
        console.error('Failed to activate job:', error.response?.data || error.message);
        throw error;
    }
};
