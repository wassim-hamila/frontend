import api from './api';

const workoutService = {
  // Obtenir tous les workouts
  getWorkouts: async () => {
    const response = await api.get('/workouts');
    return response.data;
  },

  // Obtenir un workout spécifique
  getWorkout: async (id) => {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
  },

  // Créer un workout
  createWorkout: async (workoutData) => {
    const response = await api.post('/workouts', workoutData);
    return response.data;
  },

  // Mettre à jour un workout
  updateWorkout: async (id, workoutData) => {
    const response = await api.put(`/workouts/${id}`, workoutData);
    return response.data;
  },

  // Supprimer un workout
  deleteWorkout: async (id) => {
    const response = await api.delete(`/workouts/${id}`);
    return response.data;
  }
};

export default workoutService;