import { useEffect, useState, useContext } from 'react';
import { GoalContext } from '../context/GoalContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import EmptyState from '../components/common/EmptyState';
import GoalForm from '../components/goal/GoalForm';
import GoalCard from '../components/goal/GoalCard';
import { Plus, Target } from 'lucide-react';

const Goals = () => {
  const { goals, fetchGoals, isLoading, error } = useContext(GoalContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleOpenModal = (goal = null) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingGoal(null);
    setIsModalOpen(false);
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
    handleCloseModal();
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return !goal.isCompleted;
    if (filter === 'completed') return goal.isCompleted;
    return true;
  });

  const activeGoals = goals.filter(g => !g.isCompleted).length;
  const completedGoals = goals.filter(g => g.isCompleted).length;

  if (isLoading && goals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Objectifs</h1>
            <p className="text-gray-600 mt-2">
              {activeGoals} actif{activeGoals > 1 ? 's' : ''} • {completedGoals} complété{completedGoals > 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            Nouvel objectif
          </Button>
        </div>

        {/* Messages */}
        {successMessage && <Alert type="success" message={successMessage} />}
        {error && <Alert type="error" message={error} />}

        {/* Filtres */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tous ({goals.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'active'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Actifs ({activeGoals})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'completed'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Complétés ({completedGoals})
            </button>
          </div>
        </Card>

        {/* Liste des objectifs */}
        {filteredGoals.length > 0 ? (
          <div className="space-y-4">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onEdit={() => handleOpenModal(goal)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState
              icon={Target}
              title="Aucun objectif trouvé"
              description={
                filter === 'all'
                  ? "Commencez par définir votre premier objectif"
                  : filter === 'active'
                  ? "Vous n'avez aucun objectif actif"
                  : "Vous n'avez pas encore complété d'objectifs"
              }
              action={
                <Button variant="primary" onClick={() => handleOpenModal()}>
                  <Plus size={20} className="mr-2" />
                  Créer un objectif
                </Button>
              }
            />
          </Card>
        )}

        {/* Modal de formulaire */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingGoal ? 'Modifier l\'objectif' : 'Nouvel objectif'}
          size="medium"
        >
          <GoalForm
            goal={editingGoal}
            onSuccess={handleSuccess}
            onCancel={handleCloseModal}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Goals;