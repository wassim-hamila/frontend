import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { Dumbbell, User, Mail, Lock, Calendar, Weight, Ruler } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    weight: '',
    height: ''
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    // Préparer les données
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      age: formData.age ? parseInt(formData.age) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined
    };

    const result = await register(userData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setLocalError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-blue-100 flex items-center justify-center p-4 py-12">
      <div className="max-w-3xl w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo et titre */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full mb-4 shadow-lg">
              <Dumbbell className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Créer un compte</h1>
            <p className="text-gray-600 mt-2">Commencez votre parcours fitness aujourd'hui</p>
          </div>

          {/* Alertes d'erreur */}
          {(localError || error) && (
            <Alert type="error" message={localError || error} />
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Âge (optionnel)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="25"
                    min="13"
                    max="120"
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poids kg (optionnel)
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="70"
                    step="0.1"
                    min="20"
                    max="300"
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Height */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taille cm (optionnel)
                </label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="175"
                    min="50"
                    max="300"
                    className="input pl-10"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? 'Inscription...' : 'Créer mon compte'}
            </Button>
          </form>

          {/* Lien vers connexion */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Se connecter
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-sm text-gray-500">
          © 2026 Fitness Tracker. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default Register;