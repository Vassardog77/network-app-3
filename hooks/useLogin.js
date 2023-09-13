//ported to react native
import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { base_url } from '../api';
import { useNavigation } from '@react-navigation/native';  

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigation = useNavigation();  // <-- Use the hook to get navigation object

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    console.log('url used for login call is ' + base_url + '/api/user/login');

    const response = await fetch(base_url + '/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();
    console.log('url used for login call was ' + base_url + '/api/user/login');

    if (!response.ok) {
      console.log(json.error);
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      console.log(json);
      // save the user to async storage
      await AsyncStorage.setItem('user', JSON.stringify(json));

      // update the auth context
      dispatch({ type: 'LOGIN', payload: json });

      // update loading state
      setIsLoading(false);
      navigation.navigate('HomeScreen');
    }
  };

  return { login, isLoading, error };
};
