import { useState, useContext } from 'react';
import { WorkoutContext } from '../../context/WorkoutContext';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { WORKOUT_TYPES } from '../../utils/constants';

const WorkoutForm = ({ workout, onSuccess, onCancel }) => {
  const { createWorkout, updateWorkout } = useContext(WorkoutContext);
  const [formData, setFormData] = useState({
    type: workout?.type || '',
    duration: workout?.duration || '',
    caloriesBurned: workout?.caloriesBurned || '',
    date: workout?.date 
      ? new Date(workout.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    notes: workout?.notes || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const workoutData = {
      ...formData,
      duration: parseInt(formData.duration),
      caloriesBurned: parseInt(formData.caloriesBurned),
    };

    let result;
    if (workout) {
      result = await updateWorkout(workout._id, workoutData);
    } else {
      result = await createWorkout(workoutData);
    }

    if (result.success) {
      onSuccess(
        workout 
          ? 'Entraînement modifié avec succès !' 
          : 'Entraînement ajouté avec succès !'
      );
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const workoutOptions = WORKOUT_TYPES.map(type => ({
    value: type,
    label: type
  }));

  return (
    <form onSubmit={handleSubmit}>
      <Select
        label="Type d'entraînement"
        name="type"
        value={formData.type}
        onChange={handleChange}
        options={workoutOptions}
        required
        error={error && !formData.type ? 'Le type est requis' : ''}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Durée (minutes)"
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="30"
          required
          min="1"
          max="1440"
        />

        <Input
          label="Calories brûlées"
          type="number"
          name="caloriesBurned"
          value={formData.caloriesBurned}
          onChange={handleChange}
          placeholder="300"
          required
          min="0"
          max="10000"
        />
      </div>

      <Input
        label="Date"
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        max={new Date().toISOString().split('T')[0]}
      />

      <div className="mb-4">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optionnel)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Ajouter des notes sur votre entraînement..."
          rows="3"
          className="input"
          maxLength="500"
        />
        <p className="text-xs text-gray-500 mt-1">{formData.notes.length}/500 caractères</p>
      </div>

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Enregistrement...' : workout ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};

export default WorkoutForm;
