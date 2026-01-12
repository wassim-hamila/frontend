import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Spinner from '../components/common/Spinner';
import { User, Mail, Calendar, Weight, Ruler, Save, Activity } from 'lucide-react';
import { calculateBMI, getBMICategory, formatDate } from '../utils/helpers';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await userService.getProfile();
      setFormData({
        name: profile.name || '',
        age: profile.age || '',
        weight: profile.weight || '',
        height: profile.height || ''
      });
      setLoading(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du chargement du profil' });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const profileData = {
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined
      };

      const updatedProfile = await userService.updateProfile(profileData);
      updateUser(updatedProfile);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erreur lors de la mise à jour' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  const bmi = formData.weight && formData.height 
    ? calculateBMI(formData.weight, formData.height)
    : null;
  
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations personnelles</p>
        </div>

        {message.text && (
          <Alert type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations du profil */}
          <div className="lg:col-span-2">
            <Card title="Informations personnelles">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <Input
                    label="Nom complet"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="input pl-10 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Âge"
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="25"
                      min="13"
                      max="120"
                    />

                    <Input
                      label="Poids (kg)"
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="70"
                      step="0.1"
                      min="20"
                      max="300"
                    />

                    <Input
                      label="Taille (cm)"
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="175"
                      min="50"
                      max="300"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit" variant="primary" disabled={saving}>
                    <Save size={20} className="mr-2" />
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Statistiques personnelles */}
          <div className="space-y-6">
            {/* Carte utilisateur */}
            <Card>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <User className="text-white" size={48} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{formData.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">Membre depuis</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">
                    {user?.createdAt && formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </Card>

            {/* IMC */}
            {bmi && (
              <Card title="IMC (Indice de Masse Corporelle)">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {bmi}
                  </div>
                  <p className={`text-sm font-medium mb-4 ${bmiCategory.color}`}>
                    {bmiCategory.label}
                  </p>
                  <div className="space-y-2 text-xs text-left">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Sous-poids</span>
                      <span className="font-semibold">&lt; 18.5</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>Normal</span>
                      <span className="font-semibold">18.5 - 25</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Surpoids</span>
                      <span className="font-semibold">25 - 30</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Obésité</span>
                      <span className="font-semibold">&gt; 30</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Mesures */}
            <Card title="Mes mesures">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="text-primary-600 mr-3" size={20} />
                    <span className="text-sm font-medium">Âge</span>
                  </div>
                  <span className="font-semibold">
                    {formData.age || '-'} {formData.age ? 'ans' : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Weight className="text-green-600 mr-3" size={20} />
                    <span className="text-sm font-medium">Poids</span>
                  </div>
                  <span className="font-semibold">
                    {formData.weight || '-'} {formData.weight ? 'kg' : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Ruler className="text-purple-600 mr-3" size={20} />
                    <span className="text-sm font-medium">Taille</span>
                  </div>
                  <span className="font-semibold">
                    {formData.height || '-'} {formData.height ? 'cm' : ''}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;