import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { AuthContextProvider } from './context/AuthContext';
import YourAppNavigation from './YourAppNavigation';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

export default function App() {
  return (
    <Provider store={store}>
      <AuthContextProvider>
        <NavigationContainer>
          <YourAppNavigation />
        </NavigationContainer>
      </AuthContextProvider>
    </Provider>
  );
}
