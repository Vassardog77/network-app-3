import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useAuthContext } from './hooks/useAuthContext'

import NavBar from './components/Navigation/Navbar';
import Topbar from './components/Navigation/Topbar'
//import LoginList from './components/MediaLogin/LoginList';
import Messages from './components/Messages/ChatVisuals';
import Feed from './components/Feed/Feed';
import Home from './components/Home/homeVisuals';
import Email from './components/Email/emailVisuals';
import Analytics from './components/Analytics/analyticsFunctionality';
import Profile from './components/Profile/profileMain';
import AltProfile from './components/Profile/profileView';
import SinglePost from './components/Feed/SinglePost';
import Form from './components/Posting/Form';
import Chat from './components/Messages/Chat';
import LoginPage from './components/UserLogin/LoginPage';
import SignupPage from './components/UserLogin/SignupPage';


const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="FormScreen" component={Form} />
      <Stack.Screen name="LoginScreen" component={LoginPage} />
      {/* Add other screens related to Home if necessary */}
    </Stack.Navigator>
  );
}

function FeedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FeedScreen" component={Feed} />
      <Stack.Screen name="SinglePostScreen" component={SinglePost} />
      <Stack.Screen name="FormScreen" component={Form} />
      <Stack.Screen name="LoginScreen" component={LoginPage} />
      {/* Add other screens related to Feed if necessary */}
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagesScreen" component={Messages} />
      <Stack.Screen name="ChatScreen" component={Chat} />
      <Stack.Screen name="LoginScreen" component={LoginPage} />
      {/* Add other screens related to Messages if necessary */}
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={Profile} />
      <Stack.Screen name="AltProfileScreen" component={AltProfile} />
      <Stack.Screen name="LoginScreen" component={LoginPage} />
      {/* Add other screens related to Profile if necessary */}
    </Stack.Navigator>
  );
}

function EmailStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmailScreen" component={Email} />
      <Stack.Screen name="LoginScreen" component={LoginPage} />
      {/* Add other screens related to Email if necessary */}
    </Stack.Navigator>
  );
}

function AnalyticsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AnalyticsScreen" component={Analytics} />
      <Stack.Screen name="LoginScreen" component={LoginPage} />
      {/* Add other screens related to Analytics if necessary */}
    </Stack.Navigator>
  );
}

export default function YourAppNavigation() {
  // Using the useAuthContext hook
  const { isUserLoggedIn, user } = useAuthContext();
  
  if (user) {
    console.log(user.account_type)
  } else {
    console.log ("no account type")
  }
  
  return (
    <View style={styles.container}>
      {/* Conditionally render Topbar if isUserLoggedIn is true */}
      {isUserLoggedIn && (
        <SafeAreaView style={styles.safeArea}>
          <Topbar />
        </SafeAreaView>
      )}

      {isUserLoggedIn ? (
        <Tab.Navigator tabBar={props => <NavBar {...props} />}>
          {/* Always show Home tab */}
          <Tab.Screen name="Home" component={HomeStack} />
          
          {/* Always show Feed and Messages for all users */}
          <Tab.Screen name="Feed" component={FeedStack} />
          <Tab.Screen name="Messages" component={MessagesStack} />

          {/* Only show the following tabs if account_type is not "student" */}
          {user && user.account_type !== "student" && (
            <>
              <Tab.Screen name="Profile" component={ProfileStack} />
              <Tab.Screen name="Email" component={EmailStack} />
              <Tab.Screen name="Analytics" component={AnalyticsStack} />
            </>
          )}
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoginScreen" component={LoginPage} />
          <Stack.Screen name="SignupScreen" component={SignupPage} />
          <Stack.Screen name="HomeScreen" component={Home} />
        </Stack.Navigator>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  safeArea: {
    paddingTop: 15
  }
});
