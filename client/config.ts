// API Configuration
const isDevelopment = import.meta.env.MODE === 'development';
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

// Use Render backend in production, local backend in development
export const API_BASE_URL = isDevelopment || isLocalhost 
  ? 'http://localhost:3001'  // Local development server
  : 'https://gemini-chatbot-phqr.onrender.com';  // Your Render backend URL

export const apiEndpoints = {
  health: `${API_BASE_URL}/api/health`,
  chat: `${API_BASE_URL}/api/chat`,
  usage: (userId: string) => `${API_BASE_URL}/api/chat/usage/${userId}`,
};