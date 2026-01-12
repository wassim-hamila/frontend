import { createContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = await authService.getProfile();
          dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };
    
    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      const user = await authService.register(userData);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      const user = await authService.login(credentials);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la connexion';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const updateUser = (userData) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: userData });
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
