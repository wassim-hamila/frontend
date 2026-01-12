import { createContext, useReducer, useCallback } from 'react';
import workoutService from '../services/workoutService';
import { getErrorMessage } from '../utils/helpers';

export const WorkoutContext = createContext();

const initialState = {
  workouts: [],
  isLoading: false,
  error: null
};

const WORKOUT_ACTIONS = {
  SET_WORKOUTS: 'SET_WORKOUTS',
  ADD_WORKOUT: 'ADD_WORKOUT',
  UPDATE_WORKOUT: 'UPDATE_WORKOUT',
  DELETE_WORKOUT: 'DELETE_WORKOUT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

const workoutReducer = (state, action) => {
  switch (action.type) {
    case WORKOUT_ACTIONS.SET_WORKOUTS:
      return {
        ...state,
        workouts: action.payload,
        isLoading: false,
        error: null
      };
    
    case WORKOUT_ACTIONS.ADD_WORKOUT:
      return {
        ...state,
        workouts: [action.payload, ...state.workouts],
        isLoading: false,
        error: null
      };
    
    case WORKOUT_ACTIONS.UPDATE_WORKOUT:
      return {
        ...state,
        workouts: state.workouts.map(w =>
          w._id === action.payload._id ? action.payload : w
        ),
        isLoading: false,
        error: null
      };
    
    case WORKOUT_ACTIONS.DELETE_WORKOUT:
      return {
        ...state,
        workouts: state.workouts.filter(w => w._id !== action.payload),
        isLoading: false,
        error: null
      };
    
    case WORKOUT_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case WORKOUT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    default:
      return state;
  }
};

export const WorkoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  const fetchWorkouts = useCallback(async () => {
    try {
      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
      const data = await workoutService.getWorkouts();
      dispatch({ type: WORKOUT_ACTIONS.SET_WORKOUTS, payload: data });
    } catch (error) {
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: getErrorMessage(error) });
    }
  }, []);

  const createWorkout = async (workoutData) => {
    try {
      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
      const newWorkout = await workoutService.createWorkout(workoutData);
      dispatch({ type: WORKOUT_ACTIONS.ADD_WORKOUT, payload: newWorkout });
      return { success: true, data: newWorkout };
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  const updateWorkout = async (id, workoutData) => {
    try {
      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
      const updatedWorkout = await workoutService.updateWorkout(id, workoutData);
      dispatch({ type: WORKOUT_ACTIONS.UPDATE_WORKOUT, payload: updatedWorkout });
      return { success: true, data: updatedWorkout };
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  const deleteWorkout = async (id) => {
    try {
      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
      await workoutService.deleteWorkout(id);
      dispatch({ type: WORKOUT_ACTIONS.DELETE_WORKOUT, payload: id });
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  const value = {
    ...state,
    fetchWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
