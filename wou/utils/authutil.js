import axios from 'axios';

const API_BASE = 'http://localhost:8000/api'; // Adjust if needed

export const fetchWithAuthRetry = async (endpoint) => {
  try {
    // Attempt to fetch protected data
    const response = await axios.get(`${API_BASE}${endpoint}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    // If access token is invalid or expired
    if (error.response && error.response.status === 401) {
      try {
        // Try to refresh token
        await axios.get(`${API_BASE}/auth/refresh-token`, {
          withCredentials: true,
        });

        // Retry the original request
        const retryResponse = await axios.get(`${API_BASE}${endpoint}`, {
          withCredentials: true,
        });
        return retryResponse.data;
      } catch (refreshError) {
        // Refresh also failed — maybe user needs to log in again
        console.error("Refresh of access token failed.");
        throw refreshError;
      }
    } else {
      // Other error (network, 500, etc.)
      throw error;
    }
  }
};
