// AuthContext.js

import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isUserLoggedIn: true };
    case 'LOGOUT':
      return { ...state, user: null, isUserLoggedIn: false };
    case 'UPDATE_PUSH_TOKEN':
      return { 
        ...state, 
        user: {
          ...state.user,
          expoPushToken: action.payload 
        } 
      }; // this updates the expoPushToken of the current user in the state
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null, isUserLoggedIn: false });

  const loadInitialState = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user !== null) {
        dispatch({ type: 'LOGIN', payload: JSON.parse(user) });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadInitialState();
  }, []);

  //console.log('AuthContext state:', state); //logs the entire user oject upon logging in

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
