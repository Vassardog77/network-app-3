import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import NavBar from './components/Navigation/Navbar';
import LoginPage from './components/UserLogin/LoginPage.js';
import SignupPage from './components/UserLogin/SignupPage.js';
import LoginList from './components/MediaLogin/LoginList';
import Messages from './components/Messages/ChatVisuals';
import Feed from './components/Feed/Feed';
import Home from './components/Home/homeVisuals';
import Email from './components/Email/emailVisuals';
import Analytics from './components/Analytics/analyticsFunctionality';
import Profile from './components/Profile/profileMain';
import AltProfile from './components/Profile/profileView';
import SinglePost from './components/Feed/SinglePost';
import Form from './components/Posting/Form';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      {/* Add other screens related to Home if necessary */}
    </Stack.Navigator>
  );
}

function FeedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Feed" component={Feed} />
      <Stack.Screen name="SinglePost" component={SinglePost} />
      <Stack.Screen name="Form" component={Form} />
      {/* Add other screens related to Feed if necessary */}
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Messages" component={Messages} />
      {/* Add other screens related to Messages if necessary */}
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="AltProfile" component={AltProfile} />
      {/* Add other screens related to Profile if necessary */}
    </Stack.Navigator>
  );
}

function EmailStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Email" component={Email} />
      {/* Add other screens related to Email if necessary */}
    </Stack.Navigator>
  );
}

function AnalyticsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Analytics" component={Analytics} />
      {/* Add other screens related to Analytics if necessary */}
    </Stack.Navigator>
  );
}

export default function YourAppNavigation() {
  return (
    <Tab.Navigator tabBar={props => <NavBar {...props} />}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Feed" component={FeedStack} />
      <Tab.Screen name="Messages" component={MessagesStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Email" component={EmailStack} />
      <Tab.Screen name="Analytics" component={AnalyticsStack} />
      {/* Add other screen stacks as necessary */}
    </Tab.Navigator>
  );
}
