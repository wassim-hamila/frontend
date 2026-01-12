import { createContext, useReducer, useCallback } from 'react';
import goalService from '../services/goalService';
import { getErrorMessage } from '../utils/helpers';

export const GoalContext = createContext();

const initialState = {
  goals: [],
  isLoading: false,
  error: null
};

const GOAL_ACTIONS = {
  SET_GOALS: 'SET_GOALS',
  ADD_GOAL: 'ADD_GOAL',
  UPDATE_GOAL: 'UPDATE_GOAL',
  DELETE_GOAL: 'DELETE_GOAL',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

const goalReducer = (state, action) => {
  switch (action.type) {
    case GOAL_ACTIONS.SET_GOALS:
      return {
        ...state,
        goals: action.payload,
        isLoading: false,
        error: null
      };
    
    case GOAL_ACTIONS.ADD_GOAL:
      return {
        ...state,
        goals: [action.payload, ...state.goals],
        isLoading: false,
        error: null
      };
    
    case GOAL_ACTIONS.UPDATE_GOAL:
      return {
        ...state,
        goals: state.goals.map(g =>
          g._id === action.payload._id ? action.payload : g
        ),
        isLoading: false,
        error: null
      };
    
    case GOAL_ACTIONS.DELETE_GOAL:
      return {
        ...state,
        goals: state.goals.filter(g => g._id !== action.payload),
        isLoading: false,
        error: null
      };
    
    case GOAL_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case GOAL_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    default:
      return state;
  }
};

export const GoalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(goalReducer, initialState);

  const fetchGoals = useCallback(async () => {
    try {
      dispatch({ type: GOAL_ACTIONS.SET_LOADING, payload: true });
      const data = await goalService.getGoals();
      dispatch({ type: GOAL_ACTIONS.SET_GOALS, payload: data });
    } catch (error) {
      dispatch({ type: GOAL_ACTIONS.SET_ERROR, payload: getErrorMessage(error) });
    }
  }, []);

  const createGoal = async (goalData) => {
    try {
      dispatch({ type: GOAL_ACTIONS.SET_LOADING, payload: true });
      const newGoal = await goalService.createGoal(goalData);
      dispatch({ type: GOAL_ACTIONS.ADD_GOAL, payload: newGoal });
      return { success: true, data: newGoal };
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: GOAL_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  const updateGoal = async (id, goalData) => {
    try {
      dispatch({ type: GOAL_ACTIONS.SET_LOADING, payload: true });
      const updatedGoal = await goalService.updateGoal(id, goalData);
      dispatch({ type: GOAL_ACTIONS.UPDATE_GOAL, payload: updatedGoal });
      return { success: true, data: updatedGoal };
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: GOAL_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  const deleteGoal = async (id) => {
    try {
      dispatch({ type: GOAL_ACTIONS.SET_LOADING, payload: true });
      await goalService.deleteGoal(id);
      dispatch({ type: GOAL_ACTIONS.DELETE_GOAL, payload: id });
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: GOAL_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  const value = {
    ...state,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal
  };

  return (
    <GoalContext.Provider value={value}>
      {children}
    </GoalContext.Provider>
  );
};