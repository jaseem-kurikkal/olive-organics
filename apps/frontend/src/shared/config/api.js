// Centralized API config — reads from environment variable
// In development: uses localhost:5002
// In production: uses your real domain from .env.production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

export const API_BASE = `${API_URL}/api/v1`;

export const api = {
  products: `${API_BASE}/products`,
  orders: `${API_BASE}/orders`,
  health: `${API_BASE}/health`,
  admin: `${API_BASE}/admin`,
};

export default API_URL;
