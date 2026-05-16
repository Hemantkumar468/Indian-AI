import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Chat CRUD ──────────────────────────────────
export const fetchChats = () => api.get('/chats');
export const fetchChatById = (id) => api.get(`/chats/${id}`);
export const createChat = (title) => api.post('/chats', { title });
export const updateChat = (id, title) => api.put(`/chats/${id}`, { title });
export const deleteChat = (id) => api.delete(`/chats/${id}`);

// ─── AI Endpoints ───────────────────────────────
export const sendMessage = (chatId, message) =>
  api.post('/ai/chat', { chatId, message });

export const generateImage = (chatId, prompt) =>
  api.post('/ai/image', { chatId, prompt });

export default api;
