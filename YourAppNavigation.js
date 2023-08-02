//ported to react native
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthContext } from './context/AuthContext.js';

import LoginPage from './components/UserLogin/LoginPage';
import SignupPage from './components/UserLogin/SignupPage';
/*import NavBar from './components/Navigation/Navbar'
import TopBar from './components/Navigation/Topbar'
import LoginList from './components/MediaLogin/LoginList'
import Messages from './components/Messages/ChatVisuals';
import Feed from './components/Feed/Feed';
import Home from './components/Home/homeVisuals';
import Email from './components/Email/emailVisuals';
import Rsvp from './components/Rsvp/rsvpVisuals';
import Analytics from './components/Analytics/analyticsFunctionality';
import Profile from './components/Profile/profileMain';
import AltProfile from './components/Profile/profileView';
import SinglePost from './components/Feed/SinglePost';
import Form from './components/Posting/Form';*/

const Stack = createStackNavigator();

function YourAppNavigation() {
  //const { user } = useAuthContext();

  /*if (user) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Feed" component={Feed} />
        <Stack.Screen name="Messages" component={Messages} />
        <Stack.Screen name="Email" component={Email} />
        <Stack.Screen name="Rsvp" component={Rsvp} />
        <Stack.Screen name="Analytics" component={Analytics} />
        <Stack.Screen name="SinglePost" component={SinglePost} />
        <Stack.Screen name="CreatePost" component={Form} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="AltProfile" component={AltProfile} />
      </Stack.Navigator>
    );
  } else {*/
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Signup" component={SignupPage} />
      </Stack.Navigator>
    );
  //}
}

export default YourAppNavigation;
