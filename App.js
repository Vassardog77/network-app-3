import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from './hooks/useAuthContext';
import { AuthContextProvider } from './context/AuthContext';
import reducers from './reducers';

import LoginPage from './components/UserLogin/LoginPage.js';
import SignupPage from './components/UserLogin/SignupPage.js';

import YourAppNavigation from './YourAppNavigation';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

export default function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setIsUserLoggedIn(true);
        } else {
          setIsUserLoggedIn(false);
        }
      } catch (error) {
        console.error("Error fetching 'user' from AsyncStorage:", error);
        setIsUserLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  if (isUserLoggedIn === null) {
    return null; // or a loading spinner if you prefer
  }

  return (
    <Provider store={store}>
      <AuthContextProvider>
        <NavigationContainer>
          {isUserLoggedIn ? <YourAppNavigation /> : <LoginPage />}
        </NavigationContainer>
      </AuthContextProvider>
    </Provider>
  );
}
