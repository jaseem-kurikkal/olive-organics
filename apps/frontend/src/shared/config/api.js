// Centralized API config — reads from environment variable
// In development: uses localhost:5002
// In production: uses your real domain from .env.production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

export const api = {
  products: `${API_URL}/api/v1/products`,
  orders: `${API_URL}/api/v1/orders`,
  health: `${API_URL}/api/v1/health`,
};

export default API_URL;
