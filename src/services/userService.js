import api from './api';

const userService = {
  // Obtenir le profil
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Mettre à jour le profil
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Obtenir les statistiques
  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  // Suivre un utilisateur (bonus)
  followUser: async (userId) => {
    const response = await api.post(`/users/follow/${userId}`);
    return response.data;
  },

  // Ne plus suivre un utilisateur (bonus)
  unfollowUser: async (userId) => {
    const response = await api.delete(`/users/follow/${userId}`);
    return response.data;
  },

  // Obtenir le feed social (bonus)
  getSocialFeed: async () => {
    const response = await api.get('/users/feed');
    return response.data;
  }
};

export default userService;