import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base_url } from '../api';
import { useNavigation } from '@react-navigation/native';  
import { updateNotification } from '../actions/notificationActions';  // Removed the import for `registerForPushNotificationsAsync` as we won't be using it here
import { useDispatch } from 'react-redux';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, dispatch: authDispatch } = useAuthContext();
  const navigation = useNavigation();
  const reduxDispatch = useDispatch();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(base_url + '/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();

    if (!response.ok) {
      console.log(json.error);
      setIsLoading(false);
      setError(json.error);
      return;
    }

    // Fetch the expoPushToken from AsyncStorage
    const expoPushTokenFromStorage = await AsyncStorage.getItem('expoPushToken');

    if (expoPushTokenFromStorage) {
      console.log("Expo push token from storage:", expoPushTokenFromStorage);

      // Update the auth context with the fetched token
      authDispatch({ type: 'UPDATE_PUSH_TOKEN', payload: expoPushTokenFromStorage });

      // Update the backend with the fetched token
      try {
        await reduxDispatch(updateNotification({
          email: email,
          token: expoPushTokenFromStorage
        }));
      } catch (error) {
        console.log('Error updating push token:', error);
      }
    }

    // Save the user to async storage
    await AsyncStorage.setItem('user', JSON.stringify(json));

    // Update the auth context
    authDispatch({ type: 'LOGIN', payload: json });

    setIsLoading(false);

    navigation.navigate('HomeScreen');
  };

  return { login, isLoading, error };
};
