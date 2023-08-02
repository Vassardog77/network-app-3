//ported to react native
import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });

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

  console.log('AuthContext state:', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
