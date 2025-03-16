import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'https://codeforces.com/api';

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds in milliseconds

const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
};

export const getUser = async (handle: string) => {
  try {
    await waitForRateLimit();
    console.log(`Fetching user data for handle: ${handle}`);
    
    const response = await axios.get(`${API_URL}/user.info`, {
      params: {
        handles: handle
      }
    });
    
    if (response.data.status === 'FAILED') {
      throw new Error(response.data.comment || 'Failed to fetch user data');
    }
    
    if (!response.data.result || response.data.result.length === 0) {
      throw new Error('User not found');
    }
    
    return response.data.result[0];
  } catch (error: any) {
    console.error('Error fetching user from Codeforces:', error.response?.data || error);
    if (error.response?.data?.comment) {
      throw new Error(error.response.data.comment);
    }
    if (error.response?.status === 404) {
      throw new Error(`User '${handle}' not found on Codeforces`);
    }
    throw error;
  }
};

export const getUserSubmissions = async (handle: string) => {
  try {
    await waitForRateLimit();
    console.log(`Fetching submissions for handle: ${handle}`);
    
    const response = await axios.get(`${API_URL}/user.status`, {
      params: {
        handle,
        from: 1,
        count: 10000
      }
    });
    
    if (response.data.status === 'FAILED') {
      throw new Error(response.data.comment || 'Failed to fetch user submissions');
    }
    
    if (!response.data.result) {
      return []; // Return empty array if no submissions
    }
    
    return response.data.result;
  } catch (error: any) {
    console.error('Error fetching submissions from Codeforces:', error.response?.data || error);
    if (error.response?.data?.comment) {
      throw new Error(error.response.data.comment);
    }
    if (error.response?.status === 404) {
      throw new Error(`User '${handle}' not found on Codeforces`);
    }
    throw error;
  }
};

export const getRatingHistory = async (handle: string) => {
  try {
    await waitForRateLimit();
    console.log(`Fetching rating history for handle: ${handle}`);
    
    const response = await axios.get(`${API_URL}/user.rating`, {
      params: {
        handle
      }
    });
    
    if (response.data.status === 'FAILED') {
      throw new Error(response.data.comment || 'Failed to fetch rating history');
    }
    
    if (!response.data.result) {
      return []; // Return empty array if no rating history
    }
    
    return response.data.result;
  } catch (error: any) {
    console.error('Error fetching rating history from Codeforces:', error.response?.data || error);
    if (error.response?.data?.comment) {
      throw new Error(error.response.data.comment);
    }
    if (error.response?.status === 404) {
      throw new Error(`User '${handle}' not found on Codeforces`);
    }
    throw error;
  }
};

export const getContests = async () => {
  try {
    await waitForRateLimit();
    console.log('Fetching contests from Codeforces');
    
    const response = await axios.get(`${API_URL}/contest.list`);
    
    if (response.data.status === 'FAILED') {
      throw new Error(response.data.comment || 'Failed to fetch contests');
    }
    
    if (!response.data.result) {
      return []; // Return empty array if no contests
    }
    
    return response.data.result;
  } catch (error: any) {
    console.error('Error fetching contests from Codeforces:', error.response?.data || error);
    if (error.response?.data?.comment) {
      throw new Error(error.response.data.comment);
    }
    throw error;
  }
}; 