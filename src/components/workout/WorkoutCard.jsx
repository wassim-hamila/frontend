import { useContext, useState } from 'react';
import { WorkoutContext } from '../../context/WorkoutContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { Clock, Flame, Calendar, Edit2, Trash2 } from 'lucide-react';
import { formatDate, formatDuration, WORKOUT_ICONS } from '../../utils/helpers';

const WorkoutCard = ({ workout, onEdit }) => {
  const { deleteWorkout } = useContext(WorkoutContext);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet entraînement ?')) {
      setDeleting(true);
      await deleteWorkout(workout._id);
      setDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-2xl shadow-sm">
            {WORKOUT_ICONS[workout.type] || '⚡'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{workout.type}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Calendar size={14} className="mr-1" />
              {formatDate(workout.date || workout.createdAt)}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <Clock size={16} className="mr-2 text-primary-600" />
          <span className="text-sm font-medium">{formatDuration(workout.duration)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Flame size={16} className="mr-2 text-orange-500" />
          <span className="text-sm font-medium">{workout.caloriesBurned} calories</span>
        </div>
      </div>

      {workout.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-700 italic line-clamp-2">{workout.notes}</p>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button
          variant="outline"
          size="small"
          onClick={onEdit}
        >
          <Edit2 size={16} className="mr-1" />
          Modifier
        </Button>
        <Button
          variant="danger"
          size="small"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 size={16} className="mr-1" />
          {deleting ? 'Suppression...' : 'Supprimer'}
        </Button>
      </div>
    </Card>
  );
};

export default WorkoutCard;