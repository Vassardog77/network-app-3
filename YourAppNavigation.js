import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import NavBar from './components/Navigation/Navbar';
import Topbar from './components/Navigation/Topbar'
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
import Chat from './components/Messages/Chat';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="FormScreen" component={Form} />
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
      {/* Add other screens related to Feed if necessary */}
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagesScreen" component={Messages} />
      <Stack.Screen name="ChatScreen" component={Chat} />
      {/* Add other screens related to Messages if necessary */}
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={Profile} />
      <Stack.Screen name="AltProfileScreen" component={AltProfile} />
      {/* Add other screens related to Profile if necessary */}
    </Stack.Navigator>
  );
}

function EmailStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmailScreen" component={Email} />
      {/* Add other screens related to Email if necessary */}
    </Stack.Navigator>
  );
}

function AnalyticsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AnalyticsScreen" component={Analytics} />
      {/* Add other screens related to Analytics if necessary */}
    </Stack.Navigator>
  );
}

export default function YourAppNavigation() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Topbar />
      </SafeAreaView>
      <Tab.Navigator tabBar={props => <NavBar {...props} />}>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Feed" component={FeedStack} />
        <Tab.Screen name="Messages" component={MessagesStack} />
        <Tab.Screen name="Profile" component={ProfileStack} />
        <Tab.Screen name="Email" component={EmailStack} />
        <Tab.Screen name="Analytics" component={AnalyticsStack} />
        {/* Add other screen stacks as necessary */}
      </Tab.Navigator>
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
