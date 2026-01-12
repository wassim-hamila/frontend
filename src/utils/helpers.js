// Formater la date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Formater la date courte
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Formater la durée en minutes
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h${mins}min` : `${hours}h`;
};

// Calculer le pourcentage de progression
export const calculateProgress = (current, target) => {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
};

// Valider l'email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Obtenir le message d'erreur
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    return error.response.data.errors.map(e => e.msg).join(', ');
  }
  return error.message || 'Une erreur est survenue';
};

// Calculer le BMI (Indice de Masse Corporelle)
export const calculateBMI = (weight, height) => {
  // weight en kg, height en cm
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

// Obtenir la catégorie BMI
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Sous-poids', color: 'text-warning' };
  if (bmi < 25) return { label: 'Normal', color: 'text-success' };
  if (bmi < 30) return { label: 'Surpoids', color: 'text-warning' };
  return { label: 'Obésité', color: 'text-danger' };
};

// Grouper par date
export const groupByDate = (items) => {
  return items.reduce((groups, item) => {
    const date = new Date(item.date || item.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});
};

// Calculer les statistiques de la semaine
export const getWeekStats = (workouts) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const weekWorkouts = workouts.filter(w => 
    new Date(w.date || w.createdAt) >= sevenDaysAgo
  );
  
  return {
    count: weekWorkouts.length,
    totalDuration: weekWorkouts.reduce((sum, w) => sum + w.duration, 0),
    totalCalories: weekWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0)
  };
};

// Préparer les données pour le graphique
export const prepareChartData = (workouts, days = 7) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateString = date.toISOString().split('T')[0];
    
    const dayWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.date || w.createdAt).toISOString().split('T')[0];
      return workoutDate === dateString;
    });
    
    data.push({
      date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
      workouts: dayWorkouts.length,
      duration: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
      calories: dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0)
    });
  }
  
  return data;
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};