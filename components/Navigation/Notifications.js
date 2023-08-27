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

    const handlePress = (path) => {
        navigation.navigate(path);
    }

    return (
        <View style={styles.dropdown}>
            {(!Array.isArray(validNotifications) || validNotifications.length === 0) ? (
                <Text style={styles.item}>No new notifications</Text>
            ) : (
                validNotifications.reverse().map((notification, index) => {
                    let path;
                    if (notification.type === 'message') {
                        path = `MessagesScreen`; // Update with your screen name for messages
                    } else if (notification.type === 'comment' || notification.type === 'reply') {
                        path = `PostScreen`; // Update with your screen name for post
                    }
                    
                    const messageContent = (notification.content && typeof notification.content.message === 'string') 
                        ? (notification.content.message.length > 20 ? notification.content.message.slice(0, 20) + '...' : notification.content.message) 
                        : 'No message';
                    const senderName = (typeof notification.sender === 'string' ? notification.sender.split('@')[0] : 'unknown');

                    return path ? (
                        <TouchableOpacity key={index} style={styles.link} onPress={() => handlePress(path)}>
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
        // Style your dropdown container as per your design
    },
    item: {
        // Style your notification item as per your design
    },
    link: {
        // Style your link, if it differs from the default notification item
    }
});

export default Notifications;
