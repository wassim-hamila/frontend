import api from './api';

const goalService = {
  // Obtenir tous les objectifs
  getGoals: async () => {
    const response = await api.get('/goals');
    return response.data;
  },

  // Obtenir un objectif spécifique
  getGoal: async (id) => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  // Créer un objectif
  createGoal: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  // Mettre à jour un objectif
  updateGoal: async (id, goalData) => {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data;
  },

  // Supprimer un objectif
  deleteGoal: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
};

export default goalService; 