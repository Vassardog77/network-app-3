import React from 'react';
import { useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Notifications = () => {
    const navigation = useNavigation();
    const notifications = useSelector(state => state.notifications);
    const validNotifications = Array.isArray(notifications)
        ? notifications.filter(notification => ['message', 'comment', 'reply'].includes(notification.type))
        : [];

    const handlePress = (tabName, screenName, params = {}) => {
        navigation.navigate(tabName, {
          screen: screenName,
          params: params
        });
    }

    return (
        <View style={styles.dropdown}>
            {(!Array.isArray(validNotifications) || validNotifications.length === 0) ? (
                <Text style={styles.item}>No new notifications</Text>
            ) : (
                validNotifications.reverse().map((notification, index) => {
                    let path;
                    let extraParams = {}; // Define extra parameters here

                    if (notification.type === 'message') {
                        path = {tab: 'Messages', screen: 'MessagesScreen'};
                        extraParams = {room: notification.content.room}; // Passing the room prop to MessagesScreen
                    } else if (notification.type === 'comment' || notification.type === 'reply') {
                        path = {tab: 'Feed', screen: 'SinglePostScreen'};
                    }

                    const messageContent = (notification.content && typeof notification.content.message === 'string') 
                        ? (notification.content.message.length > 20 ? notification.content.message.slice(0, 20) + '...' : notification.content.message) 
                        : 'No message';
                    const senderName = (typeof notification.sender === 'string' ? notification.sender.split('@')[0] : 'unknown');

                    return path ? (
                        <TouchableOpacity key={index} style={styles.link} onPress={() => handlePress(path.tab, path.screen, extraParams)}>
                            <Text style={styles.item}>New {notification.type} from {senderName}: "{messageContent}"</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text key={index} style={styles.item}>New {notification.type} from {senderName}: "{messageContent}"</Text>
                    )
                })
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        zIndex: 1000, // This will place the dropdown in front of other components.
        backgroundColor: 'white', // This ensures that the dropdown is not transparent. You can adjust the color as per your design.
        width: 130,
        elevation: 5, // This adds a shadow on Android and gives a sense of elevation. Adjust as needed.
        shadowColor: '#000', // These properties add a shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
    },
    item: {
        // Style your notification item as per your design
    },
    link: {
        // Style your link, if it differs from the default notification item
    }
});

export default Notifications;