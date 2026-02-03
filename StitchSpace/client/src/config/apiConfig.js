// API Configuration
// This allows switching between local dev and production API endpoints

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: `${API_BASE_URL}/api/auth/login`,
      REGISTER: `${API_BASE_URL}/api/auth/register`,
      ME: `${API_BASE_URL}/api/auth/me`,
      LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    },
    PRODUCTS: `${API_BASE_URL}/api/products`,
    WORKSHOPS: `${API_BASE_URL}/api/workshops`,
    ORDERS: `${API_BASE_URL}/api/orders`,
    COMMUNITY: `${API_BASE_URL}/api/community`,
    USERS: `${API_BASE_URL}/api/users`,
    UPLOAD: `${API_BASE_URL}/api/upload`,
    PAYMENT: `${API_BASE_URL}/api/payment`,
  }
};

export default API_CONFIG;
