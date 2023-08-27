import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, Button, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Note: Assuming you are using Expo
import { getPosts } from '../../actions/posts';
import Posts from './Posts'; // Ensure this component is also adapted for React Native
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storage

function Feed({ navigation }) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPosts());
    }, [dispatch]);

    // Note: This method is asynchronous since accessing AsyncStorage is async in React Native
    const getCurrentUser = async () => {
        try {
            const userString = await AsyncStorage.getItem('user');
            return userString ? JSON.parse(userString) : null;
        } catch (error) {
            console.error("Failed reading user from AsyncStorage", error);
        }
    }

    const navigateToCreatePost = () => {
        navigation.navigate('CreatePost'); // Assuming you have a route named 'CreatePost'
    };

    return (
        <View style={styles.container}>
            <View style={styles.componentParent}>
                <View style={styles.componentHeader}>
                    <Text>Feed</Text>
                    <FontAwesome5 name="list-ul" size={24} color="black" />
                </View>

                {getCurrentUser().account_type !== 'student' && (
                    <View style={styles.createButtonContainer}>
                        <Button title="+ Create Post" onPress={navigateToCreatePost} />
                    </View>
                )}
                
                <Posts />
                <View style={styles.spacer}></View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    componentParent: {
        // Add styles similar to your .component_parent class
    },
    componentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // Add styles similar to your .component_header class
    },
    createButtonContainer: {
        // Add styles similar to your .create_buttons class
    },
    spacer: {
        // Add styles similar to your .spacer class
    },
});

export default Feed;
