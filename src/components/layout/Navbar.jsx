import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Dumbbell, 
  Home, 
  Activity, 
  Target, 
  User, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Entraînements', href: '/workouts', icon: Activity },
    { name: 'Objectifs', href: '/goals', icon: Target },
    { name: 'Social', href: '/social', icon: Users },
    { name: 'Profil', href: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo et nom */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition">
                <Dumbbell className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Fitness Tracker
              </span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Utilisateur et déconnexion */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-600">Bonjour,</p>
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Déconnexion"
              >
                <LogOut size={20} />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>

            {/* Bouton menu mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Info utilisateur mobile */}
            <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
              <p className="text-xs text-gray-600">Connecté en tant que</p>
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            {/* Navigation items */}
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {/* Bouton déconnexion mobile */}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={20} />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;