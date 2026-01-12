import { useState, useContext } from 'react';
import { GoalContext } from '../../context/GoalContext';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { GOAL_TYPES } from '../../utils/constants';

const GoalForm = ({ goal, onSuccess, onCancel }) => {
  const { createGoal, updateGoal } = useContext(GoalContext);
  const [formData, setFormData] = useState({
    type: goal?.type || '',
    targetValue: goal?.targetValue || '',
    currentValue: goal?.currentValue || 0,
    deadline: goal?.deadline 
      ? new Date(goal.deadline).toISOString().split('T')[0]
      : '',
    description: goal?.description || ''
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

    // Validation
    if (new Date(formData.deadline) <= new Date()) {
      setError('La date limite doit être dans le futur');
      setLoading(false);
      return;
    }

    const goalData = {
      ...formData,
      targetValue: parseFloat(formData.targetValue),
      currentValue: parseFloat(formData.currentValue),
    };

    let result;
    if (goal) {
      result = await updateGoal(goal._id, goalData);
    } else {
      result = await createGoal(goalData);
    }

    if (result.success) {
      onSuccess(
        goal 
          ? 'Objectif modifié avec succès !' 
          : 'Objectif créé avec succès !'
      );
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const goalOptions = GOAL_TYPES.map(type => ({
    value: type,
    label: type
  }));

  return (
    <form onSubmit={handleSubmit}>
      <Select
        label="Type d'objectif"
        name="type"
        value={formData.type}
        onChange={handleChange}
        options={goalOptions}
        required
        error={error && !formData.type ? 'Le type est requis' : ''}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Valeur actuelle"
          type="number"
          name="currentValue"
          value={formData.currentValue}
          onChange={handleChange}
          placeholder="0"
          required
          min="0"
          step="0.1"
        />

        <Input
          label="Valeur cible"
          type="number"
          name="targetValue"
          value={formData.targetValue}
          onChange={handleChange}
          placeholder="10"
          required
          min="0"
          step="0.1"
        />
      </div>

      <Input
        label="Date limite"
        type="date"
        name="deadline"
        value={formData.deadline}
        onChange={handleChange}
        required
        min={new Date().toISOString().split('T')[0]}
      />

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optionnel)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Décrivez votre objectif..."
          rows="3"
          className="input"
          maxLength="500"
        />
        <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 caractères</p>
      </div>

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Enregistrement...' : goal ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default GoalForm;