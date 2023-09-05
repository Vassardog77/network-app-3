import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { createPost } from '../../actions/posts';
import Chatbot from './Chatbot';
import InstagramLogin from '../MediaLogin/InstagramLogin';
import FacebookLogin from '../MediaLogin/FacebookLogin';
import { base_url } from '../../api';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Form(props) {
    const [instagram_login, setInstagramLogin] = useState(null);
    const [current_user, setCurrentUser] = useState(null);

    useEffect(() => {
        (async () => {
            const igLogin = await AsyncStorage.getItem('instagram_login');
            const user = await AsyncStorage.getItem('user');
            setInstagramLogin(igLogin);
            setCurrentUser(JSON.parse(user));
        })();
    }, []);

    const [postData, setPostData] = useState({ creator: '', message: '', tags: '', selectedFile: '', date: '' });
    const [MediaSelector, setMediaSelector] = useState("Network");
    const [CreationId, setCreationId] = useState("");

    const change_mediaselector_instagram = () => {
        setMediaSelector("Instagram");
    };

    const change_mediaselector_network = () => {
        setMediaSelector("Network");
    };

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(MediaSelector === "Network") { 
            dispatch(createPost(postData));
            Alert.alert("Post Created!");
            setPostData({ creator: current_user.email, message: '', tags: '', selectedFile: '', date: '' });
        } else if (MediaSelector === "Instagram") {
            if (postData.date) {
                const delay = new Date(postData.date).getTime() - new Date().getTime();
                if (delay > 0) {
                    setTimeout(() => {
                        axios.post(base_url+"/post/ig1", postData)
                            .then((response) => {
                                console.log(JSON.stringify(response.data));
                                setCreationId(response.data.id);
                                Alert.alert("Post Created!");
                                setPostData({ creator: current_user.email, message: '', tags: '', selectedFile: '', date: '' });
                                sessionStorage.setItem('closePopups', 'true');
                            })
                            .catch((error) => {
                                Alert.alert("Error Creating Post. \nPlease make sure that you are logged in and try again");
                                console.log(error);
                            });
                    }, delay);
                } else {
                    Alert.alert("The date/time must be in the future.");
                }
            } else {
                axios.post(base_url+"/post/ig1", postData)
                    .then((response) => {
                        console.log(JSON.stringify(response.data));
                        setCreationId(response.data.id);
                        Alert.alert("Post Created!");
                        setPostData({ creator: current_user.email, message: '', tags: '', selectedFile: '', date: '' });
                        sessionStorage.setItem('closePopups', 'true');
                    })
                    .catch((error) => {
                        Alert.alert("Error Creating Post. \nPlease make sure that you are logged in and try again");
                        console.log(error);
                    });
            }
        }
    };

    const clear = () => {
        setPostData({ creator: current_user.email, message: '', tags: '', selectedFile: '', date: '' });
    };

    useEffect(() => {
        if(CreationId === "") {
            return;
        }
        axios.post(base_url+"/post/ig2", {
            "creation_id":CreationId,
            "user": current_user.email
        });
    }, [CreationId]);

    useEffect(() => {
        if ((instagram_login === 'false' || instagram_login === null) && MediaSelector === "Instagram") {
            console.log("not logged in with instagram");
        }
    }, [instagram_login, MediaSelector]);

    const pickImage = () => {
        ImagePicker.showImagePicker(response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setPostData({ ...postData, selectedFile: response.data });
            }
        });
    };

    return (
        <View style={styles.post_maker}>
            <View style={styles.media_selector_button}>
                <Text>Posting to: {MediaSelector}</Text>
                <Button title="Network" onPress={change_mediaselector_network} />
                <Button title="Instagram" onPress={change_mediaselector_instagram} />
            </View>

            {(instagram_login === 'false' || instagram_login === null) && MediaSelector === "Instagram" ? (
                <View style={styles.login_message}>
                    <Text>Please log in with Instagram to continue</Text>
                    <View style={styles.Loginbar}>
                        <FacebookLogin />
                        <InstagramLogin />
                    </View>
                </View>
            ) : (
                <View>
                    <Button title="Pick an image" onPress={pickImage} />
                    <TextInput placeholder='Message' value={postData.message} onChangeText={(text) => setPostData({ ...postData, message: text })} />
                    <Text>Schedule your post? (optional)</Text>
                    <TextInput placeholder="Enter date and time" onChangeText={(text) => setPostData({ ...postData, date: text })} />
                    <Button title="Submit Post" onPress={handleSubmit} />
                </View>
            )}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    mediaSelectorButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    loginMessage: {
        alignItems: 'center'
    },
    loginBar: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginVertical: 5
    }
});

export default Form;
