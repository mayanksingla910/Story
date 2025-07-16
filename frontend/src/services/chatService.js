import api from './authService';

export const chatService = {
  // Users
  getUsers: (search = '') => {
    return api.get(`/users?search=${search}`);
  },

  getOnlineUsers: () => {
    return api.get('/users/online');
  },

  getUserProfile: (userId) => {
    return api.get(`/users/${userId}`);
  },

  updateProfile: (data) => {
    return api.put('/users/profile', data);
  },

  // Conversations
  getConversations: () => {
    return api.get('/conversations');
  },

  createPrivateConversation: (userId) => {
    return api.post('/conversations/private', { userId });
  },

  getConversation: (conversationId) => {
    return api.get(`/conversations/${conversationId}`);
  },

  // Messages
  getMessages: (conversationId, page = 1, limit = 50) => {
    return api.get(`/messages/conversation/${conversationId}?page=${page}&limit=${limit}`);
  },

  markMessagesAsRead: (conversationId) => {
    return api.put(`/messages/read/${conversationId}`);
  },
};