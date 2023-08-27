import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { createPost } from '../../actions/posts';
import axios from 'axios';
import InstagramLogin from '../MediaLogin/InstagramLogin';
import FacebookLogin from '../MediaLogin/FacebookLogin';
import { base_url } from '../../api';

function Form(props) {
    const [instagram_login, setInstagramLogin] = useState(localStorage.getItem('instagram_login'));
    const current_user = JSON.parse(localStorage.getItem('user'));

    const [postData, setPostData] = useState({ creator: current_user.email, message: '', tags: '', selectedFile: '', date: '' });
    const [MediaSelector, setMediaSelector] = useState("Network");
    const [CreationId, setCreationId] = useState("");

    // ... (rest of the functions remains unchanged)

    return (
        <View style={styles.container}>
            <View style={styles.mediaSelectorButton}>
                <Text>Posting to: {MediaSelector}</Text>
                <Button title="Network" onPress={change_mediaselector_network} />
                <Button title="Instagram" onPress={change_mediaselector_instagram} />
            </View>
            {(instagram_login === 'false' || instagram_login === null) && MediaSelector === "Instagram" ? (
                <View style={styles.loginMessage}>
                    <Text>Please log in with Instagram to continue</Text>
                    <View style={styles.loginBar}>
                        <FacebookLogin />
                        <InstagramLogin />
                    </View>
                </View>
            ) : (
                <View>
                    {/* File Upload functionality is tricky in React Native. Consider using 'react-native-image-picker' or a similar library */}
                    <TextInput
                        style={styles.textInput}
                        placeholder="Message"
                        value={postData.message}
                        onChangeText={(text) => setPostData({ ...postData, message: text })}
                    />
                    {/* You can uncomment and use this if you need a tags field in the future 
                    <TextInput
                        style={styles.textInput}
                        placeholder="Tags"
                        value={postData.tags}
                        onChangeText={(text) => setPostData({ ...postData, tags: text })}
                    />*/}
                    <Text>Schedule your post? (optional)</Text>
                    {/* Consider using 'react-native-datetimepicker/datetimepicker' for date and time input */}
                    <Button title="Submit Post" onPress={handleSubmit} />
                    <Button title="Clear" onPress={clear} />
                    {/* If you have a Chatbot for React Native, you can include it here */}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    mediaSelectorButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    loginMessage: {
        alignItems: 'center',
    },
    loginBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
    },
});

export default Form;
