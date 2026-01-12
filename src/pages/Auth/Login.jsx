import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { Dumbbell, Mail, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    const result = await login(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setLocalError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo et titre */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full mb-4 shadow-lg">
              <Dumbbell className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Fitness Tracker</h1>
            <p className="text-gray-600 mt-2">Connectez-vous à votre compte</p>
          </div>

          {/* Alertes d'erreur */}
          {(localError || error) && (
            <Alert type="error" message={localError || error} />
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
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
                  placeholder="votre@email.com"
                  required
                  className="input pl-10"
                />
              </div>
            </div>

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

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          {/* Lien vers inscription */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              S'inscrire gratuitement
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

export default Login;
