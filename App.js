import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { AuthContextProvider, AuthContext } from './context/AuthContext'; // <-- Make sure to import AuthContext
import YourAppNavigation from './YourAppNavigation';
import { MenuProvider } from 'react-native-popup-menu';
import { registerForPushNotificationsAsync } from './actions/notificationActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

export default function App() {
  useEffect(() => {
    async function fetchToken() {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        console.log("Received Expo Push Token:", token);
        // Optionally store the token in AsyncStorage or any other storage, if desired.
        await AsyncStorage.setItem('expoPushToken', token);
      }
    }
    fetchToken();
  }, []);

  return (
    <Provider store={store}>
      <AuthContextProvider>
        <NavigationContainer>
          <MenuProvider>
            <YourAppNavigation />
          </MenuProvider>
        </NavigationContainer>
      </AuthContextProvider>
    </Provider>
  );
}
