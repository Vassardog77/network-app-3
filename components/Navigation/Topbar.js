import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useLogout } from "../../hooks/useLogout";
import { base_url } from "../../api";
import Notifications from './Notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NavBar() {
    const { logout } = useLogout();
    const [currentUser, setCurrentUser] = useState(null);
    const notificationRef = useRef();

    const notifications = useSelector(state => state.notifications);
    const validNotifications = Array.isArray(notifications)
    ? notifications.filter(notification => ['message', 'comment', 'reply'].includes(notification.type))
    : [];
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch the user from AsyncStorage
        async function fetchUserFromStorage() {
            try {
                const userJSON = await AsyncStorage.getItem('user');
                if (userJSON) {
                    setCurrentUser(JSON.parse(userJSON));
                }
            } catch (error) {
                console.error('Error fetching user from storage:', error);
            }
        }
        
        fetchUserFromStorage();

        if (currentUser && currentUser.email) {
            axios.post(base_url+'/notification/get', {user: currentUser.email})
                .then(response => {
                    dispatch({ type: 'SET_NOTIFICATIONS', payload: response.data });
                })
                .catch(error => {
                    console.error('Error fetching notifications:', error);
                });
        }
    }, [dispatch, currentUser]);

    const [isNotificationVisible, setNotificationVisibility] = useState(false);

    function displayNotification() {
        setNotificationVisibility(!isNotificationVisible);
    }

    let notificationCount = validNotifications ? validNotifications.length : 0;

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
            <View />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={displayNotification} style={{ marginRight: 10 }}>
                    <FontAwesome name="bell" size={30} />
                    {notificationCount > 0 && (
                        <View style={{ position: 'absolute', right: 0, top: 0, backgroundColor: 'red', borderRadius: 10, padding: 5 }}>
                            <Text style={{ color: 'white' }}>{notificationCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                
                {isNotificationVisible && (
                    <View ref={notificationRef} style={{ position: 'absolute', top: 40 }}>
                        <Notifications />
                    </View>
                )}
                
                {currentUser && currentUser.profile_pic && (
                    <Image source={{ uri: currentUser.profile_pic }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
                )}
                <TouchableOpacity onPress={logout}>
                    <Text>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
