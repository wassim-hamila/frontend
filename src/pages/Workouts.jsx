import { useEffect, useState, useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import EmptyState from '../components/common/EmptyState';
import WorkoutForm from '../components/workout/WorkoutForm';
import WorkoutCard from '../components/workout/WorkoutCard';
import { Plus, Activity, Filter } from 'lucide-react';
import { WORKOUT_TYPES } from '../utils/constants';

const Workouts = () => {
  const { workouts, fetchWorkouts, isLoading, error } = useContext(WorkoutContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleOpenModal = (workout = null) => {
    setEditingWorkout(workout);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingWorkout(null);
    setIsModalOpen(false);
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
    handleCloseModal();
  };

  const filteredWorkouts = filterType
    ? workouts.filter(w => w.type === filterType)
    : workouts;

  if (isLoading && workouts.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Mes Entraînements</h1>
            <p className="text-gray-600 mt-2">
              {workouts.length} entraînement{workouts.length > 1 ? 's' : ''} enregistré{workouts.length > 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            Nouvel entraînement
          </Button>
        </div>

        {/* Messages */}
        {successMessage && <Alert type="success" message={successMessage} />}
        {error && <Alert type="error" message={error} />}

        {/* Filtres */}
        <Card className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filtrer par type :</span>
            <button
              onClick={() => setFilterType('')}
              className={`px-3 py-1 rounded-full text-sm transition ${
                filterType === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tous ({workouts.length})
            </button>
            {WORKOUT_TYPES.map((type) => {
              const count = workouts.filter(w => w.type === type).length;
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    filterType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type} ({count})
                </button>
              );
            })}
          </div>
        </Card>

        {/* Liste des workouts */}
        {filteredWorkouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.map((workout) => (
              <WorkoutCard
                key={workout._id}
                workout={workout}
                onEdit={() => handleOpenModal(workout)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState
              icon={Activity}
              title="Aucun entraînement trouvé"
              description={filterType 
                ? `Aucun entraînement de type "${filterType}"`
                : "Commencez par ajouter votre premier entraînement"
              }
              action={
                <Button variant="primary" onClick={() => handleOpenModal()}>
                  <Plus size={20} className="mr-2" />
                  Ajouter un entraînement
                </Button>
              }
            />
          </Card>
        )}

        {/* Modal de formulaire */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingWorkout ? 'Modifier l\'entraînement' : 'Nouvel entraînement'}
          size="medium"
        >
          <WorkoutForm
            workout={editingWorkout}
            onSuccess={handleSuccess}
            onCancel={handleCloseModal}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Workouts;