import { useContext, useState } from 'react';
import { GoalContext } from '../../context/GoalContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Edit2, 
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const GoalCard = ({ goal, onEdit }) => {
  const { deleteGoal } = useContext(GoalContext);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      setDeleting(true);
      await deleteGoal(goal._id);
      setDeleting(false);
    }
  };

  const progress = Math.min(
    Math.round((goal.currentValue / goal.targetValue) * 100),
    100
  );

  const isExpired = new Date(goal.deadline) < new Date() && !goal.isCompleted;
  const daysRemaining = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <Card className={`transition-all duration-200 ${
      goal.isCompleted 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
        : isExpired 
        ? 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200' 
        : 'hover:shadow-xl'
    }`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Informations */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm ${
                goal.isCompleted 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                  : isExpired 
                  ? 'bg-gradient-to-br from-red-500 to-pink-600' 
                  : 'bg-gradient-to-br from-primary-500 to-primary-600'
              }`}>
                {goal.isCompleted ? (
                  <CheckCircle2 className="text-white" size={24} />
                ) : isExpired ? (
                  <AlertCircle className="text-white" size={24} />
                ) : (
                  <Target className="text-white" size={24} />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{goal.type}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {goal.isCompleted && (
                    <Badge variant="success">✓ Complété</Badge>
                  )}
                  {isExpired && !goal.isCompleted && (
                    <Badge variant="danger">⚠ Expiré</Badge>
                  )}
                  {!goal.isCompleted && !isExpired && daysRemaining <= 7 && (
                    <Badge variant="warning">🔔 {daysRemaining}j restants</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {goal.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{goal.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              Échéance : {formatDate(goal.deadline)}
            </div>
            <div className="flex items-center">
              <TrendingUp size={16} className="mr-1" />
              {goal.currentValue} / {goal.targetValue}
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="lg:w-1/3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progression</span>
            <span className={`text-lg font-bold ${
              goal.isCompleted ? 'text-green-600' : 
              progress >= 75 ? 'text-primary-600' : 
              progress >= 50 ? 'text-yellow-600' : 'text-orange-600'
            }`}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                goal.isCompleted 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                  : progress >= 75 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600' 
                  : progress >= 50 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                  : 'bg-gradient-to-r from-orange-500 to-red-500'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
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
        </div>
      </div>
    </Card>
  );
};

export default GoalCard;