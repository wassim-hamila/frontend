import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { WorkoutContext } from '../context/WorkoutContext';
import { GoalContext } from '../context/GoalContext';
import userService from '../services/userService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { 
  Activity, 
  Target, 
  Flame, 
  Clock, 
  TrendingUp,
  Plus,
  Calendar,
  Award
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { prepareChartData, formatDuration, CHART_COLORS } from '../utils/helpers';

const Dashboard = () => {
  const { workouts, fetchWorkouts } = useContext(WorkoutContext);
  const { goals, fetchGoals } = useContext(GoalContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchWorkouts(),
        fetchGoals(),
        loadStats()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  const loadStats = async () => {
    try {
      const data = await userService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  const chartData = prepareChartData(workouts, 7);
  
  const workoutTypeData = stats?.workouts?.byType?.map(item => ({
    name: item._id,
    value: item.count,
    calories: item.totalCalories
  })) || [];

  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Bienvenue ! Voici un aperçu de votre activité</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Activity}
            title="Entraînements"
            value={stats?.workouts?.total || 0}
            subtitle="Au total"
            color="bg-blue-500"
            trend="+12%"
          />
          <StatCard
            icon={Flame}
            title="Calories"
            value={Math.round(stats?.workouts?.stats?.totalCalories || 0).toLocaleString()}
            subtitle="Brûlées au total"
            color="bg-orange-500"
            trend="+8%"
          />
          <StatCard
            icon={Clock}
            title="Temps"
            value={formatDuration(stats?.workouts?.stats?.totalDuration || 0)}
            subtitle="D'entraînement"
            color="bg-green-500"
            trend="+15%"
          />
          <StatCard
            icon={Target}
            title="Objectifs"
            value={`${stats?.goals?.completed || 0}/${stats?.goals?.total || 0}`}
            subtitle={`${stats?.goals?.completionRate || 0}% complétés`}
            color="bg-purple-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Graphique d'activité des 7 derniers jours */}
          <Card title="Activité des 7 derniers jours">
            {chartData.some(d => d.calories > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="calories" 
                    fill={CHART_COLORS.primary} 
                    name="Calories" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Activity className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p>Aucune activité cette semaine</p>
                </div>
              </div>
            )}
          </Card>

          {/* Répartition par type d'exercice */}
          <Card title="Répartition des entraînements">
            {workoutTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={workoutTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {workoutTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p>Aucune donnée disponible</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Activités récentes et objectifs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Entraînements récents */}
          <Card 
            title="Entraînements récents"
            headerAction={
              <Link to="/workouts">
                <Button variant="outline" size="small">
                  Voir tout
                </Button>
              </Link>
            }
          >
            {workouts.length > 0 ? (
              <div className="space-y-3">
                {workouts.slice(0, 5).map((workout) => (
                  <div 
                    key={workout._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Activity className="text-primary-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{workout.type}</p>
                        <p className="text-sm text-gray-500">
                          {formatDuration(workout.duration)} • {workout.caloriesBurned} cal
                        </p>
                      </div>
                    </div>
                    <Calendar className="text-gray-400" size={16} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 mb-4">Aucun entraînement</p>
                <Link to="/workouts">
                  <Button variant="primary" size="small">
                    <Plus size={16} className="mr-2" />
                    Ajouter un entraînement
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Objectifs actifs */}
          <Card 
            title="Objectifs en cours"
            headerAction={
              <Link to="/goals">
                <Button variant="outline" size="small">
                  Voir tout
                </Button>
              </Link>
            }
          >
            {goals.filter(g => !g.isCompleted).length > 0 ? (
              <div className="space-y-3">
                {goals
                  .filter(g => !g.isCompleted)
                  .slice(0, 5)
                  .map((goal) => {
                    const progress = Math.min(
                      Math.round((goal.currentValue / goal.targetValue) * 100),
                      100
                    );
                    return (
                      <div key={goal._id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Award className="text-primary-600" size={18} />
                            <p className="font-medium text-gray-900">{goal.type}</p>
                          </div>
                          <span className="text-sm font-semibold text-primary-600">
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              progress >= 75 ? 'bg-green-500' :
                              progress >= 50 ? 'bg-primary-600' :
                              progress >= 25 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {goal.currentValue} / {goal.targetValue}
                        </p>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 mb-4">Aucun objectif actif</p>
                <Link to="/goals">
                  <Button variant="primary" size="small">
                    <Plus size={16} className="mr-2" />
                    Créer un objectif
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// Composant StatCard
const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => {
  return (
    <Card className="hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center shadow-sm`}>
              <Icon className="text-white" size={24} />
            </div>
            {trend && (
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                {trend}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
    </Card>
  );
};

export default Dashboard;